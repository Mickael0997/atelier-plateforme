import { NextRequest, NextResponse } from "next/server";
import { getSalon } from "@/lib/store";
import { generateSalonHtml } from "@/lib/site-generator";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const salon = body.salonId ? getSalon(body.salonId) : body.salon;
  if (!salon) return NextResponse.json({ error: "Salon introuvable" }, { status: 404 });
  const origin = req.nextUrl.origin;
  const bookingUrl = `${origin}/reserver/${salon.slug || "preview"}`;
  const html = generateSalonHtml(salon, bookingUrl);
  return NextResponse.json({ html, bookingUrl });
}
