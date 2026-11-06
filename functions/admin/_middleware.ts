import { requireAdmin, type AdminAuthEnv } from "../../shared/adminAuth";
import { json, publicError, secureResponse } from "../../shared/httpSecurity";
import { rateLimit, type RateLimitEnv } from "../../shared/rateLimit";

interface Context {
  request: Request;
  env: AdminAuthEnv & RateLimitEnv;
  next(): Promise<Response>;
}

/** Guards the admin SPA shell so /admin/* never renders for an anonymous visitor. */
export async function onRequest(context: Context) {
  try {
    if (!context.env.ADMIN_USERNAME || !context.env.ADMIN_PASSWORD) return secureResponse(requireAdmin(context.request, context.env)!);
    const limited = await rateLimit(context.request, context.env, 'admin');
    if (limited) return limited;
    const denied = requireAdmin(context.request, context.env);
    if (denied) return secureResponse(denied);
    if (!['GET', 'HEAD'].includes(context.request.method)) return json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET, HEAD' } });
    return secureResponse(await context.next());
  } catch (error) { return publicError(error); }
}
