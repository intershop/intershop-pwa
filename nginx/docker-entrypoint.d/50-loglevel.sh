#!/bin/sh

set -e

# Default to 'error' if LOGLEVEL is not set
LOGLEVEL=${LOGLEVEL:-error}

# Validate loglevel
case "$LOGLEVEL" in
  info|warn|error)
    echo "# loglevel"
    echo "include /etc/nginx/loglevel/${LOGLEVEL}.conf;"
    ;;
  *)
    echo "# loglevel (invalid value '$LOGLEVEL', defaulting to error)"
    echo "include /etc/nginx/loglevel/error.conf;"
    ;;
esac > /etc/nginx/conf.d/loglevel.conf
