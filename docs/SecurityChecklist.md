# Zippy — Security Checklist (API + Infra)

## 1) Principios base
- Secure-by-default en configuración inicial.
- Menor privilegio para accesos y secretos.
- Trazabilidad de eventos críticos.

## 2) API hardening
### Headers
- [ ] `Strict-Transport-Security` habilitado.
- [ ] `X-Content-Type-Options: nosniff`.
- [ ] `X-Frame-Options: DENY` (o política equivalente).
- [ ] `Content-Security-Policy` definida según frontend.
- [ ] `Referrer-Policy` y `Permissions-Policy` revisadas.

### CORS
- [ ] Lista explícita de orígenes permitidos:
  - `https://zippy.com.ar`
  - `https://admin.zippy.com.ar`
- [ ] Métodos/headers permitidos mínimos necesarios.
- [ ] Sin wildcard en producción.

### Rate limiting y abuso
- [ ] Rate limit por IP + ruta sensible (login, recovery).
- [ ] Protección ante bursts y patrones anómalos.
- [ ] Redis como store central de límites.

### Auth strategy
- [ ] JWT de corta duración + refresh token rotativo.
- [ ] Roles iniciales: `admin`, `operator`.
- [ ] Hash de contraseñas con algoritmo robusto (Argon2/Bcrypt).
- [ ] Revocación de sesiones críticas.

## 3) Gestión de secretos
- [ ] Secretos fuera del repositorio (env/secret manager).
- [ ] Rotación periódica de claves/API keys.
- [ ] Separación por entorno (dev/staging/prod).
- [ ] Acceso restringido y auditado.

## 4) Infra (VPS + Cloudflare + Nginx)
- [ ] TLS forzado end-to-end.
- [ ] Firewall mínimo abierto (80/443 + administración restringida).
- [ ] SSH con llave, sin password login.
- [ ] Cloudflare con reglas anti-bot/DDOS base.
- [ ] Backups cifrados de PostgreSQL y restauración probada.

## 5) Logging y observabilidad
- [ ] Logs estructurados (JSON) con `requestId`.
- [ ] No loggear datos sensibles ni tokens.
- [ ] Retención y rotación de logs definidas.
- [ ] Alertas mínimas para errores 5xx y picos de latencia.

## 6) Cumplimiento operativo mínimo
- [ ] Checklist de seguridad en cada release.
- [ ] Dependabot/escaneo de dependencias habilitado.
- [ ] Procedimiento de respuesta ante incidentes documentado.
