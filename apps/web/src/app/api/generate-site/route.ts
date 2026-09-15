import { NextRequest, NextResponse } from "next/server";
import { getSalon } from "@/lib/store";
import { generateSalonHtml } from "@/lib/site-generator";
import { getSession } from "@/lib/auth";
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "pro" || !session.salonId) {
    return NextResponse.json({ error: "Réservé à l’espace professionnel connecté." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.salonId && body.salonId !== session.salonId) {
    return NextResponse.json({ error: "Vous ne pouvez publier que votre établissement." }, { status: 403 });
  }
  const salon = getSalon(session.salonId);
  if (!salon) return NextResponse.json({ error: "Salon introuvable" }, { status: 404 });
  const origin = req.nextUrl.origin;
  const html = generateSalonHtml(salon, `${origin}/reserver/${salon.slug}`);
  return NextResponse.json({ html, bookingUrl: `${origin}/reserver/${salon.slug}` });
}
