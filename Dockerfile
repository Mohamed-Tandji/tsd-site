# Image de production du site TSD Systems (Next.js en mode standalone)

FROM node:22-alpine AS base
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Dépendances (le postinstall génère le client Prisma)
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# Construction
FROM deps AS build
COPY . .
RUN npm run build

# Outils ponctuels : migrations et contenu initial
#   docker compose -f docker-compose.prod.yml run --rm tools                     (migrations)
#   docker compose -f docker-compose.prod.yml run --rm tools npx prisma db seed  (contenu initial)
FROM build AS tools
CMD ["npx", "prisma", "migrate", "deploy"]

# Exécution : uniquement le serveur autonome, utilisateur sans privilèges
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/uploads
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
    && mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health > /dev/null || exit 1
CMD ["node", "server.js"]
