type LeadStatus = "new" | "contacted" | "qualified" | "rejected";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface Context {
  request: Request;
  env: { DB: D1Database };
}

type LeadRow = {
  id: number;
  organizationType: string;
  organizationName: string;
  organizationSize: string;
  fullName: string;
  email: string;
  phone: string | null;
  serviceInterest: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json; charset=UTF-8", ...init.headers },
  });
}

const statusValues = new Set<LeadStatus>(["new", "contacted", "qualified", "rejected"]);

export async function onRequestGet(context: Context) {
  const url = new URL(context.request.url);
  const requestedStatus = url.searchParams.get("status") as LeadStatus | null;
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);

  if (requestedStatus && !statusValues.has(requestedStatus)) {
    return json({ error: "Invalid status" }, { status: 400 });
  }

  const columns = `
    id,
    organization_type AS organizationType,
    organization_name AS organizationName,
    organization_size AS organizationSize,
    full_name AS fullName,
    email,
    phone,
    service_interest AS serviceInterest,
    message,
    status,
    created_at AS createdAt,
    updated_at AS updatedAt`;
  const where = requestedStatus ? "WHERE status = ?" : "";
  const statement = context.env.DB.prepare(
    `SELECT ${columns} FROM leads ${where} ORDER BY datetime(created_at) DESC, id DESC LIMIT ? OFFSET ?`,
  );
  const countStatement = context.env.DB.prepare(`SELECT COUNT(*) AS count FROM leads ${where}`);
  const bindings: unknown[] = requestedStatus ? [requestedStatus, limit, offset] : [limit, offset];
  const countBindings: unknown[] = requestedStatus ? [requestedStatus] : [];

  const [rows, total] = await Promise.all([
    statement.bind(...bindings).all<LeadRow>(),
    countStatement.bind(...countBindings).first<{ count: number }>(),
  ]);
  return json({ leads: rows.results, total: total?.count || 0 });
}
