#!/bin/bash

set -e

[ -z "$1" ] && echo "test file required" && exit 1
files="$(echo "$*" | tr ' ' ',')"

TIMEOUT="20m"
timeout $TIMEOUT node cypress-ci-e2e "$files" || ([ "$?" -eq "124" ] && timeout $TIMEOUT node cypress-ci-e2e "$files") || ([ "$?" -eq "124" ] && timeout $TIMEOUT node cypress-ci-e2e "$files")
