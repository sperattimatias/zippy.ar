FROM node:22-alpine AS base
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
RUN pnpm install --no-frozen-lockfile

FROM base AS build
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /workspace/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /workspace/apps/admin/node_modules ./apps/admin/node_modules
COPY . .
RUN pnpm --filter @zippy/api prisma:generate
RUN pnpm --filter @zippy/api build

FROM base AS runner
ENV NODE_ENV=production
ENV CI=1
WORKDIR /workspace
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/api ./apps/api
COPY --from=build /workspace/apps/web/package.json ./apps/web/package.json
COPY --from=build /workspace/apps/admin/package.json ./apps/admin/package.json
CMD ["node", "apps/api/dist/main.js"]
