import { NextRequest, NextResponse } from "next/server";
import { getSalons } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const city = searchParams.get("city") || "";
  const metier = searchParams.get("metier") || "";
  const list = getSalons().filter((s) => {
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.services.some((sv) => sv.name.toLowerCase().includes(q));
    return matchQ && (!city || s.city === city) && (!metier || s.metier === metier);
  });
  return NextResponse.json({ salons: list });
}
