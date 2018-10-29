#!/bin/bash

set -e
set -o pipefail

git status --porcelain | wc -l | xargs test '0' -eq || (echo "there are local changes -- $1:" ; git status --porcelain ; exit 1)
