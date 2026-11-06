import type { D1Database } from '../../shared/d1';
import { escapeHtml, HttpError, json, readJsonObject, requireSameOrigin, textField } from '../../shared/httpSecurity';

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
const allowedServices = new Set(['scanning', 'edms', 'microfilm', 'ancient', 'workflow', 'consulting', 'products']);
const allowedVolumes = new Set(['small', 'medium', 'large', 'massive']);
const allowedTimelines = new Set(['urgent', 'soon', 'planned', 'future']);

async function verifyTurnstile(token: string, secret: string, hostname: string, remoteIp?: string) {
  if (!secret) throw new HttpError(503, 'Security verification is unavailable');
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new HttpError(503, 'Security verification is unavailable');
  const result = (await response.json()) as { success?: boolean; hostname?: string; action?: string };
  return result.success === true && result.hostname === hostname && result.action === 'contact';
}

export async function onRequestPost(context: Context) {
  requireSameOrigin(context.request);
  const payload = await readJsonObject(context.request);

  const honeypot = textField(payload.website, 200);
  if (honeypot) return json({ error: "Invalid submission" }, { status: 400 });

  const organizationType = textField(payload.organizationType, 64, true);
  const organizationName = textField(payload.organizationName, 255, true);
  const organizationSize = textField(payload.organizationSize, 64, true);
  const fullName = textField(payload.fullName, 255, true);
  const email = textField(payload.email, 320, true).toLowerCase();
  const phone = textField(payload.phone, 32) || null;
  const serviceInterest = textField(payload.serviceInterest, 255) || null;
  const message = textField(payload.message, MAX_MESSAGE_LENGTH) || null;
  const jobTitle = textField(payload.jobTitle, 120) || null;
  const documentVolume = textField(payload.documentVolume, 32) || null;
  const timeline = textField(payload.timeline, 32) || null;
  const submissionId = textField(payload.submissionId, 36, true);
  const turnstileToken = textField(payload.turnstileToken, 2048, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
    throw new HttpError(400, 'Invalid submission identifier');
  }

  if (!organizationName || !fullName || !email || !turnstileToken) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!allowedOrgTypes.has(organizationType) || !allowedOrgSizes.has(organizationSize)) {
    return json({ error: "Invalid organization details" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email address" }, { status: 400 });
  }
  if ((serviceInterest && !allowedServices.has(serviceInterest)) ||
      (documentVolume && !allowedVolumes.has(documentVolume)) ||
      (timeline && !allowedTimelines.has(timeline))) throw new HttpError(400, 'Invalid project details');
  if (!context.env.TURNSTILE_SECRET_KEY) throw new HttpError(503, 'Security verification is unavailable');

  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([
    organizationType, organizationName, organizationSize, fullName, email, phone, serviceInterest,
    message, jobTitle, documentVolume, timeline,
  ])));
  const contentHash = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
  const findExisting = () => context.env.DB.prepare('SELECT id, content_hash AS contentHash FROM leads WHERE submission_key = ?')
    .bind(submissionId).first<{ id: number; contentHash: string }>();
  const acknowledge = (existing: { id: number; contentHash: string }) => {
    if (existing.contentHash !== contentHash) throw new HttpError(409, 'Submission identifier already used');
    return json({ id: existing.id });
  };
  // A retry can acknowledge only the identical submission already verified and committed.
  // It cannot create a new lead without a fresh successful Siteverify response.
  const existing = await findExisting();
  if (existing?.id) return acknowledge(existing);

  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    context.env.TURNSTILE_SECRET_KEY,
    new URL(context.request.url).hostname,
    context.request.headers.get("CF-Connecting-IP") || undefined,
  );
  if (!turnstileOk) return json({ error: "Security verification failed" }, { status: 400 });

  const result = await context.env.DB.prepare(
    `INSERT INTO leads (
      organization_type, organization_name, organization_size, full_name,
      email, phone, service_interest, message, job_title, document_volume, timeline,
      submission_key, content_hash, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(submission_key) DO NOTHING`,
  )
    .bind(organizationType, organizationName, organizationSize, fullName, email, phone, serviceInterest, message,
      jobTitle, documentVolume, timeline, submissionId, contentHash)
    .run();

  const leadId = Number(result.meta?.last_row_id || 0);
  if (!result.meta?.changes) {
    const concurrent = await findExisting();
    if (concurrent?.id) return acknowledge(concurrent);
    throw new HttpError(503, 'Submission could not be confirmed');
  }
  if (!Number.isSafeInteger(leadId) || leadId < 1) throw new HttpError(503, 'Submission could not be confirmed');
  if (context.env.EMAIL && context.env.LEAD_NOTIFY_EMAIL && context.env.LEAD_EMAIL_FROM) {
    const detailRows = [
      ["Organization", organizationName],
      ["Name", fullName],
      ["Job title", jobTitle || '—'],
      ["Email", email],
      ["Phone", phone || "—"],
      ["Service", serviceInterest || "—"],
      ["Document volume", documentVolume || '—'],
      ["Timeline", timeline || '—'],
      ["Message", message || "—"],
    ]
      .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${label}</strong></td><td>${escapeHtml(String(value))}</td></tr>`)
      .join("");
    context.waitUntil(
      context.env.EMAIL.send({
        to: context.env.LEAD_NOTIFY_EMAIL,
        from: context.env.LEAD_EMAIL_FROM,
        subject: `New Roter website lead #${leadId}`,
        html: `<h2>New website lead #${leadId}</h2><table>${detailRows}</table>`,
        text: `New Roter website lead #${leadId}\nOrganization: ${organizationName}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone || "—"}\nService: ${serviceInterest || "—"}\nMessage: ${message || "—"}`,
      }).catch(() => { console.warn('Lead notification delivery failed'); }),
    );
  }

  return json({ id: leadId }, { status: 201 });
}
