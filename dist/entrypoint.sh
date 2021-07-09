#!/bin/sh

set -e

trap 'echo recieved INT; exit 1' SIGINT
trap 'echo recieved TERM; exit 0' SIGTERM
trap 'echo recieved KILL; exit 1' SIGKILL

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

exec "$@"
