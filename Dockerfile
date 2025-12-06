# Stage 1 — build the React app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package manifests and install (for cache)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source (explicitly not copying .env files)
COPY . .

# Build production assets
RUN npm run build

# Stage 2 — serve built files with `serve`
FROM node:18-alpine AS runner
WORKDIR /app

# Install serve globally (lightweight)
RUN npm install -g serve@14.1.2

# Copy static build from builder
COPY --from=builder /app/build ./build

# Default port for Cloud Run; Cloud Run will override $PORT if provided
ENV PORT 8080
EXPOSE 8080

# Use tcp://0.0.0.0:$PORT so it's reachable from outside
CMD ["sh", "-c", "serve -s build -l tcp://0.0.0.0:${PORT}"]
