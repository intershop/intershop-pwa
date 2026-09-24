#!/bin/sh

set -e

if [ -n "${THEME}" ] && [ -f "/dist/${THEME}/server/server.mjs" ]; then
  exec node "/dist/${THEME}/server/server.mjs"
elif [ -f "/dist/server/server.mjs" ]; then
  THEME=""
  exec node "/dist/server/server.mjs"
else
  echo "No server found to start. Theme is set to '${THEME:-undefined}'."
  exit 1
fi
