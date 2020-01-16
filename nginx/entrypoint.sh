#!/bin/sh

set -e
# set -x

[ -z "$UPSTREAM_PWA" ] && echo "UPSTREAM_PWA is not set" && exit 1

[ -f "/etc/nginx/conf.d/default.conf" ] && rm /etc/nginx/conf.d/default.conf

if [ -n "$UPSTREAM_ICM" ]
then
  envsubst \$UPSTREAM_ICM </etc/nginx/conf.d/icm.conf.tmpl > /etc/nginx/conf.d/icm.conf
  export ICM_INCLUDE="include /etc/nginx/conf.d/icm.conf;"
fi

i=1
while true
do
  eval "export SUBDOMAIN=\$PWA_${i}_SUBDOMAIN"
  [ -z "$SUBDOMAIN" ] && break

  eval "export CHANNEL=\$PWA_${i}_CHANNEL"
  [ -z "$CHANNEL" ] && echo "PWA_${i}_CHANNEL must be set" && exit 1

  eval "export APPLICATION=\${PWA_${i}_APPLICATION:-'-'}"
  eval "export LANG=\${PWA_${i}_LANG:-'default'}"
  eval "export FEATURES=\${PWA_${i}_FEATURES:-'default'}"
  eval "export THEME=\${PWA_${i}_THEME:-''}"

  echo "$i SUBDOMAIN=$SUBDOMAIN CHANNEL=$CHANNEL APPLICATION=$APPLICATION LANG=$LANG FEATURES=$FEATURES"

  envsubst '$UPSTREAM_PWA,$SUBDOMAIN,$CHANNEL,$APPLICATION,$LANG,$FEATURES,$THEME,$ICM_INCLUDE' </etc/nginx/conf.d/channel.conf.tmpl >/etc/nginx/conf.d/channel$i.conf

  i=$((i+1))
done

# Generate Pagespeed config based on environment variables
env | grep NPSC_ | sed -e 's/^NPSC_//g' -e "s/\([A-Z_]*\)=/\L\1=/g" -e "s/_\([a-zA-Z]\)/\u\1/g" -e "s/^\([a-zA-Z]\)/\u\1/g" -e 's/=.*$//' -e 's/\=/ /' -e 's/^/\pagespeed /' > /tmp/pagespeed-prefix.txt

env | grep NPSC_ | sed -e 's/^[^=]*=//' -e 's/$/;/' > /tmp/pagespeed-suffix.txt

paste -d" " /tmp/pagespeed-prefix.txt /tmp/pagespeed-suffix.txt >> /etc/nginx/pagespeed.conf

find /etc/nginx -name '*.conf' -print -exec cat '{}' \;

if [ -z "$*" ]
then
  /usr/local/nginx/sbin/nginx -c /etc/nginx/nginx.conf -g "daemon off;"
else
  exec "$@"
fi
