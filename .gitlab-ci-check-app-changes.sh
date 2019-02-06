#!/bin/sh

set -e

CHANGES_REGEX='(^src|^[^/]*$)'
[ ! -z "$1" ] && CHANGES_REGEX="$1"

git diff --name-only "$(git merge-base HEAD origin/develop)" HEAD | grep -qE "$CHANGES_REGEX"
