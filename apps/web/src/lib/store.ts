import { promises as fs } from "fs";
import path from "path";
import salons from "@/data/salons.json";

export type Booking = {
  id: string;
  salonId: string;
  serviceId: string;
  staffId: string;
  date: string;
  start: string;
  durationMin: number;
  clientName: string;
  clientPhone: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "..", "..", "data");
const bookingsFile = path.join(dataDir, "bookings.json");

async function ensure() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(bookingsFile);
  } catch {
    const seed: Booking[] = [
      {
        id: "b-demo-1",
        salonId: "s1",
        serviceId: "sv1",
        staffId: "st1",
        date: new Date().toISOString().slice(0, 10),
        start: "11:00",
        durationMin: 45,
        clientName: "Camille R.",
        clientPhone: "06 00 00 00 01",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
    ];
    await fs.writeFile(bookingsFile, JSON.stringify(seed, null, 2));
  }
}

export function getSalons() {
  return salons;
}

export function getSalon(slugOrId: string) {
  return salons.find((s) => s.slug === slugOrId || s.id === slugOrId) ?? null;
}

export async function getBookings(): Promise<Booking[]> {
  await ensure();
  const raw = await fs.readFile(bookingsFile, "utf8");
  return JSON.parse(raw);
}

export async function saveBooking(b: Booking) {
  const all = await getBookings();
  all.push(b);
  await fs.writeFile(bookingsFile, JSON.stringify(all, null, 2));
  return b;
}
