#!/bin/bash
# Restauration d'une sauvegarde : restore.sh <AAAA-MM-JJ_HHMMSS> [--from-remote]
# Remplace le contenu de la base PGDATABASE et du dossier des images.
# Arrêter le site avant (docker compose stop app), le relancer après.
set -euo pipefail

STAMP="${1:?Usage : restore.sh <AAAA-MM-JJ_HHMMSS> [--from-remote]}"
UPLOAD_DIR="${UPLOAD_DIR:-/uploads}"
SOURCE="${BACKUP_DIR:-/backups}/$STAMP"

if [ "${2:-}" = "--from-remote" ]; then
  : "${BACKUP_REMOTE:?BACKUP_REMOTE non défini}"
  rclone copy "$BACKUP_REMOTE/$STAMP" "$SOURCE"
fi

[ -f "$SOURCE/base.dump" ] || { echo "Sauvegarde introuvable : $SOURCE"; exit 1; }
(cd "$SOURCE" && sha256sum -c SHA256SUMS)

echo "Restauration de la base $PGDATABASE depuis $SOURCE…"
pg_restore --clean --if-exists --no-owner --single-transaction --dbname="$PGDATABASE" "$SOURCE/base.dump"

echo "Restauration des images dans $UPLOAD_DIR…"
find "$UPLOAD_DIR" -mindepth 1 -delete
tar -xzf "$SOURCE/images.tar.gz" -C "$UPLOAD_DIR"

echo "Restauration terminée."
