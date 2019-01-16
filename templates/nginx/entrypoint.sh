#!/bin/sh

set -e
# set -x

[ -z "$UPSTREAM_ICM" ] && echo "UPSTREAM_ICM is not set" && exit 1
[ -z "$UPSTREAM_PWA" ] && echo "UPSTREAM_PWA is not set" && exit 1

rm /etc/nginx/conf.d/default.conf
envsubst \$UPSTREAM_ICM </etc/nginx/conf.d/icm.common.tmpl > /etc/nginx/conf.d/icm.common

cat /etc/nginx/conf.d/icm.common

i=1
while true
do
  eval "export SUBDOMAIN=\$PWA_${i}_SUBDOMAIN"
  [ -z "$SUBDOMAIN" ] && break

  eval "export CHANNEL=\$PWA_${i}_CHANNEL"
  [ -z "$CHANNEL" ] && echo "PWA_${i}_CHANNEL must be set" && exit 1

  eval "export APPLICATION=\${PWA_${i}_APPLICATION:-'-'}"
  eval "export LANG=\${PWA_${i}_LANG:-'en_US'}"
  eval "export FEATURES=\${PWA_${i}_FEATURES:-'default'}"

  echo "$i SUBDOMAIN=$SUBDOMAIN CHANNEL=$CHANNEL APPLICATION=$APPLICATION LANG=$LANG FEATURES=$FEATURES"

  envsubst '$UPSTREAM_PWA,$SUBDOMAIN,$CHANNEL,$APPLICATION,$LANG,$FEATURES' </etc/nginx/conf.d/channel.conf.tmpl >/etc/nginx/conf.d/channel$i.conf

  i=$((i+1))
done

find /etc/nginx/conf.d -name '*.conf' -print -exec cat '{}' \;

nginx -g "daemon off;"
