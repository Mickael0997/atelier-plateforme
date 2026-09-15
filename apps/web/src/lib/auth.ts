import { cookies } from "next/headers";
import { createHmac } from "crypto";
import users from "@/data/users.json";

export type Role = "client" | "pro";
export type SessionUser = { id: string; role: Role; name: string; email: string; phone: string; salonId: string | null };
const SECRET = process.env.AUTH_SECRET || "atelier-demo-secret-change-me";
const COOKIE = "atelier_session";
function sign(payload: string) { return createHmac("sha256", SECRET).update(payload).digest("hex"); }
export function findUser(email: string, password: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password) || null;
}
export function toSession(u: (typeof users)[number]): SessionUser {
  return { id: u.id, role: u.role as Role, name: u.name, email: u.email, phone: u.phone, salonId: u.salonId };
}
export async function setSession(user: SessionUser) {
  const payload = JSON.stringify(user);
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function getSession(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [b64, mac] = raw.split(".");
  if (!b64 || !mac) return null;
  try {
    const payload = Buffer.from(b64, "base64url").toString("utf8");
    if (sign(payload) !== mac) return null;
    return JSON.parse(payload) as SessionUser;
  } catch { return null; }
}
