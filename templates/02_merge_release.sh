#!/bin/sh

set -v
set -e

git fetch --all
version="$(git log --oneline -1 origin/develop | grep -Eo '[0-9]*\.[0-9]*\.[0-9]*')"
[ -z "$version" ] && echo "no release prepared" && exit 1
git checkout master
git reset --hard origin/master
#git clean -xdf -e '*environment*' -e '*tslint-rules*' -e '*src/schematics*'
git merge -m "Merge branch 'develop' into 'master' for $version release" origin/develop
git push
git tag -a "RELEASE_$version" -m "Release $version" && git push --tags || true

git remote | grep bitbucket || git remote add bitbucket ssh://git@bitbucket.intershop.de/is/intershop-pwa.git
git fetch --all

git checkout -b "release_$version" bitbucket/master
git merge -s subtree --no-commit --allow-unrelated-histories --squash origin/master || git merge -s subtree --no-commit --squash origin/master
git reset HEAD -- settings.gradle gradle gradlew build.gradle
git checkout -- settings.gradle gradle gradlew build.gradle
git -c user.name="Intershop" -c user.email=support@intershop.de commit --message="Release $version"
git push --set-upstream bitbucket "release_$version"
git checkout develop
git branch -D "release_$version"

echo "click on the merge request link above!"
