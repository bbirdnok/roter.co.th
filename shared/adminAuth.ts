const REALM = "Roter Admin";

export type AdminAuthEnv = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
};

const encoder = new TextEncoder();

/** Compares in constant time so a wrong password cannot be guessed from response timing. */
function timingSafeEqual(a: string, b: string) {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;

  let diff = 0;
  for (let i = 0; i < aBytes.length; i += 1) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

/** atob() yields one char per byte, so re-decode as UTF-8 to support non-ASCII passwords. */
function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function challenge() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Guards the admin surface with HTTP Basic auth.
 * Returns a rejection Response, or null when the request may continue.
 */
export function requireAdmin(request: Request, env: AdminAuthEnv): Response | null {
  const username = env.ADMIN_USERNAME;
  const password = env.ADMIN_PASSWORD;

  // Fail closed. A missing secret must never degrade into public access to lead data.
  if (!username || !password) {
    return new Response("Admin access is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const header = request.headers.get("Authorization") || "";
  const separatorIndex = header.indexOf(" ");
  const scheme = separatorIndex < 0 ? "" : header.slice(0, separatorIndex);
  const encoded = separatorIndex < 0 ? "" : header.slice(separatorIndex + 1).trim();
  if (scheme.toLowerCase() !== "basic" || !encoded) return challenge();

  let decoded: string;
  try {
    decoded = decodeBase64(encoded);
  } catch {
    return challenge();
  }

  const colonIndex = decoded.indexOf(":");
  if (colonIndex < 0) return challenge();

  // Both comparisons always run so the failure reason is not observable.
  const usernameMatches = timingSafeEqual(decoded.slice(0, colonIndex), username);
  const passwordMatches = timingSafeEqual(decoded.slice(colonIndex + 1), password);
  if (!usernameMatches || !passwordMatches) return challenge();

  return null;
}
