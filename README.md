# Atelier Plateforme

Environnement de travail **open-source** pour :

1. **Générer des sites web** vitrine (salons, instituts, indépendants)
2. **Créer et piloter des agents IA** via MCP (Model Context Protocol)
3. **Exploiter une plateforme de réservation** inspirée de Planity (marketplace + agenda pro + page établissement)

> Ce dépôt n’est **pas** un clone de Planity. C’est un **starter de production locale**, licence MIT, 100 % outils gratuits, conçu pour que tu puisses itérer.

**Dépôt GitHub :** https://github.com/Mickael0997/atelier-plateforme

---

## Démarrage en 3 commandes

```bash
git clone https://github.com/Mickael0997/atelier-plateforme.git
cd atelier-plateforme
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

Le serveur MCP :

```bash
npm run dev:mcp
```

## Architecture

```
atelier-plateforme/
├── apps/web            Next.js — marketplace, réservation, dashboard pro, générateur
├── apps/mcp-server     Serveur MCP stdio — outils pour Claude / Cursor / Grok
├── apps/agents         Specs d’agents (prompts, outils, garde-fous)
├── packages/shared     Types et logique métier partagée
├── docs/               Architecture, stack gratuite, roadmap
└── .vscode/mcp.json    Connexion MCP locale
```

## Outils MCP exposés

- `search_salons`
- `get_availability`
- `create_booking`
- `list_bookings`
- `generate_salon_website`
- `draft_client_message`

Config Claude Desktop : voir le fichier `.vscode/mcp.json` et `docs/`.

## Licence

MIT
