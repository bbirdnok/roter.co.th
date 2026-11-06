import { requireAdmin, type AdminAuthEnv } from "../../../shared/adminAuth";
import { json, publicError, requireSameOrigin, secureResponse } from "../../../shared/httpSecurity";
import { rateLimit, type RateLimitEnv } from "../../../shared/rateLimit";

interface Context {
  request: Request;
  env: AdminAuthEnv & RateLimitEnv;
  next(): Promise<Response>;
}

export async function onRequest(context: Context) {
  try {
    if (!context.env.ADMIN_USERNAME || !context.env.ADMIN_PASSWORD) return secureResponse(requireAdmin(context.request, context.env)!);
    const limited = await rateLimit(context.request, context.env, 'admin');
    if (limited) return limited;
    const denied = requireAdmin(context.request, context.env);
    if (denied) return secureResponse(denied);
    const { pathname } = new URL(context.request.url);
    const method = pathname === '/api/admin/leads' ? 'GET' : /^\/api\/admin\/leads\/[1-9]\d*$/.test(pathname) ? 'PATCH' : null;
    if (!method) return json({ error: 'API endpoint not found' }, { status: 404 });
    if (context.request.method !== method) return json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: method } });
    if (method === 'PATCH') requireSameOrigin(context.request);
    return secureResponse(await context.next());
  } catch (error) { return publicError(error); }
}
