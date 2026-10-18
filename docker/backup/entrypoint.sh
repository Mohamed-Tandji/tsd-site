#!/bin/bash
# Planifie la sauvegarde quotidienne (BACKUP_CRON, par défaut 02:30) puis laisse crond au premier plan.
set -euo pipefail

CRON="${BACKUP_CRON:-30 2 * * *}"
# Les variables d'environnement sont transmises à la tâche planifiée
env | grep -E '^(PG|BACKUP_|RCLONE_|TZ=)' | sed 's/^/export /; s/=\(.*\)$/="\1"/' > /etc/backup.env
echo "$CRON . /etc/backup.env && /usr/local/bin/backup.sh >> /proc/1/fd/1 2>&1" > /etc/crontabs/root

echo "Sauvegarde planifiée : « $CRON » (fuseau ${TZ:-UTC}). Lancement manuel : docker compose exec backup backup.sh"
exec crond -f -l 8
