# Sauvegarde quotidienne : base PostgreSQL + images téléversées, copiées hors du serveur (rclone)
FROM alpine:3.20

RUN apk add --no-cache postgresql16-client rclone tar gzip tzdata bash

COPY backup.sh restore.sh entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
