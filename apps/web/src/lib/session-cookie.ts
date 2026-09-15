import { createHmac } from "crypto";
import type { SessionUser } from "@/lib/auth";

export const SESSION_COOKIE = "atelier_session";
const SECRET = process.env.AUTH_SECRET || "atelier-demo-secret-change-me";

export function signPayload(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function encodeSession(user: SessionUser) {
  const payload = JSON.stringify(user);
  return `${Buffer.from(payload).toString("base64url")}.${signPayload(payload)}`;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
