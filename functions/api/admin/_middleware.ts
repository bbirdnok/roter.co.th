import { requireAdmin, type AdminAuthEnv } from "../../../shared/adminAuth";

interface Context {
  request: Request;
  env: AdminAuthEnv;
  next(): Promise<Response>;
}

export async function onRequest(context: Context) {
  const denied = requireAdmin(context.request, context.env);
  if (denied) return denied;

  const response = await context.next();

  // Lead records are personal data — keep them out of every cache.
  const guarded = new Response(response.body, response);
  guarded.headers.set("Cache-Control", "no-store");
  return guarded;
}
