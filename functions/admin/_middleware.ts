import { requireAdmin, type AdminAuthEnv } from "../../shared/adminAuth";

interface Context {
  request: Request;
  env: AdminAuthEnv;
  next(): Promise<Response>;
}

/** Guards the admin SPA shell so /admin/* never renders for an anonymous visitor. */
export async function onRequest(context: Context) {
  const denied = requireAdmin(context.request, context.env);
  if (denied) return denied;

  const response = await context.next();
  const guarded = new Response(response.body, response);
  guarded.headers.set("Cache-Control", "no-store");
  return guarded;
}
