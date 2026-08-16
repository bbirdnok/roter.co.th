export type LeadStatus = "new" | "contacted" | "qualified" | "rejected";

export type Lead = {
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

export type CreateLeadInput = Omit<Lead, "id" | "status" | "createdAt" | "updatedAt"> & {
  turnstileToken: string;
};

type ApiErrorPayload = { error?: string };

async function readError(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
  return payload.error || "Request failed";
}

export async function createLead(input: CreateLeadInput) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as { id: number };
}

export async function listLeads(status?: LeadStatus) {
  const params = new URLSearchParams({ limit: "100", offset: "0" });
  if (status) params.set("status", status);

  const response = await fetch(`/api/admin/leads?${params.toString()}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as { leads: Lead[]; total: number };
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const response = await fetch(`/api/admin/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as { lead: Lead };
}
