import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
const SECRET = process.env.AUTH_SECRET || "atelier-demo-secret-change-me";
function readSession(req: NextRequest) {
  const raw = req.cookies.get("atelier_session")?.value;
  if (!raw) return null;
  const [b64, mac] = raw.split(".");
  if (!b64 || !mac) return null;
  try {
    const payload = Buffer.from(b64, "base64url").toString("utf8");
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (expected !== mac) return null;
    return JSON.parse(payload) as { role: string };
  } catch { return null; }
}
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = readSession(req);
  if (pathname === "/generateur") {
    const url = req.nextUrl.clone();
    url.pathname = "/pro/site";
    return NextResponse.redirect(url);
  }
  const proPublic = pathname === "/pro/connexion" || pathname === "/pro";
  if (pathname.startsWith("/pro") && !proPublic) {
    if (!session || session.role !== "pro") {
      const url = req.nextUrl.clone();
      url.pathname = "/pro/connexion";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  if (pathname.startsWith("/compte") && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/pro/:path*", "/compte/:path*", "/compte", "/generateur"] };
