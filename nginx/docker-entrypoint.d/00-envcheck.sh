#!/bin/sh

set -e

if [ -f "/etc/nginx/conf.d/default.conf" ]
then
  rm /etc/nginx/conf.d/default.conf
fi

if [ -z "$UPSTREAM_PWA" ]
then
  echo "UPSTREAM_PWA is not set"
  exit 1
fi

if [ -z "$ICM_BASE_URL" ]
then
  echo "ICM_BASE_URL is not set. Cannot use sitemap proxy feature."
fi

if [ -z "$OVERRIDE_IDENTITY_PROVIDERS" ]
then
  echo "OVERRIDE_IDENTITY_PROVIDERS is not set. Cannot use override identity provider feature."
fi
