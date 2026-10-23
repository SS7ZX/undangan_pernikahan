import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "wedding_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

export function hasAdminAuthConfig(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(password && password.length >= 12 && secret && secret.length >= 32);
}

function signature(expiresAt: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return createHmac("sha256", secret).update(expiresAt).digest("hex");
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminAuthenticated(request: Request): boolean {
  if (!hasAdminAuthConfig()) return false;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return false;

  const token = cookie.slice(COOKIE_NAME.length + 1);
  const separator = token.indexOf(".");
  if (separator < 1) return false;

  const expiresAt = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;

  return constantTimeEqual(suppliedSignature, signature(expiresAt));
}

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  return Boolean(
    expectedPassword &&
      constantTimeEqual(password, expectedPassword)
  );
}

export function createAdminSessionCookie(): string {
  const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(`${expiresAt}.${signature(expiresAt)}`)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`;
}

export function clearAdminSessionCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`;
}
