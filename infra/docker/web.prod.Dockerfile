FROM node:22-alpine AS base
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/admin/package.json apps/admin/package.json
RUN pnpm install --no-frozen-lockfile

FROM base AS build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_WEB_KEY
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_WEB_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_WEB_KEY}
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /workspace/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /workspace/apps/admin/node_modules ./apps/admin/node_modules
COPY . .
RUN pnpm --filter @zippy/web build

FROM base AS runner
ENV NODE_ENV=production
ENV CI=1
WORKDIR /workspace
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/web ./apps/web
COPY --from=build /workspace/apps/api/package.json ./apps/api/package.json
COPY --from=build /workspace/apps/admin/package.json ./apps/admin/package.json
CMD ["pnpm", "--filter", "@zippy/web", "exec", "next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
