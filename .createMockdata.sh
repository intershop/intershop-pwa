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

if ! command -v curl >/dev/null ; then echo "curl is not installed" ; exit 1 ; fi
if ! command -v jq >/dev/null ; then echo "curl is not installed" ; exit 1 ; fi
if ! curl -f "http://localhost:4322/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-" &>/dev/null ; then echo "icm is not running" ; exit 1 ; fi
if ! test -f .createMockdata.table ; then echo "input table does not exist" ; exit 1 ; fi

cat .createMockdata.table | egrep -v '^#' | while read path params jqquery login
do
    test -z "$path" && continue
    test -z "$jqquery" && jqquery="."
    test ! -z "$login" && header="Authorization: BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ=="
    [ "$params" = "?" ] && params=''
    echo "generating ${path}${params} $login-> '$jqquery'"
    mkdir -p src/assets/mock-data/$path
    paramsEncoded=''
    if [ ! -z "$params" ]
    then
        paramsEncoded="$(echo "$params" | sed -e 's/[^a-zA-Z0-9-]/_/g')"
    fi
    echo "  to src/assets/mock-data/$path/get$paramsEncoded.json"
    curl -sf -H "$header" "http://localhost:4322/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/${path}${params}" | jq -S -M "${jqquery}" | sed -e 's%/INTERSHOP/static/.*.jpg%/assets/product_img/a.jpg%' | sed -e 's%inSPIRED-inTRONICS-b2c-responsive:%assets%' > src/assets/mock-data/$path/get$paramsEncoded.json
done
