#!/bin/sh

git remote | grep bitbucket || git remote add bitbucket ssh://git@bitbucket.intershop.de/is/intershop-pwa.git
git fetch --all

version="$(git log --oneline -1 bitbucket/master | grep -Eo '[0-9]\.[0-9]\.[0-9]')"
[ -z "$version" ] && echo "no release available" && exit 1

git checkout -b "release_$version" bitbucket/master

git -c user.name="Intershop" -c user.email=support@intershop.de tag "RELEASE_$version" -m "Release $version"
git push bitbucket "RELEASE_$version"

git checkout develop
git branch -D "release_$version"