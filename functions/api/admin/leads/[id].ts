import type { D1Database } from '../../../../shared/d1';
import { integerParameter, json, readJsonObject } from '../../../../shared/httpSecurity';
type LeadStatus = "new" | "contacted" | "qualified" | "rejected";

interface Context {
  request: Request;
  env: { DB: D1Database };
  params: { id?: string | string[] };
}

const statusValues = new Set<LeadStatus>(["new", "contacted", "qualified", "rejected"]);

export async function onRequestPatch(context: Context) {
  const rawId = Array.isArray(context.params.id) ? context.params.id[0] : context.params.id;
  const id = integerParameter(rawId ?? '', 0, 1, Number.MAX_SAFE_INTEGER);
  const payload = await readJsonObject(context.request, 1024);
  if (Object.keys(payload).some(key => key !== 'status') || typeof payload.status !== 'string' || !statusValues.has(payload.status as LeadStatus)) {
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
      organization_size AS organizationSize, full_name AS fullName, job_title AS jobTitle,
      document_volume AS documentVolume, timeline, email, phone,
      service_interest AS serviceInterest, message, status,
      created_at AS createdAt, updated_at AS updatedAt
     FROM leads WHERE id = ?`,
  )
    .bind(id)
    .first();
  return json({ lead });
}
