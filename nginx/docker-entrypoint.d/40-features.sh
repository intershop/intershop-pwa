#!/bin/sh

set -e

find /etc/nginx/features/*.conf -print0 | xargs -0 -I{} echo {} | sed -e "s%.*\/\(\w*\).conf%\1%" | grep -E '^\w+$' | while read feature; do echo "# $feature" ; env | grep -iqE "^$feature=(on|1|true|yes)$" && echo "include /etc/nginx/features/${feature}.conf;" || echo "include /etc/nginx/features/${feature}-off[.]conf;" ; done >/etc/nginx/conf.d/features.conf
