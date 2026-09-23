#!/bin/sh

set -e

if [ -n "${THEME}" ] && [ -f "/dist/${THEME}/server/main.js" ]; then
  exec node "/dist/${THEME}/server/main.js"
elif [ -f "/dist/server/main.js" ]; then
  THEME=""
  exec node "/dist/server/main.js"
else
  echo "No server found to start. Theme is set to '${THEME:-undefined}'."
  exit 1
fi
