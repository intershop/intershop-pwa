#!/bin/sh

set -e

if [ -z "$*" ]
then
  # Run directly with Node (single theme per container, no PM2)
  # THEME is determined by the build's activeThemes arg
  THEME_DIR=$(ls -d dist/*/server 2>/dev/null | head -1 | cut -d'/' -f2)
  exec node "dist/${THEME_DIR}/run-standalone.js"
else
  exec "$@"
fi
