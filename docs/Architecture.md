# Zippy — Arquitectura (alto nivel)

## 1) Visión general
Arquitectura web distribuida en subdominios, desplegada sobre **VPS** con front de tráfico en **Cloudflare DNS**.

- `zippy.com.ar` → Passenger Web
- `admin.zippy.com.ar` → Admin Web
- `api.zippy.com.ar` → API

Regla transversal:
- **Código en inglés** (nombres de clases, funciones, endpoints, variables).
- **Contenido de UI en español (Argentina)**.

## 2) Componentes principales
- **Passenger Web**: frontend para usuarios pasajeros.
- **Admin Web**: frontend para operación interna.
- **API**: capa de negocio, autenticación, autorización y eventos.
- **PostgreSQL**: persistencia principal (transaccional).
- **Redis**: cache, rate-limit store y pub/sub básico.
- **Nginx**: reverse proxy, TLS termination en VPS, routing por host.
- **Cloudflare**: DNS, proxy, capa adicional de protección/performance.

## 3) Flujo de requests
1. Cliente resuelve DNS vía Cloudflare.
2. Tráfico llega a Nginx en VPS.
3. Nginx enruta por host a Passenger/Admin/API.
4. API persiste en PostgreSQL y usa Redis para cache/eventos.

## 4) Dominios (plan inicial)
- **Auth & Identity**: login, sesiones/tokens, roles base.
- **Trips**: creación, ciclo de estado y tracking.
- **Operations**: asignación, control y acciones administrativas.
- **Notifications** (fase posterior): mensajería transaccional.
- **Audit & Logs**: eventos de seguridad y operación.

## 5) Ambientes y despliegue
- **Dev local**: monorepo + servicios locales.
- **Staging**: opcional temprano, recomendable antes de go-live.
- **Prod**: VPS principal, backups programados y monitoreo básico.

## 6) Decisiones de arquitectura
- Priorizar simplicidad operativa para MVP.
- Evitar microservicios prematuros; modularidad interna en API.
- Diseñar contratos (REST/WebSocket) con versionado temprano.
