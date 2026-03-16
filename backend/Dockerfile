# ── Build stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files and install production-only deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ── Runtime stage ─────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Don't run as root
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
USER nodeapp

# Copy installed deps from build stage
COPY --from=deps --chown=nodeapp:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodeapp:nodejs . .

# Create logs directory with correct ownership
RUN mkdir -p logs

EXPOSE 5001

# Health check — matches the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "server.js"]
