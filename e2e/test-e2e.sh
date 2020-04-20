#!/bin/bash

[ -z "$1" ] && echo "test file required" && exit 1
files="$(echo "$*" | tr ' ' ',')"

echo "PWA_BASE_URL is $PWA_BASE_URL"
export PWA_BASE_URL="$(curl -Ls -o /dev/null -w %{url_effective} $PWA_BASE_URL)"
echo "effective PWA_BASE_URL is $PWA_BASE_URL"

wget --wait 10 --tries 10 --retry-connrefused $PWA_BASE_URL

cd "$(dirname "$(readlink -f "$0")")"

while true
do
  timeout 10m node cypress-ci-e2e "$files"
  ret="$?"
  if [ "$ret" -eq "124" ]
  then
    echo "timeout detected"
  else
    exit $ret
  fi
done
