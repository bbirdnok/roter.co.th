import { afterEach, describe, expect, it, vi } from 'vitest';
import type { D1Database } from '../../shared/d1';
import { requireAdmin } from '../../shared/adminAuth';
import { escapeHtml, HttpError, integerParameter, readJsonObject, secureResponse } from '../../shared/httpSecurity';
import { rateLimit } from '../../shared/rateLimit';
import { onRequest as api } from '../../functions/api/_middleware';
import { onRequest as admin } from '../../functions/api/admin/_middleware';
import { onRequestGet } from '../../functions/api/admin/leads';
import { onRequestPatch } from '../../functions/api/admin/leads/[id]';
import { onRequestPost } from '../../functions/api/leads';

function database() {
  const counters = new Map<string, { window: number; requests: number }>();
  const statements: { sql: string; values: unknown[] }[] = [];
  const prepare = vi.fn((sql: string) => {
    const query = { sql, values: [] as unknown[] }; statements.push(query);
    const statement = {
      bind(...values: unknown[]) { query.values = values; return statement; },
      async run() { return { meta: { changes: 1, last_row_id: 7 } }; },
      async all() { return { results: [] }; },
      async first() {
        if (sql.includes('INSERT INTO security_rate_limits')) {
          const [key, window] = query.values as [string, number];
          const old = counters.get(key);
          const requests = old?.window === window ? old.requests + 1 : 1;
          counters.set(key, { window, requests }); return { requests };
        }
        return { count: 0 };
      },
    };
    return statement;
  });
  return { DB: { prepare } as unknown as D1Database, prepare, counters, statements };
}

function environment() { return { ...database(), ADMIN_USERNAME: 'preview', ADMIN_PASSWORD: 'local-test-only', TURNSTILE_SECRET_KEY: 'test-secret-only' }; }
function request(path: string, options: { method?: string; body?: string; origin?: string | null; auth?: string | null; contentType?: string; host?: string } = {}) {
  const host = options.host || 'preview.example';
  const headers: Record<string, string> = { 'CF-Connecting-IP': '192.0.2.42', 'Content-Type': options.contentType || 'application/json' };
  if (options.auth !== null) headers.Authorization = options.auth || `Basic ${btoa('preview:local-test-only')}`;
  if (options.origin !== null) headers.Origin = options.origin || `https://${host}`;
  return new Request(`https://${host}${path}`, { method: options.method || 'GET', headers, body: options.body });
}
async function handle(req: Request, env = environment()) {
  return api({ request: req, env, next: async () => {
    if (new URL(req.url).pathname.startsWith('/api/admin/')) {
      return admin({ request: req, env, next: () => req.method === 'PATCH'
        ? onRequestPatch({ request: req, env, params: { id: new URL(req.url).pathname.split('/').pop() } })
        : onRequestGet({ request: req, env }) });
    }
    return onRequestPost({ request: req, env, waitUntil: () => {} });
  } });
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('authentication and request boundaries', () => {
  it('fails closed when credentials are missing', () => {
    expect(requireAdmin(request('/admin'), {}).status).toBe(503);
  });
  it.each([null, 'Bearer untrusted', 'Basic %%%', `Basic ${btoa('preview:wrong')}`, 'Basic /w=='])('rejects invalid authorization %s', async auth => {
    expect((await handle(request('/api/admin/leads', { auth }))).status).toBe(401);
  });
  it('does not accept a forged identity header instead of credentials', async () => {
    const req = request('/api/admin/leads', { auth: null }); req.headers.set('Cf-Access-Authenticated-User-Email', 'admin@example.invalid');
    expect((await handle(req)).status).toBe(401);
  });
  it('allows authenticated access and never caches private responses', async () => {
    const response = await handle(request('/api/admin/leads'));
    expect(response.status).toBe(200); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ leads: [], total: 0 });
  });
  it.each(['https://evil.example', null])('blocks mutation origin %s', async origin => {
    expect((await handle(request('/api/admin/leads/1', { method: 'PATCH', body: '{"status":"contacted"}', origin }))).status).toBe(403);
  });
  it('blocks cross-site Fetch Metadata even if Origin looks valid', async () => {
    const req = request('/api/leads', { method: 'POST', body: '{}' }); req.headers.set('Sec-Fetch-Site', 'cross-site');
    expect((await handle(req)).status).toBe(403);
  });
  it.each(['DELETE', 'PUT', 'POST'])('does not expose unsupported admin method %s', async method => {
    const response = await handle(request('/api/admin/leads', { method }));
    expect(response.status).toBe(405); expect(response.headers.get('Allow')).toBe('GET');
  });
  it('does not return the SPA for unknown API routes', async () => {
    expect((await handle(request('/api/unknown'))).status).toBe(404);
  });
  it('does not disclose database exceptions', async () => {
    const env = environment(); env.prepare.mockImplementation(() => { throw new Error('secret password db://private-stack'); });
    const response = await handle(request('/api/admin/leads'), env);
    expect(response.status).toBe(503); expect(await response.text()).toBe('{"error":"Service temporarily unavailable"}');
  });
});

describe('validation rejects malformed data before application queries', () => {
  it.each(['NaN', 'Infinity', '-1', '1.5', '1e2', '101', '', '9007199254740993'])('rejects list limit %s', async value => {
    const env = environment(); expect((await handle(request(`/api/admin/leads?limit=${value}`), env)).status).toBe(400);
    expect(env.statements.some(s => s.sql.includes('FROM leads'))).toBe(false);
  });
  it.each(['NaN', 'Infinity', '-1', '10001'])('rejects offset %s', async value => {
    expect((await handle(request(`/api/admin/leads?offset=${value}`))).status).toBe(400);
  });
  it.each(['1.5', '1e2', '0', '-1', '9007199254740993'])('rejects invalid record id %s', async id => {
    const response = await handle(request(`/api/admin/leads/${id}`, { method: 'PATCH', body: '{"status":"contacted"}' }));
    expect([400, 404]).toContain(response.status);
  });
  it.each(['null', '[]', 'true', '{bad', '{"status":"admin"}', '{"status":"contacted","role":"admin"}'])('rejects update body %s', async body => {
    const env = environment(); expect((await handle(request('/api/admin/leads/1', { method: 'PATCH', body }), env)).status).toBe(400);
    expect(env.statements.some(s => s.sql.includes('UPDATE leads'))).toBe(false);
  });
  it('rejects an oversized body even without Content-Length', async () => {
    const response = await handle(request('/api/admin/leads/1', { method: 'PATCH', body: JSON.stringify({ status: 'x'.repeat(2000) }) }));
    expect(response.status).toBe(413);
  });
  it('counts actual UTF-8 bytes rather than string length', async () => {
    await expect(readJsonObject(request('/api/leads', { method: 'POST', body: JSON.stringify({ message: 'ก'.repeat(6000) }) }))).rejects.toMatchObject({ status: 413 });
  });
  it('requires JSON on mutation endpoints', async () => {
    expect((await handle(request('/api/admin/leads/1', { method: 'PATCH', body: 'status=contacted', contentType: 'application/x-www-form-urlencoded' }))).status).toBe(415);
  });
  it('rejects overlong fields instead of silently truncating them', async () => {
    expect((await handle(request('/api/leads', { method: 'POST', body: JSON.stringify({ organizationType: 'x'.repeat(65) }) }))).status).toBe(400);
  });
  it('only binds an allowed status and a safe integer', async () => {
    const env = environment(); const response = await handle(request('/api/admin/leads/7', { method: 'PATCH', body: '{"status":"contacted"}' }), env);
    expect(response.status).toBe(200);
    expect(env.statements.find(s => s.sql.includes('UPDATE leads'))?.values).toEqual(['contacted', 7]);
  });
});

describe('shared limiter and browser defenses', () => {
  it('limits requests across distinct hostnames using one shared bucket', async () => {
    const env = environment();
    for (let i = 0; i < 60; i++) expect(await rateLimit(request('/admin', { host: i % 2 ? 'a.example' : 'b.example' }), env, 'admin')).toBe(null);
    const denied = await rateLimit(request('/admin', { host: 'c.example' }), env, 'admin');
    expect(denied?.status).toBe(429); expect(Number(denied?.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(env.counters.size).toBe(1);
    expect([...env.counters.keys()][0]).not.toContain('192.0.2.42');
    expect([...env.counters.keys()][0]).not.toContain('local-test-only');
  });
  it('separates public submission and admin request budgets', async () => {
    const env = environment(); for (let i = 0; i < 10; i++) await rateLimit(request('/api/leads'), env, 'lead');
    expect((await rateLimit(request('/api/leads'), env, 'lead'))?.status).toBe(429);
    expect(await rateLimit(request('/admin'), env, 'admin')).toBe(null);
  });
  it('resets a counter at the next fixed window', async () => {
    const clock = vi.spyOn(Date, 'now'); clock.mockReturnValue(120_000); const env = environment();
    for (let i = 0; i < 11; i++) await rateLimit(request('/api/leads'), env, 'lead');
    clock.mockReturnValue(180_000); expect(await rateLimit(request('/api/leads'), env, 'lead')).toBe(null);
  });
  it('fails closed if a trusted client address is unavailable', async () => {
    const req = request('/admin'); req.headers.delete('CF-Connecting-IP');
    await expect(rateLimit(req, environment(), 'admin')).rejects.toMatchObject({ status: 503 });
  });
  it('escapes every HTML-significant character in notification text', () => {
    expect(escapeHtml('&<img src="x" onerror=\'evil()\'>')).toBe('&amp;&lt;img src=&quot;x&quot; onerror=&#39;evil()&#39;&gt;');
  });
  it('applies defensive headers to error responses as well as successes', () => {
    const response = secureResponse(new Response('denied', { status: 401 }));
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Content-Security-Policy')).toContain("frame-ancestors 'none'");
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});

describe('submission cannot skip Turnstile verification', () => {
  const payload = { organizationType: 'enterprise', organizationName: "Literal '; DROP TABLE leads; --", organizationSize: 'small', fullName: '<script>evil()</script>', email: 'test@example.invalid', turnstileToken: 'synthetic-token' };
  it.each([
    { success: false, hostname: 'preview.example' },
    { success: true, hostname: 'evil.example' },
    { success: true },
  ])('rejects an invalid verification response %j', async verification => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(verification)));
    const env = environment(); expect((await handle(request('/api/leads', { method: 'POST', body: JSON.stringify(payload) }), env)).status).toBe(400);
    expect(env.statements.some(s => s.sql.includes('INSERT INTO leads'))).toBe(false);
  });
  it('stores text only as prepared parameters after verified hostname', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true, hostname: 'preview.example' })));
    const env = environment(); const response = await handle(request('/api/leads', { method: 'POST', body: JSON.stringify(payload) }), env);
    expect(response.status).toBe(201); const insert = env.statements.find(s => s.sql.includes('INSERT INTO leads'))!;
    expect(insert.sql).not.toContain('DROP TABLE'); expect(insert.values).toContain(payload.organizationName); expect(insert.values).toContain(payload.fullName);
  });
  it('does not save data when verification has an upstream outage', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('internal upstream details')));
    const env = environment(); const response = await handle(request('/api/leads', { method: 'POST', body: JSON.stringify(payload) }), env);
    expect(response.status).toBe(503); expect(await response.text()).not.toContain('upstream details');
    expect(env.statements.some(s => s.sql.includes('INSERT INTO leads'))).toBe(false);
  });
});
