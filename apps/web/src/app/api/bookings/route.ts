import { NextRequest, NextResponse } from "next/server";
import { getBookings, getSalon, saveBooking } from "@/lib/store";
import { slotsForDay } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const salonId = new URL(req.url).searchParams.get("salonId");
  const all = await getBookings();
  return NextResponse.json({ bookings: salonId ? all.filter((b) => b.salonId === salonId) : all });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const salon = getSalon(body.salonId);
  if (!salon) return NextResponse.json({ error: "Salon inconnu" }, { status: 404 });
  const service = salon.services.find((s) => s.id === body.serviceId);
  const staff = salon.staff.find((s) => s.id === body.staffId);
  if (!service || !staff) return NextResponse.json({ error: "Prestation ou collaborateur invalide" }, { status: 400 });
  if (!staff.serviceIds.includes(service.id)) {
    return NextResponse.json({ error: "Ce collaborateur ne réalise pas cette prestation" }, { status: 400 });
  }
  const bookings = await getBookings();
  const slots = slotsForDay({
    durationMin: service.durationMin,
    bookings,
    staffId: staff.id,
    date: body.date,
  });
  if (!slots.includes(body.start)) {
    return NextResponse.json({ error: "Créneau indisponible" }, { status: 409 });
  }
  const booking = await saveBooking({
    id: `b-${Date.now()}`,
    salonId: salon.id,
    serviceId: service.id,
    staffId: staff.id,
    date: body.date,
    start: body.start,
    durationMin: service.durationMin,
    clientName: String(body.clientName || "").trim(),
    clientPhone: String(body.clientPhone || "").trim(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ booking });
}
