#!/bin/bash

set -e

[ -z "$1" ] && echo "test file required" && exit 1

timeout 7m node cypress-ci-e2e "$1" || ([ "$?" -eq "124" ] && timeout 7m node cypress-ci-e2e "$1") || ([ "$?" -eq "124" ] && timeout 7m node cypress-ci-e2e "$1")
