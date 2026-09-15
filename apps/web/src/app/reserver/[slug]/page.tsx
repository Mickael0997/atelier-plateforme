import { notFound } from "next/navigation";
import { getSalon } from "@/lib/store";
import { BookingForm } from "./ui";

export default async function ReserverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const salon = getSalon(slug);
  if (!salon) notFound();
  return (
    <main>
      <section className="hero">
        <div className="meta">Réservation</div>
        <h1>{salon.name}</h1>
        <p>Choisissez une prestation, un collaborateur et un créneau. Confirmation immédiate (mode démo).</p>
      </section>
      <BookingForm salon={salon} />
    </main>
  );
}
