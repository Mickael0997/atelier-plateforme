import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBookings, getSalons } from "@/lib/store";
export default async function ComptePage() {
  const session = await getSession();
  if (!session) redirect("/connexion?next=/compte");
  const salons = getSalons();
  const bookings = (await getBookings()).filter(
    (b) => b.clientPhone === session.phone || b.clientName.toLowerCase() === session.name.toLowerCase()
  );
  return (
    <main>
      <section className="hero">
        <div className="meta">Espace particulier</div>
        <h1>Mes rendez-vous</h1>
        <p>Bonjour {session.name}. Ici uniquement vos reservations.</p>
      </section>
      {bookings.length === 0 ? (
        <p className="notice">Aucun rendez-vous. <Link href="/">Trouver un salon</Link></p>
      ) : (
        <ul className="list">
          {bookings.map((b) => {
            const salon = salons.find((s) => s.id === b.salonId);
            return (
              <li key={b.id}>
                <div>
                  <strong>{b.date} a {b.start}</strong>
                  <div className="meta">{salon?.name} · {b.status}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
