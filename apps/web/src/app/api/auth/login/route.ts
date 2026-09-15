import { NextRequest, NextResponse } from "next/server";
import { findUser, toSession } from "@/lib/auth";
import { encodeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session-cookie";

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const email = String(form?.get("email") || "");
  const password = String(form?.get("password") || "");
  const expectedRole = String(form?.get("role") || "");
  const next = String(form?.get("next") || "");

  const destFail = expectedRole === "pro" ? "/pro/connexion" : "/connexion";
  const user = findUser(email, password);

  if (!user || (expectedRole && user.role !== expectedRole)) {
    return NextResponse.redirect(new URL(`${destFail}?error=1`, req.nextUrl.origin), 303);
  }

  const session = toSession(user);
  const dest = next.startsWith("/") ? next : session.role === "pro" ? "/pro/agenda" : "/compte";
  const res = NextResponse.redirect(new URL(dest, req.nextUrl.origin), 303);
  res.cookies.set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions);
  return res;
}
