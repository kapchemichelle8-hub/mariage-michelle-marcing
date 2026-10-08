import { createHash, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";

const SESSION_DURATION = "2h";
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; firstAt: number }>();

const digest = (value: string) => createHash("sha256").update(value).digest();

/** Comparaison à temps constant pour ne rien révéler du mot de passe. */
export function passwordMatches(candidate: string, expected: string) {
  if (!expected) return false;
  return timingSafeEqual(digest(candidate), digest(expected));
}

/** Limite les essais de mot de passe par adresse IP. */
export function isRateLimited(ip: string, now = Date.now()) {
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(ip: string, now = Date.now()) {
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(ip: string) {
  attempts.delete(ip);
}

const key = (secret: string) => new TextEncoder().encode(secret);

export async function createAdminToken(secret: string) {
  return new SignJWT({ role: "maries" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(key(secret));
}

export async function verifyAdminToken(token: string | undefined, secret: string) {
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    return payload.role === "maries";
  } catch {
    return false;
  }
}
