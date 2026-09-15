import { getSalons } from "@/lib/store";
import Link from "next/link";

export default function EtablissementPage() {
  const salon = getSalons()[0];
  return (
    <main>
      <section className="hero">
        <h1>{salon.name}</h1>
        <p>Fiche établissement.</p>
        <Link className="btn" href={`/salon/${salon.slug}`}>
          Voir la page publique
        </Link>
      </section>
    </main>
  );
}
