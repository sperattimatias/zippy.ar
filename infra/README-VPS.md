# Zippy VPS Deploy (Producción detrás de Cloudflare)

## 1) Preparar variables

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

## 2) Levantar stack de producción

```bash
docker compose -f infra/docker-compose.vps.yml --env-file infra/.env up -d --build
```

## 3) Ejecutar migraciones Prisma

```bash
docker compose -f infra/docker-compose.vps.yml --env-file infra/.env run --rm migrate
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
