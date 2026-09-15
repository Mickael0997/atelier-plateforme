import Link from "next/link";
import { notFound } from "next/navigation";
import { getSalon } from "@/lib/store";

export default async function SalonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const salon = getSalon(slug);
  if (!salon) notFound();

  return (
    <main className="layout-2">
      <section>
        <div className="meta">
          {salon.metier} · {salon.city}
        </div>
        <h1 style={{ fontSize: 48, margin: "8px 0" }}>{salon.name}</h1>
        <p style={{ color: "var(--muted)" }}>{salon.description}</p>
        <p>
          {salon.address}
          <br />
          {salon.phone}
        </p>
        <Link className="btn" href={`/reserver/${salon.slug}`}>
          Prendre rendez-vous
        </Link>
        <h2>Prestations</h2>
        <ul className="list">
          {salon.services.map((sv) => (
            <li key={sv.id}>
              <div>
                <strong>{sv.name}</strong>
                <div className="meta">
                  {sv.durationMin} min · {sv.category}
                </div>
              </div>
              <span className="price">{sv.priceEur} €</span>
            </li>
          ))}
        </ul>
      </section>
      <aside className="card">
        <h2 style={{ marginTop: 0 }}Équipe</h2>
        <ul className="list">
          {salon.staff.map((st) => (
            <li key={st.id}>
              <strong>{st.firstName}</strong>
              <span className="meta">{st.role}</span>
            </li>
          ))}
        </ul>
        <h2>Horaires</h2>
        <ul className="list">
          {Object.entries(salon.hours).map(([d, h]) => (
            <li key={d}>
              <span>{d}</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
