export function timeToMin(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minToTime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function slotsForDay(opts: {
  durationMin: number;
  bookings: { staffId: string; date: string; start: string; durationMin?: number; status: string }[];
  staffId: string;
  date: string;
}) {
  const OPEN = 9 * 60;
  const CLOSE = 19 * 60;
  const taken = opts.bookings
    .filter((b) => b.staffId === opts.staffId && b.date === opts.date && b.status !== "cancelled")
    .map((b) => ({
      start: timeToMin(b.start),
      end: timeToMin(b.start) + (b.durationMin || opts.durationMin),
    }));
  const slots: string[] = [];
  for (let t = OPEN; t + opts.durationMin <= CLOSE; t += 15) {
    const end = t + opts.durationMin;
    if (!taken.some((x) => t < x.end && end > x.start)) slots.push(minToTime(t));
  }
  return slots;
}
