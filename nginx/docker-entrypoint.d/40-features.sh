#!/bin/sh

set -e

# Handle standard on/off features
find /etc/nginx/features/*.conf -print0 | xargs -0 -I{} echo {} | sed -e "s%.*\/\(\w*\).conf%\1%" | grep -E '^\w+$' | grep -v '^loglevel' | while read feature; do echo "# $feature" ; env | grep -iqE "^$feature=(on|1|true|yes)$" && echo "include /etc/nginx/features/${feature}.conf;" || echo "include /etc/nginx/features/${feature}-off[.]conf;" ; done >/etc/nginx/conf.d/features.conf

# Handle LOGLEVEL (info, warn, error) - default is warn
LOGLEVEL_VALUE=$(echo "${LOGLEVEL:-warn}" | tr '[:upper:]' '[:lower:]')
case "$LOGLEVEL_VALUE" in
    info)
        echo "# loglevel" >> /etc/nginx/conf.d/features.conf
        echo "include /etc/nginx/features/loglevel-info.conf;" >> /etc/nginx/conf.d/features.conf
        ;;
    error)
        echo "# loglevel" >> /etc/nginx/conf.d/features.conf
        echo "include /etc/nginx/features/loglevel-error.conf;" >> /etc/nginx/conf.d/features.conf
        ;;
    *)
        # Default to warn
        echo "# loglevel" >> /etc/nginx/conf.d/features.conf
        echo "include /etc/nginx/features/loglevel-warn.conf;" >> /etc/nginx/conf.d/features.conf
        ;;
esac
