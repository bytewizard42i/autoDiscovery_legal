#!/usr/bin/env bash
# wait-for-stack.sh
# Polls each service health endpoint for the midnight-local-dev stack.
# Usage: bash scripts/wait-for-stack.sh [--timeout <seconds>]
# Exit 0 when all services are healthy, exit 1 on timeout.

set -euo pipefail

TIMEOUT=120
while [[ $# -gt 0 ]]; do
  case "$1" in
    --timeout)
      TIMEOUT="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

DEADLINE=$(( $(date +%s) + TIMEOUT ))

check_deadline() {
  if [[ $(date +%s) -ge $DEADLINE ]]; then
    echo "  TIMEOUT: $1 did not become healthy within ${TIMEOUT}s." >&2
    return 1
  fi
}

wait_for_proof_server() {
  echo "  Waiting for proof-server..."
  until curl -sf http://localhost:6300/version > /dev/null 2>&1; do
    check_deadline "proof-server"
    sleep 3
  done
  echo "  OK: proof-server is healthy."
}

wait_for_node() {
  echo "  Waiting for node..."
  until curl -sf http://localhost:9944/health > /dev/null 2>&1; do
    check_deadline "node"
    sleep 3
  done
  echo "  OK: node is healthy."
}

wait_for_indexer() {
  echo "  Waiting for indexer..."
  until curl -sf http://localhost:8088/api/v3/graphql \
      -H 'Content-Type: application/json' \
      --data '{"query":"{__typename}"}' > /dev/null 2>&1; do
    check_deadline "indexer"
    sleep 3
  done
  echo "  OK: indexer is healthy."
}

echo "Waiting for midnight-local-dev stack (timeout: ${TIMEOUT}s)..."

wait_for_proof_server
wait_for_node
wait_for_indexer

echo "All services are healthy."
