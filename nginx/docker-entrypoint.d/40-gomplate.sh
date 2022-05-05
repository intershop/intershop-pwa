#!/bin/sh

set -e
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

if [ -z "$CACHING_IGNORE_PARAMS_SOURCE" ]
then
  if [ -z "$CACHING_IGNORE_PARAMS" ]
  then
    CACHING_IGNORE_PARAMS_SOURCE="./caching-ignore-params.yaml"
  else
    CACHING_IGNORE_PARAMS_SOURCE="env:///CACHING_IGNORE_PARAMS?type=application/yaml"
  fi
fi

/gomplate -d "domains=$MULTI_CHANNEL_SOURCE" -d "overrideIdentityProviders=$OVERRIDE_IDENTITY_PROVIDERS_SOURCE" -d "cachingIgnoreParams=$CACHING_IGNORE_PARAMS_SOURCE" -d 'ipwhitelist=env:///BASIC_AUTH_IP_WHITELIST?type=application/yaml' --input-dir="/etc/nginx/templates" --output-map='/etc/nginx/conf.d/{{ .in | strings.ReplaceAll ".conf.tmpl" ".conf" }}'
