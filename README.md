# Site TSD Systems – Étape 4 : socle technique

Next.js 15 (React, TypeScript) · Tailwind CSS 4 · next-intl (FR/EN) · Prisma + PostgreSQL (Docker)

## Lancer en local (PowerShell)
Prérequis : Node 20+, Docker Desktop démarré. PostgreSQL écoute sur le port 5435. Placez le dossier **hors OneDrive** (ex. `C:\dev\tsd-site`).

```powershell
copy .env.example .env
docker compose up -d
npm install
npx prisma db push
npm run dev
```

## À vérifier
1. http://localhost:3000 redirige vers http://localhost:3000/fr
2. Chaque lien du menu ouvre une page **à part** avec sa propre adresse :
   `/fr`, `/fr/solutions`, `/fr/solutions/exemple`, `/fr/a-propos`, `/fr/equipe`, `/fr/contact`,
   `/fr/mentions-legales`, `/fr/confidentialite`
3. Le bouton FR → EN change de langue et reste sur la même page ; en anglais les chemins sont traduits :
   `/en/about`, `/en/team`, `/en/legal-notice`, `/en/privacy` (`/en/solutions`, `/en/contact` inchangés)
4. http://localhost:3000/api/health affiche `{"ok":true,...}` (base de données connectée)
5. `npx prisma studio` ouvre la base : 5 tables vides (AdminUser, Setting, Solution, TeamMember, ContactMessage)

## Structure
- `src/app/[locale]/…` : une page par route (FR et EN)
- `messages/fr.json`, `messages/en.json` : textes fixes traduits
- `prisma/schema.prisma` : modèle de données (contenu modifiable FR/EN)
- `src/app/globals.css` : couleurs et polices de la charte
