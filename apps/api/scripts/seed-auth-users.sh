#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000}"

register_user() {
  local email="$1"
  local password="$2"
  local role="$3"

  local payload
  payload=$(printf '{"email":"%s","password":"%s","role":"%s"}' "$email" "$password" "$role")

  local response
  response=$(curl -sS -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
    -H 'Content-Type: application/json' \
    -d "$payload")

  local body
  body=$(echo "$response" | sed '$d')
  local code
  code=$(echo "$response" | tail -n 1)

  if [[ "$code" == "201" || "$code" == "200" ]]; then
    echo "✅ seeded $role user: $email"
  elif [[ "$code" == "409" ]]; then
    echo "ℹ️ user already exists: $email"
  else
    echo "❌ failed to seed $email (HTTP $code)"
    echo "$body"
    exit 1
  fi
}

register_user "admin@zippy.local" "Admin123!" "ADMIN"
register_user "driver@zippy.local" "Driver123!" "DRIVER"
register_user "passenger@zippy.local" "Passenger123!" "PASSENGER"

echo
echo "Seed complete. Test login with:"
echo "  admin@zippy.local / Admin123!"
echo "  driver@zippy.local / Driver123!"
echo "  passenger@zippy.local / Passenger123!"
