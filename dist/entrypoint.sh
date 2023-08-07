#!/bin/sh

set -e

if [ -z "$*" ]
then
  # use 'exec node dist/<theme>/run-standalone'
  # instead of pm2 to fallback to running
  # a single theme only

  node dist/build-ecosystem.js
  exec pm2-runtime dist/ecosystem.yml
else
  exec "$@"
fi
