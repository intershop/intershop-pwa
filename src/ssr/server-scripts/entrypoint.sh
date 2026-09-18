#!/bin/sh

set -e

if [ "$1" = "start" ]
then
  node /dist/build-ecosystem.cjs
  exec /dist/node_modules/.bin/pm2-runtime /dist/ecosystem.json
else
  exec "$@"
fi
