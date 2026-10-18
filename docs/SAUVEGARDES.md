# Sauvegardes

Le service `backup` (dossier `docker/backup`, lancé par `docker-compose.prod.yml`) sauvegarde **chaque nuit** :

- la base PostgreSQL (`base.dump`, format `pg_dump` personnalisé) ;
- les images téléversées depuis l'administration (`images.tar.gz`) ;
- un fichier `SHA256SUMS` pour vérifier l'intégrité.

Chaque sauvegarde est rangée dans un dossier daté (`AAAA-MM-JJ_HHMMSS`), d'abord sur le serveur (volume `backups`, 7 jours),
puis **copiée hors du serveur** avec rclone (30 jours) et vérifiée après copie (`rclone check`).

## Réglages (fichier `.env` de production)

| Variable | Rôle | Défaut |
|---|---|---|
| `BACKUP_CRON` | Heure de la sauvegarde (format cron) | `30 2 * * *` (02:30) |
| `TZ` | Fuseau horaire | `UTC` |
| `BACKUP_REMOTE` | Destination hors serveur, ex. `b2:tsd-sauvegardes` | vide = **pas de copie externe** |
| `BACKUP_KEEP_LOCAL_DAYS` | Conservation sur le serveur | `7` |
| `BACKUP_KEEP_REMOTE_DAYS` | Conservation hors serveur | `30` |

## Destination hors serveur conseillée : Backblaze B2

Environ 0,006 $ par Go et par mois : quelques centimes pour ce site (budget prévu : 1 à 2 $).
Tout stockage compatible S3 convient aussi (Wasabi, Scaleway, OVH…).

1. Créer un compte Backblaze, un bucket **privé** (ex. `tsd-sauvegardes`) et une clé d'application limitée à ce bucket.
2. Sur le serveur, créer `rclone.conf` à côté de `docker-compose.prod.yml` (ce fichier contient un secret : jamais dans git) :

   ```ini
   [b2]
   type = b2
   account = <keyID>
   key = <applicationKey>
   ```

3. Dans `.env` : `BACKUP_REMOTE="b2:tsd-sauvegardes"`, puis `docker compose -f docker-compose.prod.yml up -d backup`.

## Commandes

```bash
# Lancer une sauvegarde tout de suite
docker compose -f docker-compose.prod.yml exec backup backup.sh

# Lister les sauvegardes locales et distantes
docker compose -f docker-compose.prod.yml exec backup ls /backups
docker compose -f docker-compose.prod.yml exec backup sh -c 'rclone lsd "$BACKUP_REMOTE"'

# Suivre les journaux
docker compose -f docker-compose.prod.yml logs -f backup
```

## Restaurer

```bash
docker compose -f docker-compose.prod.yml stop app
# depuis le serveur :
docker compose -f docker-compose.prod.yml exec backup restore.sh 2026-10-18_023000
# ou depuis la copie hors serveur :
docker compose -f docker-compose.prod.yml exec backup restore.sh 2026-10-18_023000 --from-remote
docker compose -f docker-compose.prod.yml start app
```

La restauration vérifie d'abord les empreintes SHA-256, remplace la base puis le dossier des images.

## Test de restauration (critère d'acceptation)

Testé en local le 18/10/2026 : sauvegarde, copie « hors serveur », restauration depuis la copie distante
dans une base vierge, puis comparaison (nombre de lignes et empreinte du contenu identiques, images restaurées).
**À refaire une fois en production**, puis tous les trois mois, dans une base de test :

```bash
docker compose -f docker-compose.prod.yml exec db psql -U tsd -c 'CREATE DATABASE restore_test'
docker compose -f docker-compose.prod.yml exec -e PGDATABASE=restore_test -e UPLOAD_DIR=/tmp/images backup \
  sh -c 'mkdir -p /tmp/images && restore.sh <AAAA-MM-JJ_HHMMSS> --from-remote'
docker compose -f docker-compose.prod.yml exec db psql -U tsd -d restore_test -c 'SELECT count(*) FROM "Solution"'
docker compose -f docker-compose.prod.yml exec db psql -U tsd -c 'DROP DATABASE restore_test'
```
