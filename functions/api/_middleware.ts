import { HttpError, json, publicError, requireSameOrigin, secureResponse } from '../../shared/httpSecurity';
import { rateLimit, type RateLimitEnv } from '../../shared/rateLimit';

interface Context { request: Request; env: RateLimitEnv; next(): Promise<Response> }

export async function onRequest(context: Context) {
  try {
    const { pathname } = new URL(context.request.url);
    if (pathname === '/api/leads') {
      if (context.request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
      requireSameOrigin(context.request);
      const limited = await rateLimit(context.request, context.env, 'lead');
      if (limited) return limited;
    } else if (!pathname.startsWith('/api/admin/')) {
      throw new HttpError(404, 'API endpoint not found');
    }
    return secureResponse(await context.next());
  } catch (error) {
    return publicError(error);
  }
}
