#!/bin/sh

set -e

git diff --name-only "$(git merge-base HEAD origin/develop)" HEAD | grep -qE '(^src|^[^/]*$)'
