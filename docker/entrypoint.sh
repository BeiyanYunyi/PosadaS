#!/bin/sh
set -eu
cd /app
case "${1:-start}" in
  init|build)
    shift
    [ "$#" -eq 0 ] || { echo 'init takes no arguments' >&2; exit 2; }
    exec node docker/initialize.mjs
    ;;
  start)
    shift
    node docker/initialize.mjs --check
    exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 "$@"
    ;;
  *)
    echo 'Usage: entrypoint.sh {init|build|start}' >&2
    exit 2
    ;;
esac
