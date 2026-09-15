import { getBookings, getSalons } from "@/lib/store";

export default async function AgendaPage() {
  const salon = getSalons()[0];
  const bookings = (await getBookings()).filter((b) => b.salonId === salon.id && b.status !== "cancelled");
  const today = new Date().toISOString().slice(0, 10);
  const dayBookings = bookings.filter((b) => b.date === today);
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <main>
      <section className="hero">
        <div className="meta">Espace pro · {salon.name}</div>
        <h1>Agenda du jour</h1>
        <p>Vue collaborateurs, rendez-vous confirmés, base d’un logiciel type Planity Pro.</p>
      </section>
      <div className="kpis">
        <div className="kpi">
          <b>{dayBookings.length}</b>
          <span>RDV aujourd’hui</span>
        </div>
        <div className="kpi">
          <b>{confirmed}</b>
          <span>Confirmés (fichier local)</span>
        </div>
        <div className="kpi">
          <b>{salon.staff.length}</b>
          <span>Collaborateurs</span>
        </div>
        <div className="kpi">
          <b>0</b>
          <span>No-show (à brancher SMS)</span>
        </div>
      </div>
      <div className="agenda">
        <div className="col">
          <div className="meta">Heure</div>
        </div>
        {salon.staff.map((st) => (
          <div className="col" key={st.id}>
            <div className="meta">{st.firstName}</div>
            {dayBookings
              .filter((b) => b.staffId === st.id)
              .map((b) => {
                const service = salon.services.find((s) => s.id === b.serviceId);
                return (
                  <div className="block" key={b.id} style={{ background: st.color }}>
                    <strong>
                      {b.start} · {b.clientName}
                    </strong>
                    <div>{service?.name}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </main>
  );
}
