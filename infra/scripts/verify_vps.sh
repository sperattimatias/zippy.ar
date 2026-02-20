#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${INFRA_DIR}/docker-compose.vps.yml"
ENV_FILE="${INFRA_DIR}/.env"

log() { echo "[verify_vps] $*"; }
warn() { echo "[verify_vps][WARN] $*" >&2; }
fail() { echo "[verify_vps][ERROR] $*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"
}

required_env=(
  WEB_ORIGIN
  ADMIN_ORIGIN
  NEXT_PUBLIC_API_URL
  DATABASE_URL
  JWT_ACCESS_SECRET
  JWT_REFRESH_SECRET
  POSTGRES_USER
  POSTGRES_PASSWORD
  POSTGRES_DB
)

check_env() {
  [[ -f "${ENV_FILE}" ]] || fail "Missing ${ENV_FILE}. Run install script first."

  for key in "${required_env[@]}"; do
    local val
    val="$(grep -E "^${key}=" "${ENV_FILE}" | tail -n1 | cut -d'=' -f2- || true)"
    [[ -n "${val}" ]] || fail "Missing required env var: ${key}"
    [[ "${val}" != "change-me" ]] || fail "Env var ${key} still has placeholder value 'change-me'"
  done

  grep -q '^WEB_ORIGIN=https://zippy.com.ar$' "${ENV_FILE}" || warn "WEB_ORIGIN differs from expected https://zippy.com.ar"
  grep -q '^ADMIN_ORIGIN=https://admin.zippy.com.ar$' "${ENV_FILE}" || warn "ADMIN_ORIGIN differs from expected https://admin.zippy.com.ar"
  grep -q '^NEXT_PUBLIC_API_URL=https://api.zippy.com.ar$' "${ENV_FILE}" || warn "NEXT_PUBLIC_API_URL differs from expected https://api.zippy.com.ar"
}

check_services_declared() {
  [[ -f "${COMPOSE_FILE}" ]] || fail "Missing compose file: ${COMPOSE_FILE}"
  local services
  services="$(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" config --services)"
  for svc in postgres redis api web admin nginx migrate; do
    echo "${services}" | grep -qx "${svc}" || fail "Service '${svc}' missing in compose config"
  done
}

check_services_up() {
  local status
  status="$(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps --status running --services || true)"
  for svc in postgres api web admin nginx; do
    echo "${status}" | grep -qx "${svc}" || fail "Service '${svc}' is not running"
  done
}

run_health_checks() {
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" exec -T nginx sh -lc "wget -qO- http://127.0.0.1/nginx-health >/dev/null" \
    || fail "Nginx internal health endpoint failed"

  curl -fsS -H "Host: zippy.com.ar" http://127.0.0.1/nginx-health >/dev/null \
    || fail "Nginx host health failed"

  curl -fsS -H "Host: api.zippy.com.ar" http://127.0.0.1/health >/dev/null \
    || fail "API host-routed health failed"

  curl -fsSI -H "Host: zippy.com.ar" http://127.0.0.1/ >/dev/null \
    || fail "Web host health failed"

  curl -fsSI -H "Host: admin.zippy.com.ar" http://127.0.0.1/ >/dev/null \
    || fail "Admin host health failed"
}

diagnostics() {
  warn "Printing diagnostics..."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps || true
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs --tail=120 nginx || true
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs --tail=120 api || true
}

main() {
  require_cmd docker
  require_cmd curl
  require_cmd grep

  check_env
  check_services_declared

  if ! check_services_up; then
    diagnostics
    fail "One or more services are not running"
  fi

  if ! run_health_checks; then
    diagnostics
    fail "Health checks failed"
  fi

  log "Verification successful: env, services and health checks are OK."
}

main "$@"
