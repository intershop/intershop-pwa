#!/bin/sh

set -e

trap 'ps -o pid,comm | grep node | awk "{ print $1 }" | xargs -r kill' INT TERM

if [ -z "$*" ]
then
  node dist/server
else
  exec "$@"
fi
