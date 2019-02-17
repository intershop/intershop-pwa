#!/bin/sh

set -e

response="$(curl -s --header "PRIVATE-TOKEN: TR5wGFtNSyQX7dZxsRsA" https://gitlab.intershop.de/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID)"
title="$(echo "$response" | grep -Eo 'title":"[^"]+' | cut -c9-)"

topic="$(echo "$title" | grep -Eo '^[^:]*')"

echo "title='$title'"
echo "topic='$topic'"

case "$topic" in
  WIP) exit 0 ;;
  feat) exit 0 ;;
  fix) exit 0 ;;
  perf) exit 0 ;;
  docs) exit 0 ;;
  style) exit 0 ;;
  refactor) exit 0 ;;
  revert) exit 0 ;;
  test) exit 0 ;;
  chore) exit 0 ;;
  *)
    cat <<EOF

The Merge Request title must begin with a valid topic of feat, fix, perf, docs, style, refactor, revert, test or chore.

please adjust the title to match the following pattern:

  <topic>: <description for changelog> (<ticket if available>)

Afterwards retry this job.

EOF

    exit 1
    ;;
esac
