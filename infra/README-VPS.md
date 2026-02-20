# Zippy VPS Deploy (Producción detrás de Cloudflare)

## One-shot install (Ubuntu 22.04 / 24.04)

Desde la raíz del repo:

```bash
bash infra/scripts/install_vps.sh
```

El instalador:

- instala Docker Engine + compose plugin si faltan,
- configura UFW (22/tcp y 80/tcp),
- crea/completa `infra/.env` en forma idempotente,
- genera secretos fuertes para Postgres/JWT si faltan,
- levanta el stack (`infra/docker-compose.vps.yml`),
- ejecuta Prisma generate + migrate,
- y corre smoke tests finales.

## Verificación post-instalación

```bash
bash infra/scripts/verify_vps.sh
```

## Flujo manual (alternativo)

### 1) Preparar variables

```bash
cp infra/.env.example infra/.env
```

Generá secretos:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Pegá esos valores en `infra/.env` para:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `POSTGRES_PASSWORD`

### 2) Levantar stack de producción

```bash
docker compose -f infra/docker-compose.vps.yml --env-file infra/.env up -d --build
```

### 3) Ejecutar migraciones Prisma

```bash
docker compose -f infra/docker-compose.vps.yml --env-file infra/.env run --rm migrate
```

### 3.1) Verificación de API (desde la raíz del monorepo)

Estos comandos sirven para validar build y Prisma localmente si tenés dependencias instaladas en host:

```bash
pnpm --filter @zippy/api prisma:generate
pnpm --filter @zippy/api build
pnpm --filter @zippy/api db:migrate
```

## 4) Verificaciones rápidas

```bash
docker ps
```

```bash
docker compose -f infra/docker-compose.vps.yml --env-file infra/.env logs -f api
```

### Health por Host header (sin DNS aún)

```bash
curl -i -H 'Host: api.zippy.com.ar' http://127.0.0.1/health
curl -I -H 'Host: zippy.com.ar' http://127.0.0.1/
curl -I -H 'Host: admin.zippy.com.ar' http://127.0.0.1/
```

Smoke test directo a API dentro de la red Docker:

```bash
docker compose -f infra/docker-compose.vps.yml --env-file infra/.env exec api wget -qO- http://127.0.0.1:4000/health
```

### Health interno de Nginx

```bash
curl -i -H 'Host: zippy.com.ar' http://127.0.0.1/nginx-health
```

## 5) Checklist Cloudflare / Error 521

1. El VPS debe exponer puerto 80 (`ufw allow 80/tcp` o regla equivalente).
2. DNS A records en Cloudflare:
   - `zippy.com.ar` -> IP VPS
   - `admin.zippy.com.ar` -> IP VPS
   - `api.zippy.com.ar` -> IP VPS
3. Comprobar que nginx está arriba (`docker ps` y logs de nginx).
4. Probar con Host headers locales (sección 4) antes de habilitar proxy estricto en Cloudflare.
