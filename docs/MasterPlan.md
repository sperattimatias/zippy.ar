# Zippy — Master Plan (MVP)

## 1) Objetivo MVP
Lanzar una plataforma inicial de gestión de viajes para operación diaria, con foco en velocidad, trazabilidad y experiencia clara.

**Productos del MVP**
- **Passenger Web** (`zippy.com.ar`): solicitud/seguimiento básico de viajes.
- **Admin Web** (`admin.zippy.com.ar`): operación, monitoreo y gestión.
- **API** (`api.zippy.com.ar`): negocio, autenticación, integraciones.

> Regla de idioma: **código en inglés**, **interfaces en español (Argentina)**.

## 2) Alcance MVP
### Funcional
- Autenticación para operadores/admin.
- Gestión de viajes (alta, asignación, estado).
- Seguimiento de estados en tiempo real (base de websocket/eventos).
- Historial simple y búsqueda por identificador.

### Técnico
- Monorepo con `pnpm` workspaces + Turborepo.
- API con persistencia en PostgreSQL.
- Cache/colas livianas con Redis.
- Reverse proxy con Nginx en VPS.
- DNS y proxy con Cloudflare.

## 3) Fuera de alcance MVP
- App móvil nativa.
- Motor avanzado de pricing dinámico.
- BI/analytics complejos.
- Multi-tenant completo.

## 4) Backlog por fases
### Fase 2 (post-MVP)
- Notificaciones (email/WhatsApp/push).
- Reportes operativos y paneles de KPIs.
- Mejoras de matching/asignación.
- Roles y permisos más granulares.

### Fase 3 (escala)
- Auditoría avanzada y trazabilidad extendida.
- Alta disponibilidad (replicación y estrategia DR).
- Observabilidad completa (traces + alertas SLO).
- Integraciones externas (pasarelas, partners logísticos).

## 5) Estado de avance
### Done
- Estructura base de monorepo y estándares de tooling.
- Carpetas de apps e infraestructura definidas.

### In progress
- Definición de arquitectura detallada por dominio.
- Contrato API inicial y checklist de seguridad base.

### Next
- Skeleton funcional de API.
- Base UI de Passenger/Admin con sistema visual consistente.
- Setup de ambientes (dev/staging/prod) en VPS.

## 6) Criterios de éxito MVP
- Flujo end-to-end operativo en producción inicial.
- Tiempos de respuesta estables para operación diaria.
- Base de seguridad y logging habilitada desde el día 1.
