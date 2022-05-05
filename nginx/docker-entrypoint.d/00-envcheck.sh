#!/bin/sh

set -e

[ -f "/etc/nginx/conf.d/default.conf" ] && rm /etc/nginx/conf.d/default.conf

[ -z "$UPSTREAM_PWA" ] && echo "UPSTREAM_PWA is not set" && exit 1

[ -z "$ICM_BASE_URL" ] && echo "ICM_BASE_URL is not set. Cannot use sitemap proxy feature."

[ -z "$OVERRIDE_IDENTITY_PROVIDERS" ] && echo "OVERRIDE_IDENTITY_PROVIDER is not set. Cannot use override identity provider feature."
