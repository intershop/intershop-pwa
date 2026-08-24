# syntax=docker/dockerfile:1

# =============================================================================
# Intershop UCP service — production image
# Multi-stage: compile TypeScript with the full toolchain, then ship a slim
# runtime that runs plain `node` (no tsx / no dev dependencies).
# =============================================================================

# --- Build stage -------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Install all dependencies (incl. dev) against the lockfile for a reproducible build.
COPY package.json package-lock.json ./
RUN npm ci

# Compile src/ -> dist/ (tsconfig.build.json sets rootDir=src, so the entry is dist/server.js).
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# --- Runtime stage -----------------------------------------------------------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Only production dependencies (express, dotenv) end up in the final image.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Static assets (the interactive demo page) served at /ucp/demo.
COPY public ./public

EXPOSE 4000

# Liveness/readiness: hit the built-in /health route using Node's global fetch.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.UCP_PORT||4000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run as the unprivileged built-in `node` user.
USER node

CMD ["node", "dist/server.js"]
