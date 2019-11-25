#!/bin/bash

# This script creates mock-data under src/assets/mock-data using the definitions in .createMockdata.table.
# It uses curl for querying the REST API and jq to format and filter the output.
# If defined, a the login information for patricia.miller will be sent via header.
#
# Depends on:
# - curl: commandline http client.
# - jq: commandline json editor.
# - a running ICM instance with inSPIRED Storefront and HTTP port open on 4322.

set -e
set -o pipefail

trap '[ "$?" -eq "0" ] && echo SUCCESSFUL || echo FAILED' EXIT

if ! command -v curl >/dev/null ; then echo "curl is not installed" ; exit 1 ; fi
if ! command -v jq >/dev/null ; then echo "jq is not installed" ; exit 1 ; fi
if ! curl -f "http://10.0.206.226:4322/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/rest" &>/dev/null ; then echo "icm is not running" ; exit 1 ; fi
if ! test -f .createMockdata.table ; then echo "input table does not exist" ; exit 1 ; fi

cat .createMockdata.table | egrep -v '^#' | while read path params jqquery header
do
    test -z "$path" && continue
    test -z "$jqquery" && jqquery="."
    [ "$params" = "?" ] && params=''
    echo "generating ${path}${params} '$header'-> '$jqquery'"
    mkdir -p src/assets/mock-data/$path

    echo "  to src/assets/mock-data/$path/get.json"
    curl -sf -H "$header" "http://10.0.206.226:4322/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/rest/${path}${params}" | jq -S -M "${jqquery}" | sed -e 's%/INTERSHOP/static/.*.jpg%assets/img/not_available.png%' > src/assets/mock-data/$path/get.json
done
