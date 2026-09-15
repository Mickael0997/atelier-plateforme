import Link from "next/link";

export default function ProSitePage() {
  return (
    <main className="hero">
      <h1>Mon site internet</h1>
      <p>Génération HTML + CTA réservation.</p>
      <Link className="btn" href="/generateur">
        Ouvrir le générateur
      </Link>
    </main>
  );
}
