# Infra local (Docker Compose)

Este entorno levanta una versión local/prod-like de Zippy con:
- `web` (Next.js) enrutado por Nginx en `/`
- `admin` (Next.js) enrutado por Nginx en `/admin`
- `api` (NestJS) enrutado por Nginx en `/api`
- `postgres`
- `redis`

## Requisitos
- Docker + Docker Compose plugin

## Uso
Desde la raíz del repo:

```bash
pnpm infra:up
```

O directamente:

```bash
cd infra
docker compose up --build
```

Accesos locales:
- Web: `http://localhost/`
- Admin: `http://localhost/admin`
- API Health: `http://localhost/api/health`
- Swagger: `http://localhost/api/docs`

## Bajar entorno

```bash
pnpm infra:down
```

## Nota VPS
Para despliegue real en VPS, se recomienda routing por host en Nginx (o en Nginx del host):
- `zippy.com.ar` -> web
- `admin.zippy.com.ar` -> admin
- `api.zippy.com.ar` -> api

TLS no se configura dentro de este compose (se delega a Cloudflare + Nginx en VPS).
