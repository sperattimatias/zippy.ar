#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000}"

ride_payload='{
  "estimatedFare": 2100,
  "hasLuggage": true,
  "hasPets": false,
  "needsAccessibility": false,
  "note": "Seed ride for local development"
}'

ride_response=$(curl -sS -X POST "$API_URL/rides" -H 'content-type: application/json' -d "$ride_payload")
ride_id=$(echo "$ride_response" | node -e "process.stdin.once('data',d=>console.log(JSON.parse(d).id))")

echo "Created ride: $ride_id"

curl -sS -X POST "$API_URL/rides/$ride_id/offers" \
  -H 'content-type: application/json' \
  -d '{"driverId":"driver_seed_1","amount":2200,"message":"Can arrive in 8 minutes"}' >/dev/null

curl -sS -X POST "$API_URL/rides/$ride_id/offers" \
  -H 'content-type: application/json' \
  -d '{"driverId":"driver_seed_2","amount":2050,"message":"Nearby and ready"}' >/dev/null

echo "Created 2 offers for ride $ride_id"
