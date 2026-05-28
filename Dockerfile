# groundx-offer — Next.js 16 standalone build for AETHER VPS.
# Samy 2026-05-27: deployed als eigenstaendiger Container auf Hetzner.
#
# Multi-stage build:
#   1. deps    — installs pnpm deps once, cached
#   2. builder — runs `pnpm build` to produce .next/standalone
#   3. runner  — alpine + standalone-output, ~80 MB final image

# ---------- 1. deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- 2. builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- 3. runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone-output + static assets + public/.
# .next/standalone enthaelt server.js + minimale node_modules.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
