#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const salons = JSON.parse(readFileSync(join(root, "apps/web/src/data/salons.json"), "utf8"));
const dataDir = join(root, "data");
const bookingsFile = join(dataDir, "bookings.json");

function loadBookings() {
  if (!existsSync(bookingsFile)) {
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(bookingsFile, "[]");
  }
  return JSON.parse(readFileSync(bookingsFile, "utf8"));
}
function saveBookings(list) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(bookingsFile, JSON.stringify(list, null, 2));
}
function timeToMin(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
}
function minToTime(min) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}
function slotsForDay({ durationMin, bookings, staffId, date }) {
  const taken = bookings
    .filter((b) => b.staffId === staffId && b.date === date && b.status !== "cancelled")
    .map((b) => ({ start: timeToMin(b.start), end: timeToMin(b.start) + (b.durationMin || durationMin) }));
  const out = [];
  for (let t = 9 * 60; t + durationMin <= 19 * 60; t += 15) {
    const end = t + durationMin;
    if (!taken.some((x) => t < x.end && end > x.start)) out.push(minToTime(t));
  }
  return out;
}
function generateHtml(salon) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${salon.name}</title></head><body><h1>${salon.name}</h1><p>${salon.description}</p><a href="http://localhost:3000/reserver/${salon.slug}">Prendre rendez-vous</a></body></html>`;
}
const tools = [
  { name: "search_salons", description: "Recherche des établissements.", inputSchema: { type: "object", properties: { q: { type: "string" }, city: { type: "string" }, metier: { type: "string" } } } },
  { name: "get_availability", description: "Créneaux libres YYYY-MM-DD.", inputSchema: { type: "object", properties: { salonId: { type: "string" }, staffId: { type: "string" }, date: { type: "string" }, durationMin: { type: "number" } }, required: ["salonId", "staffId", "date"] } },
  { name: "create_booking", description: "Crée un rendez-vous.", inputSchema: { type: "object", properties: { salonId: { type: "string" }, serviceId: { type: "string" }, staffId: { type: "string" }, date: { type: "string" }, start: { type: "string" }, clientName: { type: "string" }, clientPhone: { type: "string" } }, required: ["salonId", "serviceId", "staffId", "date", "start", "clientName"] } },
  { name: "list_bookings", description: "Liste les rendez-vous.", inputSchema: { type: "object", properties: { salonId: { type: "string" }, date: { type: "string" } } } },
  { name: "generate_salon_website", description: "HTML vitrine.", inputSchema: { type: "object", properties: { salonId: { type: "string" } }, required: ["salonId"] } },
  { name: "draft_client_message", description: "SMS/e-mail confirmation, rappel, annulation.", inputSchema: { type: "object", properties: { kind: { type: "string", enum: ["confirmation", "rappel", "annulation"] }, clientName: { type: "string" }, salonName: { type: "string" }, date: { type: "string" }, start: { type: "string" } }, required: ["kind", "clientName", "salonName"] } },
];
function textResult(obj) {
  return { content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] };
}
function callTool(name, args = {}) {
  if (name === "search_salons") {
    const q = (args.q || "").toLowerCase();
    const found = salons.filter((s) => {
      const mq = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
      return mq && (!args.city || s.city === args.city) && (!args.metier || s.metier === args.metier);
    });
    return textResult(found.map((s) => ({ id: s.id, slug: s.slug, name: s.name, city: s.city, metier: s.metier })));
  }
  if (name === "get_availability") {
    return textResult({ slots: slotsForDay({ durationMin: Number(args.durationMin || 30), bookings: loadBookings(), staffId: args.staffId, date: args.date }) });
  }
  if (name === "create_booking") {
    const salon = salons.find((s) => s.id === args.salonId);
    if (!salon) return textResult({ error: "salon inconnu" });
    const service = salon.services.find((s) => s.id === args.serviceId);
    const bookings = loadBookings();
    const durationMin = service?.durationMin || 30;
    const slots = slotsForDay({ durationMin, bookings, staffId: args.staffId, date: args.date });
    if (!slots.includes(args.start)) return textResult({ error: "créneau indisponible" });
    const booking = { id: `b-${Date.now()}`, ...args, durationMin, status: "confirmed", createdAt: new Date().toISOString() };
    bookings.push(booking);
    saveBookings(bookings);
    return textResult(booking);
  }
  if (name === "list_bookings") {
    let list = loadBookings();
    if (args.salonId) list = list.filter((b) => b.salonId === args.salonId);
    if (args.date) list = list.filter((b) => b.date === args.date);
    return textResult(list);
  }
  if (name === "generate_salon_website") {
    const salon = salons.find((s) => s.id === args.salonId);
    if (!salon) return textResult({ error: "salon inconnu" });
    return textResult({ html: generateHtml(salon) });
  }
  if (name === "draft_client_message") {
    const when = args.date && args.start ? ` le ${args.date} à ${args.start}` : "";
    const map = {
      confirmation: `Bonjour ${args.clientName}, votre rendez-vous chez ${args.salonName}${when} est confirmé.`,
      rappel: `Rappel : rendez-vous chez ${args.salonName}${when}.`,
      annulation: `Bonjour ${args.clientName}, rendez-vous chez ${args.salonName}${when} annulé.`,
    };
    return textResult({ message: map[args.kind] || map.confirmation });
  }
  return { content: [{ type: "text", text: `outil inconnu: ${name}` }], isError: true };
}
function handle(msg) {
  if (!msg || msg.jsonrpc !== "2.0") return null;
  const { id, method, params } = msg;
  if (method === "initialize") return { jsonrpc: "2.0", id, result: { protocolVersion: "2024-11-05", serverInfo: { name: "atelier-plateforme", version: "0.1.0" }, capabilities: { tools: {} } } };
  if (method === "notifications/initialized" || method === "notifications/cancelled") return null;
  if (method === "tools/list") return { jsonrpc: "2.0", id, result: { tools } };
  if (method === "tools/call") return { jsonrpc: "2.0", id, result: callTool(params?.name, params?.arguments || {}) };
  if (method === "ping") return { jsonrpc: "2.0", id, result: {} };
  if (id !== undefined) return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } };
  return null;
}
function send(obj) {
  const payload = Buffer.from(JSON.stringify(obj), "utf8");
  process.stdout.write(`Content-Length: ${payload.length}\r\n\r\n`);
  process.stdout.write(payload);
}
let buffer = Buffer.alloc(0);
process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      const nl = buffer.indexOf("\n");
      if (nl !== -1) {
        const line = buffer.slice(0, nl).toString("utf8").trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        try { const res = handle(JSON.parse(line)); if (res) process.stdout.write(JSON.stringify(res) + "\n"); } catch (e) { process.stderr.write(String(e) + "\n"); }
        continue;
      }
      break;
    }
    const header = buffer.slice(0, headerEnd).toString("utf8");
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) { buffer = buffer.slice(headerEnd + 4); continue; }
    const len = Number(match[1]);
    const start = headerEnd + 4;
    if (buffer.length < start + len) break;
    const body = buffer.slice(start, start + len).toString("utf8");
    buffer = buffer.slice(start + len);
    try { const res = handle(JSON.parse(body)); if (res) send(res); } catch (e) { process.stderr.write(String(e) + "\n"); }
  }
});
process.stdin.resume();
