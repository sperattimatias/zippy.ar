# Zippy Alpha (Docker Compose DEV)

## 1) Crear archivo de entorno

```bash
cp infra/.env.example infra/.env
```

## 2) Generar secretos JWT seguros

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Pegá esos valores en `infra/.env` para:

- `JWT_ACCESS_SECRET=`
- `JWT_REFRESH_SECRET=`

## 3) Levantar stack alpha

```bash
docker compose -f infra/docker-compose.yml up -d --build
```


## Nota sobre lockfile en alpha

Las imágenes Docker de alpha usan `pnpm install --no-frozen-lockfile` durante el build para priorizar que el stack levante en VPS nuevos aunque el `pnpm-lock.yaml` esté desactualizado respecto a algún `package.json`.

## 4) Verificaciones

### Nginx -> API

```bash
curl -i http://localhost/api/health
```

### Nginx -> Web

```bash
curl -I http://localhost/
```

### Nginx -> Admin

```bash
curl -I http://localhost/admin/
```

### Verificación directa dentro del contenedor API

```bash
docker exec -it zippy-api sh -lc 'apk add --no-cache curl >/dev/null 2>&1 || true; curl -i http://127.0.0.1:4000/health'
```
