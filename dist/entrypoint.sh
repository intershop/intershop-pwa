#!/bin/sh

set -e

trap 'echo recieved INT; exit 1' SIGINT
trap 'echo recieved TERM; exit 0' SIGTERM
trap 'echo recieved KILL; exit 1' SIGKILL

if [ -z "$*" ]
then
  # use 'node dist/<theme>/run-standalone'
  # instead of pm2 to fallback to running
  # a single theme only

  node dist/build-ecosystem.js
  pm2-runtime dist/ecosystem.yml
else
  exec "$@"
fi
