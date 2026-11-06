export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com",
  "worker-src 'self' blob:",
].join('; ');

export function secureResponse(response: Response, privateResponse = true) {
  const result = new Response(response.body, response);
  result.headers.set('X-Content-Type-Options', 'nosniff');
  result.headers.set('X-Frame-Options', 'DENY');
  result.headers.set('Strict-Transport-Security', 'max-age=86400');
  result.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  result.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  result.headers.set('Content-Security-Policy', CSP);
  if (privateResponse) result.headers.set('Cache-Control', 'no-store');
  return result;
}

export function json(data: unknown, init: ResponseInit = {}) {
  return secureResponse(new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...init.headers },
  }));
}

export function publicError(error: unknown) {
  return error instanceof HttpError
    ? json({ error: error.message }, { status: error.status })
    : json({ error: 'Service temporarily unavailable' }, { status: 503 });
}

export function requireSameOrigin(request: Request) {
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site' ||
      request.headers.get('Origin') !== new URL(request.url).origin) {
    throw new HttpError(403, 'Origin not allowed');
  }
}

export async function readJsonObject(request: Request, maxBytes = 16_384): Promise<Record<string, unknown>> {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new HttpError(415, 'Content-Type must be application/json');
  }
  const declared = request.headers.get('Content-Length');
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) {
    throw new HttpError(413, 'Request body too large');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Invalid request body');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new HttpError(413, 'Request body too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try {
    const value: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new HttpError(400, 'Invalid request body');
  }
}

export function integerParameter(raw: string | null, fallback: number, min: number, max: number) {
  if (raw === null) return fallback;
  if (!/^(0|[1-9]\d*)$/.test(raw)) throw new HttpError(400, 'Invalid numeric parameter');
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new HttpError(400, 'Invalid numeric parameter');
  return value;
}

export function textField(value: unknown, maxLength: number, required = false) {
  if (value === undefined || value === null) {
    if (required) throw new HttpError(400, 'Missing required fields');
    return '';
  }
  if (typeof value !== 'string' || value.length > maxLength) throw new HttpError(400, 'Invalid field value');
  const result = value.trim();
  if (required && !result) throw new HttpError(400, 'Missing required fields');
  return result;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
