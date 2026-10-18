#!/bin/bash
# Sauvegarde : base (pg_dump, format custom) + dossier des images, puis copie hors du serveur.
# Variables : PGHOST PGUSER PGPASSWORD PGDATABASE, UPLOAD_DIR (/uploads), BACKUP_DIR (/backups),
#             BACKUP_REMOTE (ex. « b2:tsd-sauvegardes » ; vide = copie locale seulement),
#             BACKUP_KEEP_LOCAL_DAYS (7), BACKUP_KEEP_REMOTE_DAYS (30)
set -euo pipefail

UPLOAD_DIR="${UPLOAD_DIR:-/uploads}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
STAMP="$(date +%Y-%m-%d_%H%M%S)"
TARGET="$BACKUP_DIR/$STAMP"

echo "[$(date -Iseconds)] Sauvegarde $STAMP : début"
mkdir -p "$TARGET"

pg_dump --format=custom --no-owner --file="$TARGET/base.dump"
tar -czf "$TARGET/images.tar.gz" -C "$UPLOAD_DIR" .
(cd "$TARGET" && sha256sum base.dump images.tar.gz > SHA256SUMS)

# Contrôle : l'export de la base doit être lisible
pg_restore --list "$TARGET/base.dump" > /dev/null

echo "[$(date -Iseconds)] Fichiers : $(du -sh "$TARGET" | cut -f1) dans $TARGET"

if [ -n "${BACKUP_REMOTE:-}" ]; then
  rclone copy "$TARGET" "$BACKUP_REMOTE/$STAMP"
  rclone check "$TARGET" "$BACKUP_REMOTE/$STAMP" --one-way
  # Rotation distante
  rclone delete "$BACKUP_REMOTE" --min-age "${BACKUP_KEEP_REMOTE_DAYS:-30}d"
  rclone rmdirs "$BACKUP_REMOTE" --leave-root
  echo "[$(date -Iseconds)] Copie hors serveur vérifiée : $BACKUP_REMOTE/$STAMP"
else
  echo "[$(date -Iseconds)] ATTENTION : BACKUP_REMOTE vide, aucune copie hors du serveur."
fi

# Rotation locale
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"${BACKUP_KEEP_LOCAL_DAYS:-7}" -exec rm -rf {} +
echo "[$(date -Iseconds)] Sauvegarde $STAMP : terminée"
