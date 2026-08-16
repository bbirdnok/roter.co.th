type LeadStatus = "new" | "contacted" | "qualified" | "rejected";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<{ meta?: { changes?: number } }>;
  first<T>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface Context {
  request: Request;
  env: { DB: D1Database };
  params: { id?: string | string[] };
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json; charset=UTF-8", ...init.headers },
  });
}

const statusValues = new Set<LeadStatus>(["new", "contacted", "qualified", "rejected"]);

export async function onRequestPatch(context: Context) {
  const rawId = Array.isArray(context.params.id) ? context.params.id[0] : context.params.id;
  const id = Number(rawId);
  const payload = (await context.request.json().catch(() => null)) as { status?: LeadStatus } | null;
  if (!Number.isInteger(id) || id <= 0 || !payload?.status || !statusValues.has(payload.status)) {
    return json({ error: "Invalid update request" }, { status: 400 });
  }

  const updated = await context.env.DB.prepare(
    "UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  )
    .bind(payload.status, id)
    .run();
  if (!updated.meta?.changes) return json({ error: "Lead not found" }, { status: 404 });

  const lead = await context.env.DB.prepare(
    `SELECT id, organization_type AS organizationType, organization_name AS organizationName,
      organization_size AS organizationSize, full_name AS fullName, email, phone,
      service_interest AS serviceInterest, message, status,
      created_at AS createdAt, updated_at AS updatedAt
     FROM leads WHERE id = ?`,
  )
    .bind(id)
    .first();
  return json({ lead });
}
