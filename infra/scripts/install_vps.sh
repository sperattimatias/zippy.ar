#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_DIR="$(cd "${INFRA_DIR}/.." && pwd)"
COMPOSE_FILE="${INFRA_DIR}/docker-compose.vps.yml"
ENV_FILE="${INFRA_DIR}/.env"
ENV_EXAMPLE="${INFRA_DIR}/.env.example"

log() { echo "[install_vps] $*"; }
fail() { echo "[install_vps][ERROR] $*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

assert_linux_ubuntu() {
  [[ "$(uname -s)" == "Linux" ]] || fail "This installer only supports Linux (Ubuntu 22.04/24.04)."
  [[ -f /etc/os-release ]] || fail "Cannot detect OS. /etc/os-release not found."
  # shellcheck disable=SC1091
  source /etc/os-release
  [[ "${ID:-}" == "ubuntu" ]] || fail "Unsupported OS: ${ID:-unknown}. This installer supports Ubuntu only."
  case "${VERSION_ID:-}" in
    22.04|24.04) ;;
    *) log "Warning: Ubuntu ${VERSION_ID:-unknown} detected. Proceeding, but validated targets are 22.04/24.04." ;;
  esac
}

ensure_root_or_sudo() {
  if [[ "${EUID}" -ne 0 ]] && ! command -v sudo >/dev/null 2>&1; then
    fail "Run as root or install sudo."
  fi
}

as_root() {
  if [[ "${EUID}" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

install_docker_if_missing() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    log "Docker Engine + compose plugin already installed."
    return
  fi

  log "Installing Docker Engine + compose plugin..."
  as_root apt-get update -y
  as_root apt-get install -y ca-certificates curl gnupg
  as_root install -m 0755 -d /etc/apt/keyrings

  if [[ ! -f /etc/apt/keyrings/docker.gpg ]]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | as_root gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    as_root chmod a+r /etc/apt/keyrings/docker.gpg
  fi

  local arch codename
  arch="$(dpkg --print-architecture)"
  # shellcheck disable=SC1091
  source /etc/os-release
  codename="${VERSION_CODENAME}"

  local repo_file="/etc/apt/sources.list.d/docker.list"
  echo "deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${codename} stable" | as_root tee "${repo_file}" >/dev/null

  as_root apt-get update -y
  as_root apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  as_root systemctl enable --now docker

  if [[ "${EUID}" -ne 0 ]]; then
    as_root usermod -aG docker "${USER}" || true
    log "Added ${USER} to docker group (re-login may be required)."
  fi
}

configure_ufw() {
  if ! command -v ufw >/dev/null 2>&1; then
    log "Installing UFW..."
    as_root apt-get update -y
    as_root apt-get install -y ufw
  fi

  log "Configuring UFW rules (22/tcp, 80/tcp and 443/tcp)..."
  as_root ufw allow 22/tcp >/dev/null
  as_root ufw allow 80/tcp >/dev/null
  as_root ufw allow 443/tcp >/dev/null
  as_root ufw --force enable >/dev/null || true
}

random_hex() {
  openssl rand -hex "$1"
}

ensure_env_file() {
  [[ -f "${ENV_EXAMPLE}" ]] || fail "Missing ${ENV_EXAMPLE}"
  if [[ ! -f "${ENV_FILE}" ]]; then
    log "Creating ${ENV_FILE} from .env.example"
    cp "${ENV_EXAMPLE}" "${ENV_FILE}"
  else
    log "Using existing ${ENV_FILE} (will only fill missing values)."
  fi
}

upsert_env_var() {
  local key="$1"
  local value="$2"
  if grep -qE "^${key}=" "${ENV_FILE}"; then
    sed -i "s#^${key}=.*#${key}=${value}#" "${ENV_FILE}"
  else
    echo "${key}=${value}" >> "${ENV_FILE}"
  fi
}

ensure_env_var() {
  local key="$1"
  local default_val="$2"
  local current
  current="$(grep -E "^${key}=" "${ENV_FILE}" | tail -n1 | cut -d'=' -f2- || true)"

  if [[ -z "${current}" || "${current}" == "change-me" ]]; then
    upsert_env_var "${key}" "${default_val}"
    log "Set ${key}"
  else
    log "Preserved existing ${key}"
  fi
}

prepare_env_values() {
  ensure_env_var "POSTGRES_USER" "zippy"
  ensure_env_var "POSTGRES_DB" "zippy"

  ensure_env_var "POSTGRES_PASSWORD" "$(random_hex 24)"
  ensure_env_var "JWT_ACCESS_SECRET" "$(random_hex 32)"
  ensure_env_var "JWT_REFRESH_SECRET" "$(random_hex 32)"

  # Domain configuration (only used as defaults when corresponding vars are missing):
  # - BASE_DOMAIN: base DNS zone for deployment (default: zippy.ar)
  # - WEB_DOMAIN: public passenger web domain (default: BASE_DOMAIN)
  # - ADMIN_DOMAIN: admin panel domain (default: admin.BASE_DOMAIN)
  # - API_DOMAIN: API public domain (default: api.BASE_DOMAIN)
  local base_domain web_domain admin_domain api_domain
  base_domain="${BASE_DOMAIN:-zippy.ar}"
  web_domain="${WEB_DOMAIN:-${base_domain}}"
  admin_domain="${ADMIN_DOMAIN:-admin.${base_domain}}"
  api_domain="${API_DOMAIN:-api.${base_domain}}"

  ensure_env_var "WEB_ORIGIN" "https://${web_domain}"
  ensure_env_var "ADMIN_ORIGIN" "https://${admin_domain}"
  ensure_env_var "NEXT_PUBLIC_API_URL" "https://${api_domain}"

  local db_user db_pass db_name
  db_user="$(grep -E '^POSTGRES_USER=' "${ENV_FILE}" | tail -n1 | cut -d'=' -f2-)"
  db_pass="$(grep -E '^POSTGRES_PASSWORD=' "${ENV_FILE}" | tail -n1 | cut -d'=' -f2-)"
  db_name="$(grep -E '^POSTGRES_DB=' "${ENV_FILE}" | tail -n1 | cut -d'=' -f2-)"
  upsert_env_var "DATABASE_URL" "postgresql://${db_user}:${db_pass}@postgres:5432/${db_name}?schema=public"

  ensure_env_var "JWT_ACCESS_EXPIRES_IN_SECONDS" "900"
  ensure_env_var "JWT_REFRESH_EXPIRES_IN_SECONDS" "604800"
  ensure_env_var "THROTTLE_TTL" "60"
  ensure_env_var "THROTTLE_LIMIT" "100"
  ensure_env_var "REDIS_PORT" "6379"
}

validate_compose_services() {
  [[ -f "${COMPOSE_FILE}" ]] || fail "Missing compose file: ${COMPOSE_FILE}"

  local services
  services="$(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" config --services)"
  for svc in postgres redis api web admin nginx migrate; do
    echo "${services}" | grep -qx "${svc}" || fail "Expected compose service '${svc}' not found."
  done
}

bring_up_stack() {
  log "Building and starting VPS stack..."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --build
}

run_migrations() {
  log "Running Prisma generate + migrate via migrate service..."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm migrate
}

smoke_test() {
  log "Waiting for nginx to be ready..."
  sleep 5

  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" exec -T nginx sh -lc "wget -qO- http://127.0.0.1/nginx-health >/dev/null"     || fail "Nginx container health endpoint failed (/nginx-health)."

  local web_origin api_origin web_host api_host
  web_origin="$(grep -E '^WEB_ORIGIN=' "${ENV_FILE}" | tail -n1 | cut -d'=' -f2-)"
  api_origin="$(grep -E '^NEXT_PUBLIC_API_URL=' "${ENV_FILE}" | tail -n1 | cut -d'=' -f2-)"
  web_host="${web_origin#https://}"
  web_host="${web_host#http://}"
  api_host="${api_origin#https://}"
  api_host="${api_host#http://}"

  curl -fsS -H "Host: ${web_host}" http://127.0.0.1/nginx-health >/dev/null     || fail "Host-routed nginx health failed for ${web_host}"

  curl -fsS -H "Host: ${api_host}" http://127.0.0.1/health >/dev/null     || fail "API health failed via nginx host routing (${api_host} -> /health)."

  log "Smoke tests passed (nginx + api health)."
}


main() {
  assert_linux_ubuntu
  ensure_root_or_sudo
  require_cmd curl
  require_cmd openssl
  require_cmd grep
  require_cmd sed

  install_docker_if_missing
  configure_ufw
  ensure_env_file
  prepare_env_values
  validate_compose_services
  bring_up_stack
  run_migrations
  smoke_test

  log "Done. VPS installation completed successfully."
}

main "$@"
