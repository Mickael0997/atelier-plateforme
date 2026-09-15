"use client";

import { useEffect, useMemo, useState } from "react";

type Salon = {
  id: string;
  slug: string;
  name: string;
  services: { id: string; name: string; durationMin: number; priceEur: number }[];
  staff: { id: string; firstName: string; serviceIds: string[] }[];
};

export function BookingForm({ salon }: { salon: Salon }) {
  const [serviceId, setServiceId] = useState(salon.services[0]?.id || "");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const service = salon.services.find((s) => s.id === serviceId);
  const staffOptions = useMemo(
    () => salon.staff.filter((s) => s.serviceIds.includes(serviceId)),
    [salon.staff, serviceId]
  );
  useEffect(() => {
    if (!staffId && staffOptions[0]) setStaffId(staffOptions[0].id);
  }, [staffOptions, staffId]);
  useEffect(() => {
    if (!staffId || !service) return;
    fetch(`/api/availability?salonId=${salon.id}&staffId=${staffId}&date=${date}&durationMin=${service.durationMin}`)
      .then((r) => r.json())
      .then((d) => {
        setSlots(d.slots || []);
        setStart("");
      });
  }, [salon.id, staffId, date, service]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ salonId: salon.id, serviceId, staffId, date, start, clientName, clientPhone }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Impossible de réserver");
      return;
    }
    setMsg(`Réservé : ${data.booking.id} — ${date} à ${start}`);
  }
  return (
    <form className="layout-2" onSubmit={submit}>
      <div className="card">
        <label className="field">
          <div className="meta">Prestation</div>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {salon.services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.durationMin} min · {s.priceEur} €
              </option>
            ))}
          </select>
        </label>
        <label className="field" style={{ display: "block", marginTop: 12 }}>
          <div className="meta">Collaborateur</div>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            {staffOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName}
              </option>
            ))}
          </select>
        </label>
        <label className="field" style={{ display: "block", marginTop: 12 }}>
          <div className="meta">Date</div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <div style={{ marginTop: 16 }}>
          <div className="meta">Créneaux</div>
          <div className="slots">
            {slots.length === 0 && <p>Aucun créneau.</p>}
            {slots.map((h) => (
              <button type="button" key={h} className={`slot ${start === h ? "on" : ""}`} onClick={() => setStart(h)}>
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <label className="field" style={{ display: "block" }}>
          <div className="meta">Nom</div>
          <input required value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </label>
        <label className="field" style={{ display: "block", marginTop: 12 }}>
          <div className="meta">Téléphone</div>
          <input required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
        </label>
        <p className="notice">Mode démo : pas de paiement ni SMS.</p>
        <button className="btn" disabled={!start} style={{ marginTop: 16 }}>
          Confirmer le rendez-vous
        </button>
        {msg && <p>{msg}</p>}
      </div>
    </form>
  );
}
