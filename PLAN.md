# Plan – Site TSD Systems

- [x] Démarrage : prérequis, dépôt git, PLAN.md
- [x] 4. Socle technique : Next.js/TS/Tailwind/next-intl, Docker + PostgreSQL, Prisma, pages vides FR/EN, /api/health
- [x] 5. Structure : en-tête (logo, menu actif, bascule FR/EN, menu mobile), pied de page, gabarit commun
- [x] 6. Accueil (fidèle à la maquette)
- [x] 7. Solutions et fiches solution
- [x] 8. À propos et Équipe
- [x] 9. Contact : formulaire, validation, antispam, base, Resend
- [x] 10. Administration (/admin) : connexion, comptes, contenus FR/EN, médias, solutions, équipe, messages, seed
- [x] 11. Finitions : SEO, accessibilité, performance, pages légales, sauvegardes
- [x] 12. Mise en ligne : Dockerfile, compose prod (app + PostgreSQL + Caddy), guide VPS, script de vérification (pile testée en local)
- [x] Déploiement réel : VPS OVH 158.69.195.191, HTTPS tsdsystems.net + www, script de vérification OK (25/10/2026)
- [ ] Notifications Resend (DEPLOIEMENT.md §8)
- [x] Sauvegardes hors serveur B2 (tsdsystemsbucket, clé limitée au bucket) + test de restauration OK (25/10/2026)
- [ ] Sonde de disponibilité sur /api/health (§10)
