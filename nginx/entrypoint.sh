#!/bin/sh

set -e
# set -x

[ -z "$UPSTREAM_PWA" ] && echo "UPSTREAM_PWA is not set" && exit 1

[ -f "/etc/nginx/conf.d/default.conf" ] && rm /etc/nginx/conf.d/default.conf

find /etc/nginx/features/*.conf | xargs -I{} echo {} | sed -e "s%.*\/\(\w*\).conf%\1%" | grep -E '^\w+$' | while read feature; do echo "# $feature" ; env | grep -iqE "^$feature=(on|1|true|yes)$" && echo "include /etc/nginx/features/${feature}.conf;" || echo "include /etc/nginx/features/${feature}-off[.]conf;" ; done >/etc/nginx/conf.d/features.conf

if [ -z "$MULTI_CHANNEL_SOURCE" ]
then
  if [ -z "$MULTI_CHANNEL" ]
  then
    MULTI_CHANNEL_SOURCE="./multi-channel.yaml"
  else
    MULTI_CHANNEL_SOURCE="env:///MULTI_CHANNEL?type=application/yaml"
  fi
fi

/gomplate -d "domains=$MULTI_CHANNEL_SOURCE" </etc/nginx/conf.d/channel.conf.tmpl >/etc/nginx/conf.d/multi-channel.conf

# Generate Pagespeed config based on environment variables
env | grep NPSC_ | sed -e 's/^NPSC_//g' -e "s/\([A-Z_]*\)=/\L\1=/g" -e "s/_\([a-zA-Z]\)/\u\1/g" -e "s/^\([a-zA-Z]\)/\u\1/g" -e 's/=.*$//' -e 's/\=/ /' -e 's/^/\pagespeed /' > /tmp/pagespeed-prefix.txt

env | grep NPSC_ | sed -e 's/^[^=]*=//' -e 's/$/;/' > /tmp/pagespeed-suffix.txt

paste -d" " /tmp/pagespeed-prefix.txt /tmp/pagespeed-suffix.txt >> /etc/nginx/features/pagespeed.conf

if env | grep -iqE "^DEBUG=(on|1|true|yes)$"
then
  find /etc/nginx -name '*.conf' -print -exec cat '{}' \;
fi

if env | grep -iqE "^PROMETHEUS=(on|1|true|yes)$"
then
  (sleep 5 && /nginx-prometheus-exporter)&
fi

if [ -z "$*" ]
then
  /usr/local/nginx/sbin/nginx -c /etc/nginx/nginx.conf -g "daemon off;"
else
  exec "$@"
fi
