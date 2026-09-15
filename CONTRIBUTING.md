# Contribuer

## Branches

- `main` — stable, déployable
- `feat/*` — fonctionnalités
- `fix/*` — correctifs

## Commits

Format : `type(scope): message`

Exemples :

- `feat(booking): calculer les créneaux par collaborateur`
- `feat(mcp): outil generate_salon_website`
- `docs: préciser la stack gratuite`

## Checklist PR

- [ ] `npm run build` passe
- [ ] Pas de secret dans le commit
- [ ] README / docs mis à jour si le comportement change
- [ ] Données de démo uniquement (pas de vraies clientes)
