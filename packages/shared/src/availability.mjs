const OPEN = 9 * 60;
const CLOSE = 19 * 60;

export function timeToMin(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minToTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function slotsForDay({ durationMin, bookings, staffId, date }) {
  const taken = bookings
    .filter((b) => b.staffId === staffId && b.date === date && b.status !== "cancelled")
    .map((b) => ({
      start: timeToMin(b.start),
      end: timeToMin(b.start) + (b.durationMin || durationMin),
    }));

  const slots = [];
  for (let t = OPEN; t + durationMin <= CLOSE; t += 15) {
    const end = t + durationMin;
    const clash = taken.some((x) => t < x.end && end > x.start);
    if (!clash) slots.push(minToTime(t));
  }
  return slots;
}

export function filterSalons(salons, { q = "", city = "", metier = "" } = {}) {
  const query = q.trim().toLowerCase();
  return salons.filter((s) => {
    const matchQ =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.metier.toLowerCase().includes(query) ||
      s.services.some((sv) => sv.name.toLowerCase().includes(query));
    const matchCity = !city || s.city.toLowerCase() === city.toLowerCase();
    const matchMetier = !metier || s.metier === metier;
    return matchQ && matchCity && matchMetier;
  });
}
