#!/bin/sh

set -e

if env | grep -iqE "^SSL=(on|1|true|yes)$"
then
  mkdir -p /var/nginx/certs

  cert_file='/var/nginx/certs/cert.pem'
  key_file='/var/nginx/certs/key.pem'

  if [ ! -r "$cert_file" ] || [ ! -r "$key_file" ]
  then
    echo "ERROR: SSL is enabled, but the required certificate files are missing or not readable." >&2
    echo "Expected readable files:" >&2
    echo "  - $cert_file" >&2
    echo "  - $key_file" >&2
    echo "Mount the certificate and key into /var/nginx/certs before starting NGINX." >&2
    exit 1
  fi
fi
