#!/bin/bash

set -e

[ -z "$1" ] && echo "test file required" && exit 1
files="$(echo "$*" | tr ' ' ',')"

export CYPRESS_NO_CHANNEL_REDIRECT=1

echo "PWA_BASE_URL is $PWA_BASE_URL"
export PWA_BASE_URL="$(curl -Ls -o /dev/null -w %{url_effective} $PWA_BASE_URL)"
echo "effective PWA_BASE_URL is $PWA_BASE_URL"

wget --wait 10 --tries 10 --retry-connrefused $PWA_BASE_URL

cd "$(dirname "$(readlink -f "$0")")"

TIMEOUT="20m"
timeout $TIMEOUT node cypress-ci-e2e "$files" || ([ "$?" -eq "124" ] && timeout $TIMEOUT node cypress-ci-e2e "$files") || ([ "$?" -eq "124" ] && timeout $TIMEOUT node cypress-ci-e2e "$files")
