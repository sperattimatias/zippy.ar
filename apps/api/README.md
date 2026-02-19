# Zippy API (NestJS)

## Configuración local

```bash
cp apps/api/.env.example apps/api/.env
```

## Comandos principales

Desde la raíz del monorepo:

```bash
pnpm install
pnpm --filter @zippy/api prisma:generate
pnpm --filter @zippy/api db:migrate
pnpm --filter @zippy/api db:seed
pnpm --filter @zippy/api dev
```

## Endpoints relevantes

- Auth: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
- Health: `/health`
- Rides: `/rides/*` (JWT + roles)

Swagger: `http://localhost:4000/docs`
