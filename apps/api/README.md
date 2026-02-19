# Zippy API (NestJS)

Quickstart for local development (including auth) in under 5 minutes.

## 1) Setup env

```bash
cp apps/api/.env.example apps/api/.env
```

Update `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `apps/api/.env` with strong values.

## 2) Install dependencies

From repository root:

```bash
pnpm install
```

## 3) Prisma generate + migrate

From repository root:

```bash
pnpm dlx prisma generate --schema apps/api/prisma/schema.prisma
pnpm dlx prisma migrate dev --name init --schema apps/api/prisma/schema.prisma
```

## 4) Start API

```bash
pnpm --filter @zippy/api dev
```

API defaults to `http://localhost:4000` and Swagger docs are at `http://localhost:4000/docs`.

## 5) Seed auth users (ADMIN / DRIVER / PASSENGER)

This seed is cross-platform (Windows/macOS/Linux) and uses Prisma + bcrypt.

From repository root:

```bash
pnpm --filter @zippy/api db:seed
```

Seeded users:

- `admin@zippy.ar` / `Admin123!` (ADMIN)
- `driver@zippy.ar` / `Driver123!` (DRIVER)
- `passenger@zippy.ar` / `Passenger123!` (PASSENGER)

## 6) Login example

```bash
curl -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@zippy.ar","password":"Admin123!"}'
```

Windows PowerShell works with the same command:

```powershell
pnpm --filter @zippy/api db:seed
```

## Swagger auth (Bearer)

1. Open `http://localhost:4000/docs`.
2. Run `POST /auth/login` and copy `accessToken` from response.
3. Click **Authorize** (top-right), paste `Bearer <accessToken>`, and confirm.
4. Protected endpoints (e.g. `/rides`) will now send the JWT automatically.
