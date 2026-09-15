# Sécurité

- Ne commitez jamais `.env`, clés Stripe live, tokens Twilio ou secrets LLM.
- Les données de démo sont fictives.
- Le serveur MCP lit/écrit uniquement `data/bookings.json` et `apps/web/src/data/salons.json`.
- Signaler un problème : ouvrir une issue GitHub avec le label `security` sans joindre de secrets.
