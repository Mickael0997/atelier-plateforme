import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSalon } from "@/lib/store";
import { SiteStudio } from "./ui";
export default async function ProSitePage() {
  const session = await getSession();
  if (session?.role !== "pro" || !session.salonId) redirect("/pro/connexion");
  const salon = getSalon(session.salonId);
  if (!salon) redirect("/pro/etablissement");
  return (
    <main>
      <section className="hero">
        <div className="meta">Mon site internet</div>
        <h1>Vitrine de {salon.name}</h1>
        <p>Comme Planity : le site se construit a partir de votre fiche.</p>
      </section>
      <SiteStudio salonId={salon.id} salonName={salon.name} />
    </main>
  );
}
