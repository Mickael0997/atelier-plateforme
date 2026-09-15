# Architecture

```
           ┌──────────────┐     stdio      ┌────────────────┐
           │ Claude/Cursor│◄──────────────►│ apps/mcp-server │
           │ Grok + MCP   │                └────────────────┬─────────────────┘
           └──────────────┘                         │
                                                    │ JSON fichier
                                                    ▼
┌────────────┐   HTTP    ┌─────────────┐     ┌────────────┐
│ Navigateur │──────────►│ apps/web    │───►│ data/*.json│
└────────────┘           │ Next.js API │     └────────────┘
                         └─────────────┘
                                │
                                ▼
                         sites HTML générés
                         (Pages / Cloudflare)
```

## Domaines métier

- **Marketplace** : découverte, fiche, avis (notes seedées)
- **Booking** : prestation × collaborateur × créneau 15 min
- **Pro** : agenda jour, KPI, future caisse
- **Sites** : HTML statique + CTA réservation
- **Agents** : prompts versionnés + outils MCP

## Évolution base de données

Aujourd’hui : `data/bookings.json`  
Demain : SQLite (`better-sqlite3`) puis Postgres (Neon / Supabase free).

Le contrat API (`/api/salons`, `/api/availability`, `/api/bookings`) reste stable.
