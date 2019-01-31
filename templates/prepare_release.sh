#!/bin/sh

RELEASE="$1"
[ -z "$1" ] && RELEASE="minor"

set -v
set -e

git fetch --all
git checkout master
git reset --hard origin/master
git clean -xdf -e '*environment*'
npm ci
git merge -m dummy origin/develop
tagged="$(npm version "$RELEASE")"
version="$(echo "$tagged" | cut -c2-)"
git reset --soft HEAD^
git tag -d "$tagged"
npm run 3rd-party-licenses
npm run changelog
git stash --all
git reset --hard origin/master
git checkout -b "chore/release_$version" origin/develop
git stash pop
git commit -a -m "chore: release $version preparation"
