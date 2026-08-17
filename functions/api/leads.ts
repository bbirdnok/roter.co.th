type LeadStatus = "new" | "contacted" | "qualified" | "rejected";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<{ meta?: { last_row_id?: number } }>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface EmailBinding {
  send(message: { to: string; from: string; subject: string; html: string; text: string }): Promise<void>;
}

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  EMAIL?: EmailBinding;
  LEAD_NOTIFY_EMAIL?: string;
  LEAD_EMAIL_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}

const MAX_MESSAGE_LENGTH = 4_000;
const allowedOrgTypes = new Set(["government", "finance", "healthcare", "enterprise", "education", "other"]);
const allowedOrgSizes = new Set(["small", "medium", "large", "enterprise"]);

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json; charset=UTF-8", ...init.headers },
  });
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function verifyTurnstile(token: string, secret: string, remoteIp?: string) {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export async function onRequestPost(context: Context) {
  // The form is always served from the same host it posts to, so same-origin is the
  // real rule. Matching the request's own origin keeps CSRF blocked while letting the
  // form be exercised on *.pages.dev previews as well as the production domains.
  const origin = context.request.headers.get("Origin");
  const allowedOrigins = [
    new URL(context.request.url).origin,
    "https://roter.co.th",
    "https://www.roter.co.th",
  ];
  if (origin && !allowedOrigins.includes(origin)) {
    return json({ error: "Origin not allowed" }, { status: 403 });
  }

  const payload = (await context.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return json({ error: "Invalid request body" }, { status: 400 });

  const honeypot = text(payload.website, 200);
  if (honeypot) return json({ error: "Invalid submission" }, { status: 400 });

  const organizationType = text(payload.organizationType, 64);
  const organizationName = text(payload.organizationName, 255);
  const organizationSize = text(payload.organizationSize, 64);
  const fullName = text(payload.fullName, 255);
  const email = text(payload.email, 320).toLowerCase();
  const phone = text(payload.phone, 32) || null;
  const serviceInterest = text(payload.serviceInterest, 255) || null;
  const message = text(payload.message, MAX_MESSAGE_LENGTH) || null;
  const turnstileToken = text(payload.turnstileToken, 2_048);

  if (!organizationName || !fullName || !email || !turnstileToken) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!allowedOrgTypes.has(organizationType) || !allowedOrgSizes.has(organizationSize)) {
    return json({ error: "Invalid organization details" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email address" }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    context.env.TURNSTILE_SECRET_KEY,
    context.request.headers.get("CF-Connecting-IP") || undefined,
  );
  if (!turnstileOk) return json({ error: "Security verification failed" }, { status: 400 });

  const result = await context.env.DB.prepare(
    `INSERT INTO leads (
      organization_type, organization_name, organization_size, full_name,
      email, phone, service_interest, message, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
  )
    .bind(organizationType, organizationName, organizationSize, fullName, email, phone, serviceInterest, message)
    .run();

  const leadId = Number(result.meta?.last_row_id || 0);
  if (context.env.EMAIL && context.env.LEAD_NOTIFY_EMAIL && context.env.LEAD_EMAIL_FROM) {
    const detailRows = [
      ["Organization", organizationName],
      ["Name", fullName],
      ["Email", email],
      ["Phone", phone || "—"],
      ["Service", serviceInterest || "—"],
      ["Message", message || "—"],
    ]
      .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${label}</strong></td><td>${String(value).replace(/</g, "&lt;")}</td></tr>`)
      .join("");
    context.waitUntil(
      context.env.EMAIL.send({
        to: context.env.LEAD_NOTIFY_EMAIL,
        from: context.env.LEAD_EMAIL_FROM,
        subject: `New Roter website lead #${leadId}`,
        html: `<h2>New website lead #${leadId}</h2><table>${detailRows}</table>`,
        text: `New Roter website lead #${leadId}\nOrganization: ${organizationName}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone || "—"}\nService: ${serviceInterest || "—"}\nMessage: ${message || "—"}`,
      }),
    );
  }

  return json({ id: leadId }, { status: 201 });
}
