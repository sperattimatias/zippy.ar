# Zippy — API Contract (placeholder)

> Documento base para definir contratos REST y eventos WebSocket del MVP.

## 1) Convenciones generales
- Base URL producción: `https://api.zippy.com.ar`
- Formato: JSON
- Versionado: `/v1`
- Idioma:
  - Código y contratos técnicos: inglés
  - Mensajes orientados a UI: español (Argentina)

## 2) Auth
### REST endpoints
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`

### Payloads (pendiente)
- Request: _TBD_
- Response: _TBD_
- Errores: _TBD_

## 3) Trips
### REST endpoints
- `POST /v1/trips`
- `GET /v1/trips/:id`
- `GET /v1/trips`
- `PATCH /v1/trips/:id/status`

### Payloads (pendiente)
- Request: _TBD_
- Response: _TBD_
- Errores: _TBD_

## 4) Operations (Admin)
### REST endpoints
- `GET /v1/operations/queue`
- `POST /v1/operations/assign`

### Payloads (pendiente)
- Request: _TBD_
- Response: _TBD_
- Errores: _TBD_

## 5) WebSocket events
### Canal / namespace (pendiente)
- _TBD_

### Eventos de salida (server -> client)
- `trip.created`
- `trip.updated`
- `trip.status.changed`

### Eventos de entrada (client -> server)
- `trip.subscribe`
- `trip.unsubscribe`

### Schemas de eventos (pendiente)
- Payload: _TBD_
- Ack/Error: _TBD_

## 6) Errores y observabilidad
- Estructura de error estándar: _TBD_
- Correlation/request id: _TBD_
- Códigos por dominio: _TBD_
