#!/bin/bash

set -e
set -o pipefail

git status --porcelain | wc -l | xargs test '0' -eq || ( (>&2 echo "there are local changes -- $1:") ; git diff ; exit 1)
