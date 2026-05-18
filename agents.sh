#!/usr/bin/env bash
set -euo pipefail

# Load .env if present
if [ -f "$(dirname "$0")/.env" ]; then
  # shellcheck disable=SC1091
  source "$(dirname "$0")/.env"
fi

API_KEY="${PLETOR_API_KEY:?Error: PLETOR_API_KEY is not set}"
BASE="${PLETOR_API_BASE:-https://api.pletor.ai/api/public/v1}"

usage() {
  echo "Usage: $0 <command> [args]"
  echo ""
  echo "Commands:"
  echo "  list                   List all agents"
  echo "  get <agent_id>         Get a specific agent"
  echo "  run <agent_id> <msg>   Run an agent with a message"
  echo ""
}

list_agents() {
  curl -s -X GET "$BASE/agents" \
    -H "X-Api-Key: $API_KEY" \
    -H "Content-Type: application/json" | jq .
}

get_agent() {
  local agent_id="$1"
  curl -s -X GET "$BASE/agents/$agent_id" \
    -H "X-Api-Key: $API_KEY" \
    -H "Content-Type: application/json" | jq .
}

run_agent() {
  local agent_id="$1"
  local message="$2"
  curl -s -X POST "$BASE/agents/$agent_id/run" \
    -H "X-Api-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"$message\"}" | jq .
}

case "${1:-}" in
  list)   list_agents ;;
  get)    get_agent "${2:?Usage: $0 get <agent_id>}" ;;
  run)    run_agent "${2:?Usage: $0 run <agent_id> <msg>}" "${3:?Usage: $0 run <agent_id> <msg>}" ;;
  *)      usage; exit 1 ;;
esac
