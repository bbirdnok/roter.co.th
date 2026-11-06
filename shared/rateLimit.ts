import type { D1Database } from './d1';
import { HttpError, json } from './httpSecurity';

export interface RateLimitEnv {
  DB?: D1Database;
  ADMIN_PASSWORD?: string;
  TURNSTILE_SECRET_KEY?: string;
}

/** A shared D1 counter covers alternate Pages hostnames and concurrent isolates. */
export async function rateLimit(request: Request, env: RateLimitEnv, scope: 'admin' | 'lead') {
  const pepper = env.TURNSTILE_SECRET_KEY || env.ADMIN_PASSWORD;
  const ip = request.headers.get('CF-Connecting-IP');
  if (!env.DB || !pepper || !ip) throw new HttpError(503, 'Service temporarily unavailable');
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / 60) * 60;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const hash = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  const bucket = `${scope}:${Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')}`;
  const row = await env.DB.prepare(`
    INSERT INTO security_rate_limits (bucket, window_start, requests) VALUES (?, ?, 1)
    ON CONFLICT(bucket) DO UPDATE SET
      requests = CASE WHEN window_start = excluded.window_start THEN MIN(requests + 1, 1000000) ELSE 1 END,
      window_start = excluded.window_start
    RETURNING requests
  `).bind(bucket, windowStart).first<{ requests: number }>();
  if (!row || !Number.isSafeInteger(row.requests)) throw new HttpError(503, 'Service temporarily unavailable');
  // One request per minute per scope performs bounded retention cleanup.
  if (row.requests === 1) {
    await env.DB.prepare('DELETE FROM security_rate_limits WHERE window_start < ?')
      .bind(windowStart - 3600).run();
  }
  if (row.requests > (scope === 'admin' ? 60 : 10)) {
    return json({ error: 'Too many requests. Please try again shortly.' }, {
      status: 429, headers: { 'Retry-After': String(60 - (now - windowStart)) },
    });
  }
  return null;
}
