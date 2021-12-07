#!/bin/sh

set -e
# set -x

[ -z "$UPSTREAM_PWA" ] && echo "UPSTREAM_PWA is not set" && exit 1

[ -z "$ICM_BASE_URL" ] && echo "ICM_BASE_URL is not set. Cannot use sitemap proxy feature."

[ -z "$OVERRIDE_IDENTITY_PROVIDERS" ] && echo "OVERRIDE_IDENTITY_PROVIDER is not set. Cannot use override identity provider feature."

[ -f "/etc/nginx/conf.d/default.conf" ] && rm /etc/nginx/conf.d/default.conf

if [ -n "$BASIC_AUTH" ]
then
  htpasswd -bc /etc/nginx/.htpasswd $(echo "$BASIC_AUTH" | sed 's/:/ /')
fi

find /etc/nginx/features/*.conf -print0 | xargs -0 -I{} echo {} | sed -e "s%.*\/\(\w*\).conf%\1%" | grep -E '^\w+$' | while read feature; do echo "# $feature" ; env | grep -iqE "^$feature=(on|1|true|yes)$" && echo "include /etc/nginx/features/${feature}.conf;" || echo "include /etc/nginx/features/${feature}-off[.]conf;" ; done >/etc/nginx/conf.d/features.conf

if [ -z "$MULTI_CHANNEL_SOURCE" ]
then
  if [ -z "$MULTI_CHANNEL" ]
  then
    MULTI_CHANNEL_SOURCE="./multi-channel.yaml"
  else
    MULTI_CHANNEL_SOURCE="env:///MULTI_CHANNEL?type=application/yaml"
  fi
fi

if [ -z "$OVERRIDE_IDENTITY_PROVIDERS_SOURCE" ]
then
  if [ -n "$OVERRIDE_IDENTITY_PROVIDERS" ]
  then
    OVERRIDE_IDENTITY_PROVIDERS_SOURCE="env:///OVERRIDE_IDENTITY_PROVIDERS?type=application/yaml"
  fi
fi

if [ -z "$CACHING_IGNORE_PARAMS_SOURCE"]
then
  if [ -z "$CACHING_IGNORE_PARAMS"]
  then
    CACHING_IGNORE_PARAMS_SOURCE="./caching-ignore-params.yaml"
  else
    CACHING_IGNORE_PARAMS_SOURCE="env:///CACHING_IGNORE_PARAMS?type=application/yaml"
  fi
fi

/gomplate -d "domains=$MULTI_CHANNEL_SOURCE" -d "overrideIdentityProviders=$OVERRIDE_IDENTITY_PROVIDERS_SOURCE" -d "cachingIgnoreParams=$CACHING_IGNORE_PARAMS_SOURCE" -d 'ipwhitelist=env:///BASIC_AUTH_IP_WHITELIST?type=application/yaml' --input-dir="/etc/nginx/templates" --output-map='/etc/nginx/conf.d/{{ .in | strings.ReplaceAll ".conf.tmpl" ".conf" }}'

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
