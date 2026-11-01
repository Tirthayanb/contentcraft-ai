import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const KNOWN_INSECURE_DEFAULTS = new Set([
  "dev-secret-change-me",
  "replace-with-strong-random-secret",
]);

function loadJwtSecret(): string | undefined {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || KNOWN_INSECURE_DEFAULTS.has(secret)) {
    return undefined;
  }
  return secret;
}

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "contentcraft_session";

export interface SessionPayload {
  userId: string;
  email?: string;
  role: string;
}

export function signSession(payload: SessionPayload): string {
  const secret = loadJwtSecret();
  if (!secret) {
    throw new Error("JWT_SECRET is missing, too short, or insecure.");
  }
  return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  const secret = loadJwtSecret();
  if (!secret) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] }) as SessionPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
