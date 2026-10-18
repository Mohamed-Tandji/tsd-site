# Site TSD Systems

Next.js 15 (React, TypeScript) · Tailwind CSS 4 · next-intl (FR/EN) · Prisma + PostgreSQL · Docker Compose + Caddy

## Lancer en local (PowerShell)
Prérequis : Node 20+, Docker Desktop démarré. PostgreSQL écoute sur le port 5435. Placez le dossier **hors OneDrive** (ex. `C:\dev\tsd-site`).

```powershell
copy .env.example .env
docker compose up -d
npm install
npx prisma migrate deploy
npx prisma db seed   # contenu initial FR/EN + premier compte admin (SEED_ADMIN_* dans .env)
npm run dev
```

Administration : http://localhost:3000/admin (courriel et mot de passe de `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
Les images téléversées sont enregistrées dans `uploads/` (variable `UPLOAD_DIR`) et servies par `/media/…`.

## À vérifier
1. http://localhost:3000 redirige vers http://localhost:3000/fr
2. Chaque lien du menu ouvre une page **à part** avec sa propre adresse :
   `/fr`, `/fr/solutions`, `/fr/solutions/exemple`, `/fr/a-propos`, `/fr/equipe`, `/fr/contact`,
   `/fr/mentions-legales`, `/fr/confidentialite`
3. Le bouton FR → EN change de langue et reste sur la même page ; en anglais les chemins sont traduits :
   `/en/about`, `/en/team`, `/en/legal-notice`, `/en/privacy` (`/en/solutions`, `/en/contact` inchangés)
4. http://localhost:3000/api/health affiche `{"ok":true,...}` (base de données connectée)
5. `npx prisma studio` ouvre la base : tables AdminUser, Session, LoginAttempt, Setting, Solution, TeamMember, ContactMessage

## Structure
- `src/app/[locale]/…` : une page par route (FR et EN)
- `messages/fr.json`, `messages/en.json` : textes par défaut (modifiables dans /admin, la base prend le pas)
- `prisma/schema.prisma` : modèle de données ; `prisma/seed.ts` + `seed-data.json` : contenu initial
- `src/app/admin` : administration ; `src/lib/content.ts` : lecture du contenu public (cache invalidé à chaque enregistrement)
- `src/app/globals.css` : couleurs et polices de la charte

## Production

- `Dockerfile`, `docker-compose.prod.yml` (app + PostgreSQL + Caddy + sauvegardes), `Caddyfile`, `.env.production.example`
- Guide pas à pas : `docs/DEPLOIEMENT.md` ; sauvegardes et restauration : `docs/SAUVEGARDES.md`
- Vérification : `./scripts/verifier-production.sh tsdsystems.net`
- Schéma de base : migrations Prisma (`prisma/migrations`). Après une modification de `schema.prisma` :
  `npx prisma migrate dev --name <description>` (en local), puis `migrate deploy` en production (service `tools`).
