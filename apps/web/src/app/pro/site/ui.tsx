"use client";
import { useState } from "react";
export function SiteStudio({ salonId, salonName }: { salonId: string; salonName: string }) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  async function generate() {
    setError("");
    const res = await fetch("/api/generate-site", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ salonId }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Generation refusee"); return; }
    setHtml(data.html || "");
  }
  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = salonName.toLowerCase().replace(/\s+/g, "-") + ".html";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="layout-2">
      <div>
        <p className="notice">Les textes viennent de votre fiche etablissement.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="btn" type="button" onClick={generate}>Previsualiser mon site</button>
          <button className="btn ghost" type="button" onClick={download} disabled={!html}>Telecharger le HTML</button>
        </div>
        {error && <p className="notice">{error}</p>}
      </div>
      <aside>
        {html ? (
          <iframe title="Apercu" srcDoc={html} style={{ width: "100%", height: 640, border: "1px solid var(--line)", borderRadius: 16 }} />
        ) : (
          <div className="card">Aucun apercu.</div>
        )}
      </aside>
    </div>
  );
}
