# Use Node.js 22 Alpine for smaller image size (matching Railway environment)
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments from Railway
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_USE_LOCAL_ENDPOINT=false
ARG VITE_DEBUG_API=false
ARG VITE_PRODUCTION_API_URL=https://api.vineyardgroupfellowship.org/api/v1

# Set environment variables for Vite build
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_USE_LOCAL_ENDPOINT=$VITE_USE_LOCAL_ENDPOINT
ENV VITE_DEBUG_API=$VITE_DEBUG_API
ENV VITE_PRODUCTION_API_URL=$VITE_PRODUCTION_API_URL

# Build the application
RUN yarn build

# Production image, copy all the files and run
FROM nginx:alpine AS runner
WORKDIR /app

# Copy the built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration template for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy and make executable the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (Railway will set the PORT env var)
EXPOSE ${PORT:-80}

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]