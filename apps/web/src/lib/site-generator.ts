type SalonLike = {
  name: string;
  metier: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  accent?: string;
  hours: Record<string, string>;
  services: { name: string; durationMin: number; priceEur: number }[];
  staff: { firstName: string; role: string }[];
};

export function generateSalonHtml(salon: SalonLike, bookingUrl: string) {
  const accent = salon.accent || "#1a3a32";
  const hours = Object.entries(salon.hours)
    .map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`)
    .join("");
  const services = salon.services
    .map((s) => `<li class="svc"><div><strong>${s.name}</strong><small>${s.durationMin} min</small></div><em>${s.priceEur} €</em></li>`)
    .join("");
  const team = salon.staff.map((s) => `<li>${s.firstName} — ${s.role}</li>`).join("");
  const e = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${e(salon.name)}</title>
<style>:root{--accent:${accent}}body{margin:0;font-family:Georgia,serif;background:#f6f1ea;color:#161513}header,section,footer,.hero{padding:6vh 8vw}a.btn{background:var(--accent);color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px}</style></head>
<body><header><strong>${e(salon.name)}</strong> <a class="btn" href="${bookingUrl}">Prendre rendez-vous</a></header>
<div class="hero"><p>${e(salon.metier)} · ${e(salon.city)}</p><h1>${e(salon.name)}</h1><p>${e(salon.description)}</p></div>
<section><h2>Prestations</h2><ul>${services}</ul></section>
<section><h2>Équipe</h2><ul>${team}</ul></section>
<section><h2>Horaires</h2><ul>${hours}</ul></section>
<footer>${e(salon.address)} · ${e(salon.phone)}</footer></body></html>`;
}
