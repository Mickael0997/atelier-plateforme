import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/lib/store";
import { slotsForDay } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId") || "";
  const date = searchParams.get("date") || "";
  const durationMin = Number(searchParams.get("durationMin") || 30);
  const bookings = await getBookings();
  const slots = slotsForDay({ durationMin, bookings, staffId, date });
  return NextResponse.json({ slots });
}
