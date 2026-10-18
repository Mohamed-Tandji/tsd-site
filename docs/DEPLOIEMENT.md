# Mise en ligne sur tsdsystems.net

Pile de production : **Caddy** (HTTPS automatique) → **app** (Next.js) → **PostgreSQL**, plus le service **backup**.
Tout est décrit dans `docker-compose.prod.yml` ; le guide se suit dans l'ordre. Durée : 1 h 30 à 2 h, hors propagation DNS.

## 0. Ce qu'il faut avant de commencer

- Accès à la zone DNS de `tsdsystems.net`.
- Accès au dépôt GitHub privé du site.
- Un VPS **2 vCPU / 4 Go**, Ubuntu 24.04 LTS, avec IPv4 publique (10 à 20 $/mois selon l'hébergeur ; prix à confirmer à la commande).
- Facultatif mais conseillé : un compte **Resend** (notifications du formulaire) et un compte **Backblaze B2** (sauvegardes hors serveur).

Sur votre poste, une clé SSH : `ssh-keygen -t ed25519 -C "tsd-vps"` (PowerShell ou Git Bash). Donnez la clé **publique** (`~/.ssh/id_ed25519.pub`) à l'hébergeur lors de la commande.

## 1. Sécuriser le serveur

```bash
ssh root@IP_DU_SERVEUR

# Utilisateur de travail avec droits sudo, même clé SSH que root
adduser tsd
usermod -aG sudo tsd
rsync --archive --chown=tsd:tsd ~/.ssh /home/tsd

# Connexion SSH par clé uniquement
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/; s/^#\?PermitRootLogin .*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh

# Pare-feu : SSH, HTTP, HTTPS
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 443/udp && ufw --force enable

# Mises à jour de sécurité automatiques
apt update && apt -y upgrade && apt -y install unattended-upgrades git
dpkg-reconfigure -plow unattended-upgrades
```

Vérifiez dans **un autre terminal** que `ssh tsd@IP_DU_SERVEUR` fonctionne avant de fermer la session root.

## 2. Installer Docker

```bash
ssh tsd@IP_DU_SERVEUR
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker tsd
exit   # puis se reconnecter pour que le groupe docker soit pris en compte
docker --version && docker compose version
```

## 3. DNS de tsdsystems.net

Chez le gestionnaire de la zone DNS (baisser le TTL à 300 s la veille si possible) :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | IPv4 du serveur |
| A | `www` | IPv4 du serveur |
| AAAA | `@` et `www` | IPv6 du serveur (seulement si le serveur en a une) |

**Ne pas toucher** aux enregistrements MX et TXT de Zoho Mail (courriels). Vérifier depuis votre poste :
`nslookup tsdsystems.net` et `nslookup www.tsdsystems.net` doivent renvoyer l'IP du serveur.

## 4. Récupérer le code

Créer une **clé de déploiement** en lecture seule pour le dépôt privé :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N "" -C "deploy tsd-site"
cat ~/.ssh/github_deploy.pub   # à coller dans GitHub : dépôt › Settings › Deploy keys (lecture seule)
printf 'Host github.com\n  IdentityFile ~/.ssh/github_deploy\n' >> ~/.ssh/config

sudo mkdir -p /opt/tsd-site && sudo chown tsd:tsd /opt/tsd-site
git clone git@github.com:<compte>/tsd-site.git /opt/tsd-site
cd /opt/tsd-site
```

## 5. Configurer

```bash
cp .env.production.example .env
chmod 600 .env
openssl rand -hex 32   # à lancer trois fois : POSTGRES_PASSWORD, IP_HASH_SALT, SEED_ADMIN_PASSWORD
nano .env              # renseigner les valeurs ; SITE_DOMAIN="tsdsystems.net", SITE_URL="https://tsdsystems.net"
touch rclone.conf      # vide pour l'instant (sauvegardes hors serveur : étape 9)
```

Notez le mot de passe `SEED_ADMIN_PASSWORD` : c'est celui du premier compte administrateur.

## 6. Construire, créer la base, démarrer

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --profile tools build tools
docker compose -f docker-compose.prod.yml --profile tools run --rm tools                     # migrations
docker compose -f docker-compose.prod.yml --profile tools run --rm tools npx prisma db seed  # contenu initial + 1er admin
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f caddy   # attendre « certificate obtained successfully », puis Ctrl+C
```

## 7. Vérifier en production

```bash
./scripts/verifier-production.sh tsdsystems.net
```

Puis, dans un navigateur (ordinateur **et** téléphone) :

1. https://tsdsystems.net s'ouvre en français ; le bouton FR/EN bascule chaque page.
2. https://tsdsystems.net/admin : connexion avec `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
3. **Comptes › Changer mon mot de passe**, puis vider `SEED_ADMIN_PASSWORD` dans `.env`.
4. Créer un compte pour chaque associé (**Comptes › Ajouter un compte**).
5. **Coordonnées et images › Informations légales** : compléter les champs (raison sociale, numéro d'enregistrement…).
6. Critère d'acceptation : modifier un texte, une image et une solution, et vérifier le résultat en FR et en EN.
7. Envoyer un message depuis /fr/contact et le retrouver dans **Messages reçus**.

## 8. Notifications par courriel (Resend)

1. Resend › **Domains** › ajouter `tsdsystems.net` ; ajouter dans la zone DNS les enregistrements fournis (DKIM, SPF du sous-domaine d'envoi, MX éventuel). Ils ne remplacent pas ceux de Zoho.
2. Attendre l'état **Verified**, puis **API Keys** › créer une clé « Sending access » limitée au domaine.
3. Dans `.env` : `RESEND_API_KEY="re_…"`, `CONTACT_FROM="TSD Systems <site@tsdsystems.net>"`, `CONTACT_TO="contact@tsdsystems.net"`.
4. `docker compose -f docker-compose.prod.yml up -d app`, puis **test d'envoi réel** depuis /fr/contact : le courriel doit arriver dans la boîte Zoho, et l'administration doit indiquer « Envoyée par courriel ».

Offre gratuite : 3 000 courriels par mois, 100 par jour (le site s'arrête de notifier au-delà de 100 par jour ; les messages restent enregistrés).

## 9. Sauvegardes hors serveur

Suivre `docs/SAUVEGARDES.md` (Backblaze B2 + `rclone.conf`), puis :

```bash
docker compose -f docker-compose.prod.yml up -d backup
docker compose -f docker-compose.prod.yml exec backup backup.sh   # doit se terminer par « Copie hors serveur vérifiée »
```

Faire ensuite le **test de restauration** décrit dans `docs/SAUVEGARDES.md` (critère d'acceptation).

## 10. Surveillance

- Créer une sonde gratuite (UptimeRobot, Better Stack…) sur `https://tsdsystems.net/api/health`, avec alerte par courriel.
- Journaux : `docker compose -f docker-compose.prod.yml logs --tail 100 app` (ou `caddy`, `backup`, `db`).

## Mettre à jour le site

```bash
cd /opt/tsd-site
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --profile tools build tools
docker compose -f docker-compose.prod.yml --profile tools run --rm tools   # migrations éventuelles
docker compose -f docker-compose.prod.yml up -d
./scripts/verifier-production.sh
```

**Une fois par mois** : `sudo apt update && sudo apt -y upgrade`, puis
`docker compose -f docker-compose.prod.yml pull db caddy && docker compose -f docker-compose.prod.yml up -d`,
et `docker image prune -f`.

## Dépannage

| Symptôme | Piste |
|---|---|
| Pas de certificat HTTPS | DNS pas encore propagé, ou ports 80/443 fermés : `docker compose … logs caddy` |
| `/api/health` renvoie 503 | Base arrêtée ou mot de passe différent : `docker compose … ps`, `logs db` |
| Une modification n'apparaît pas | Recharger la page ; au plus 5 minutes si la base a été modifiée hors de l'administration |
| Échec de téléversement d'image | Fichier > 5 Mo ou format autre que JPG/PNG/WebP |
| Aucun courriel de notification | `RESEND_API_KEY` vide ou domaine non vérifié : `docker compose … logs app \| grep Resend` |
