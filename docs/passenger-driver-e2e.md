# Passenger + Driver + Admin iteration

## Checklist implementado
- Prisma actualizado con `User`, `FavoritePlace`, `DriverProfile`, `Ride`, `RideStatusHistory`, `Offer`, `AppConfig`.
- Auth JWT access/refresh + `/me` + update perfil + favoritos.
- Passenger: estimación y creación de rides (`SEARCHING`) + historial/detalle/cancel.
- Matchmaking básico: selección de conductores verificados online por distancia y creación de ofertas.
- Driver web/API: registro, online/offline, ofertas, aceptar/rechazar, cambio de estado del ride.
- Admin web/API: verificación conductores, configuración Google Maps, pricing.
- Seed de superadmin automático con override por ENV y password aleatorio.

## Endpoints principales
- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /me`, `PATCH /me`
- Favoritos: `GET/POST /me/favorites`, `DELETE /me/favorites/:id`
- Passenger rides: `POST /rides/estimate`, `POST /rides`, `GET /rides`, `GET /rides/:id`, `POST /rides/:id/cancel`
- Driver: `POST /driver/register`, `POST /driver/online`, `GET /driver/offers`, `POST /driver/offers/:id/accept`, `POST /driver/offers/:id/reject`, `POST /driver/rides/:id/status`
- Admin: `GET /admin/drivers`, `PATCH /admin/drivers/:id/approve`, `PATCH /admin/drivers/:id/ban`, `GET /admin/config`, `PUT /admin/config/google-maps`, `PUT /admin/config/pricing`

## Configuración Google Maps
1. Definir `GOOGLE_MAPS_WEB_KEY` y `GOOGLE_MAPS_SERVER_KEY` en entorno del API.
2. En Admin ir a `/settings/integrations/google-maps` para toggles y (opcional) persistir keys en DB.
3. Si no se cargan keys, la API usa fallback por ENV y cálculo por haversine para estimación.

## Plan de pruebas manual E2E (12 pasos)
1. Correr migraciones y seed de API.
2. Crear pasajero en `/auth/register` web.
3. Completar perfil en `/account` (nombre/apellido/avatar).
4. Crear favorito vía API `/me/favorites`.
5. Ir a Home y cargar destino + opciones.
6. Ejecutar “Calcular estimación”.
7. Solicitar viaje -> redirección a detalle `/rides/:id`.
8. Registrar conductor en `/driver/register`.
9. Aprobar conductor desde Admin `/drivers`.
10. Login conductor + pasar ONLINE en `/driver/dashboard`.
11. Aceptar oferta; verificar ride `ASSIGNED` en detalle pasajero.
12. Cambiar estados desde driver endpoint y verificar timeline en `/rides/:id`.
