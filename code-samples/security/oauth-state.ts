import crypto from "crypto";

export interface OAuthStatePayload {
  nonce: string;
  userId: string;
  workspaceId: string;
  issuedAt: number;
  expiresAt: number;
}

const MAX_AGE_MS = 10 * 60 * 1000;

function getStateSecret(): string {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET;

  if (!secret) {
    throw new Error("GOOGLE_OAUTH_STATE_SECRET is not configured.");
  }

  return secret;
}

export function createNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function createOAuthState(
  userId: string,
  workspaceId: string,
  nonce: string,
): string {
  const secret = getStateSecret();
  const issuedAt = Date.now();

  const payload: OAuthStatePayload = {
    nonce,
    userId,
    workspaceId,
    issuedAt,
    expiresAt: issuedAt + MAX_AGE_MS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyOAuthState(state: string): OAuthStatePayload | null {
  if (!state) return null;

  const [encodedPayload, signature, extraPart] = state.split(".");
  if (!encodedPayload || !signature || extraPart) return null;

  const secret = getStateSecret();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as OAuthStatePayload;

    if (
      !payload.nonce ||
      !payload.userId ||
      !payload.workspaceId ||
      !Number.isFinite(payload.issuedAt) ||
      !Number.isFinite(payload.expiresAt) ||
      Date.now() > payload.expiresAt ||
      payload.expiresAt - payload.issuedAt > MAX_AGE_MS
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
