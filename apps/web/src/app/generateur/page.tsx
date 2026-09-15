"use client";
import { useState } from "react";
import salons from "@/data/salons.json";

export default function GenerateurPage() {
  const [salonId, setSalonId] = useState(salons[0].id);
  const [html, setHtml] = useState("");
  async function generate() {
    const res = await fetch("/api/generate-site", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ salonId }),
    });
    const data = await res.json();
    setHtml(data.html || "");
  }
  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-vitrine.html";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="layout-2">
      <section>
        <div className="hero" style={{ paddingTop: 24 }}>
          <h1>Générateur de site vitrine</h1>
          <p>HTML autonome + bouton de réservation, hébergeable gratuitement.</p>
        </div>
        <label className="field">
          <div className="meta">Établissement source</div>
          <select value={salonId} onChange={(e) => setSalonId(e.target.value)}>
            {salons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.city}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="btn" onClick={generate} type="button">Générer</button>
          <button className="btn ghost" onClick={download} type="button" disabled={!html}>Télécharger HTML</button>
        </div>
        {html && <pre className="code">{html}</pre>}
      </section>
      <aside>
        {html ? (
          <iframe title="Aperçu" srcDoc={html} style={{ width: "100%", height: 720, border: "1px solid var(--line)", borderRadius: 16, background: "#fff" }} />
        ) : (
          <div className="card notice">Choisissez un salon puis générez un aperçu.</div>
        )}
      </aside>
    </main>
  );
}
