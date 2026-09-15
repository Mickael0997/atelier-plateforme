import Link from "next/link";
import salons from "@/data/salons.json";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; metier?: string }>;
}) {
  return <Marketplace searchParams={searchParams} />;
}

async function Marketplace({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; metier?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").toLowerCase();
  const city = sp.city || "";
  const metier = sp.metier || "";
  const list = salons.filter((s) => {
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.services.some((sv) => sv.name.toLowerCase().includes(q));
    return matchQ && (!city || s.city === city) && (!metier || s.metier === metier);
  });
  const cities = Array.from(new Set(salons.map((s) => s.city)));
  const metiers = Array.from(new Set(salons.map((s) => s.metier)));

  return (
    <main>
      <section className="hero">
        <h1>Trouvez un créneau. Laissez l’agenda se remplir.</h1>
        <p>
          Marketplace locale pour coiffeurs, barbiers, instituts et spas — réservation autonome,
          page établissement, et agents IA branchés en MCP.
        </p>
        <form className="search" action="/" method="get">
          <input name="q" placeholder="Prestation, salon, ville…" defaultValue={sp.q || ""} />
          <select name="city" defaultValue={city}>
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select name="metier" defaultValue={metier}>
            <option value="">Tous les métiers</option>
            {metiers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button className="btn" type="submit">
            Rechercher
          </button>
        </form>
      </section>
      <div className="grid">
        {list.map((s) => (
          <Link className="card" key={s.id} href={`/salon/${s.slug}`}>
            <div className="meta">
              {s.metier} · {s.city}
            </div>
            <h3>{s.name}</h3>
            <p style={{ color: "var(--muted)", margin: "0 0 12px" }}>{s.address}</p>
            <div className="price">
              ★ {s.rating} ({s.reviewCount}) · dès {Math.min(...s.services.map((x) => x.priceEur))} €
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
