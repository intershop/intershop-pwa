#!/bin/sh

set -e
# set -x

if [ -n "$BASIC_AUTH" ]
then
  htpasswd -bc /etc/nginx/.htpasswd $(echo "$BASIC_AUTH" | sed 's/:/ /')
fi

if env | grep -iqE "^DEBUG=(on|1|true|yes)$"
then
  find /etc/nginx -name '*.conf' -print -exec cat '{}' \;
  nginx -V
fi

if env | grep -iqE "^PROMETHEUS=(on|1|true|yes)$"
then
  (sleep 5 && /nginx-prometheus-exporter)&
fi
