import { NextRequest, NextResponse } from "next/server";
import { findUser, setSession, toSession } from "@/lib/auth";
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const json = form ? null : await req.json().catch(() => null);
  const email = String(form?.get("email") || json?.email || "");
  const password = String(form?.get("password") || json?.password || "");
  const expectedRole = String(form?.get("role") || json?.role || "");
  const next = String(form?.get("next") || json?.next || "");
  const user = findUser(email, password);
  if (!user || (expectedRole && user.role !== expectedRole)) {
    const dest = expectedRole === "pro" ? "/pro/connexion" : "/connexion";
    return NextResponse.redirect(new URL(`${dest}?error=1`, req.url), 303);
  }
  await setSession(toSession(user));
  return NextResponse.redirect(new URL(next || (user.role === "pro" ? "/pro/agenda" : "/compte"), req.url), 303);
}
