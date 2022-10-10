#!/bin/sh

set -e

if env | grep -iqE "^SSL=(on|1|true|yes)$"
then
  mkdir -p /var/nginx/certs
  mkcert -install
  mkcert -key-file /var/nginx/certs/key.pem -cert-file /var/nginx/certs/cert.pem "$(hostname)"
  printf 'You can now export the local CA by adjusting your docker-compose.yml /home/your-user/ca-dir:%s\n' "$(mkcert -CAROOT)/rootCA.pem"
fi
