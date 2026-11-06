import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import type { D1Database } from '../../shared/d1';
import { publicError } from '../../shared/httpSecurity';
import { onRequestPost } from '../../functions/api/leads';
import { createLead } from '../../client/src/lib/leadsApi';

function environment() {
  const sqlite = new DatabaseSync(':memory:');
  for (const file of ['0001_create_leads.sql', '0003_contact_details_and_idempotency.sql']) {
    sqlite.exec(readFileSync(new URL(`../../migrations/${file}`, import.meta.url), 'utf8'));
  }
  const DB: D1Database = { prepare(sql) {
    let values: (string | number | null)[] = [];
    const prepared = {
      bind(...input: unknown[]) { values = input as typeof values; return prepared; },
      async first<T>() { return (sqlite.prepare(sql).get(...values) || null) as T | null; },
      async all<T>() { return { results: sqlite.prepare(sql).all(...values) as T[] }; },
      async run() { const result = sqlite.prepare(sql).run(...values); return { meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } }; },
    }; return prepared;
  } };
  return { DB, sqlite, TURNSTILE_SECRET_KEY: 'synthetic-only-secret' };
}
const payload = { submissionId: 'dbd45aad-cf22-4c90-927e-d2dfabecfe56', organizationType: 'enterprise', organizationName: "Synthetic '; DROP TABLE leads; --", organizationSize: 'small', fullName: '<script>not executable</script>', email: 'synthetic@example.invalid', phone: null, serviceInterest: 'scanning', jobTitle: 'Synthetic manager', documentVolume: 'massive', timeline: 'planned', message: 'Synthetic only', turnstileToken: 'synthetic-only-token' };
async function submit(env: ReturnType<typeof environment>, body = payload) {
  try {
    return await onRequestPost({ request: new Request('https://preview.example/api/leads', { method: 'POST', headers: { Origin: 'https://preview.example', 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env, waitUntil() {} });
  } catch (error) { return publicError(error); }
}
function verify(response = { success: true, hostname: 'preview.example', action: 'contact' }) {
  const fetcher = vi.fn(async () => Response.json(response)); vi.stubGlobal('fetch', fetcher); return fetcher;
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('real SQLite submission persistence and idempotency', () => {
  it('detects a combined UTF-8 request exceeding the server body limit before sending or consuming its token', async () => {
    const fetcher = verify();
    await expect(createLead({ ...payload, organizationName: 'ก'.repeat(255), fullName: 'ก'.repeat(255),
      jobTitle: 'ก'.repeat(120), message: 'ก'.repeat(4000), turnstileToken: 'x'.repeat(2048), email: 'a'.repeat(300) + '@example.invalid' }))
      .rejects.toMatchObject({ status: 413 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('stores every form detail after verification with bound SQL', async () => {
    const env = environment(); verify(); expect((await submit(env)).status).toBe(201);
    const row = env.sqlite.prepare('SELECT * FROM leads').get()!;
    expect(row.organization_name).toBe(payload.organizationName); expect(row.full_name).toBe(payload.fullName);
    expect(row.job_title).toBe(payload.jobTitle); expect(row.document_volume).toBe('massive'); expect(row.timeline).toBe('planned');
    expect(row.submission_key).toBe(payload.submissionId); expect(String(row.content_hash)).toHaveLength(64); env.sqlite.close();
  });
  it('acknowledges an identical retry after a committed response is lost without verifying a spent token again', async () => {
    const env = environment(); const fetcher = verify(); const first = await submit(env); const second = await submit(env);
    expect(first.status).toBe(201); expect(second.status).toBe(200); expect(await second.json()).toEqual(await first.json());
    expect(fetcher).toHaveBeenCalledTimes(1); expect(env.sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get()?.count).toBe(1); env.sqlite.close();
  });
  it('rejects using the same identifier for changed content', async () => {
    const env = environment(); verify(); await submit(env); expect((await submit(env, { ...payload, jobTitle: 'Changed' })).status).toBe(409);
    expect(env.sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get()?.count).toBe(1); env.sqlite.close();
  });
  it('has an atomic uniqueness constraint when simultaneous verified requests race', async () => {
    const env = environment(); verify(); const responses = await Promise.all([submit(env), submit(env)]);
    expect(responses.map(r => r.status).sort()).toEqual([200, 201]);
    expect(env.sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get()?.count).toBe(1); env.sqlite.close();
  });
  it.each([
    { success: false, hostname: 'preview.example', action: 'contact' },
    { success: true, hostname: 'other.example', action: 'contact' },
    { success: true, hostname: 'preview.example', action: 'other' },
    { success: true, hostname: 'preview.example', action: '' },
  ])('does not insert after invalid/expired/reused or wrong-context verification %j', async result => {
    const env = environment(); verify(result); expect((await submit(env)).status).toBe(400);
    expect(env.sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get()?.count).toBe(0); env.sqlite.close();
  });
  it.each([
    { jobTitle: 'x'.repeat(121) }, { documentVolume: 'unknown' }, { timeline: 'unknown' },
    { serviceInterest: 'unknown' }, { submissionId: 'bad' }, { fullName: '   ' }, { email: 'not-an-email' },
  ])('rejects invalid details before Siteverify %j', async changes => {
    const env = environment(); const fetcher = verify(); expect((await submit(env, { ...payload, ...changes })).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled(); env.sqlite.close();
  });
  it('keeps the database unchanged on an upstream timeout or failure', async () => {
    const env = environment(); vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('synthetic upstream failure'); }));
    const response = await submit(env); expect(response.status).toBe(503); expect(await response.text()).not.toContain('synthetic upstream');
    expect(env.sqlite.prepare('SELECT COUNT(*) AS count FROM leads').get()?.count).toBe(0); env.sqlite.close();
  });
});
