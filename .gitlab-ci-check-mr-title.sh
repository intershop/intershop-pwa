#!/bin/sh

set -e

response="$(curl -s --header "PRIVATE-TOKEN: $PRIVATE_API_TOKEN" https://gitlab.intershop.de/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID)"
title="$(echo "$response" | jq -Mrc .title)"

topic="$(echo "$title" | sed -e 's/^WIP: //' | grep -Eo '^[^:]*')"

echo "title='$title'"
echo "topic='$topic'"

case "$topic" in
  feat) ;;
  fix) ;;
  perf) ;;
  docs) ;;
  style) ;;
  refactor) ;;
  revert) ;;
  test) ;;
  chore) ;;
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

ticket="$(echo "$title" | grep -Eoi 'IS(REST|)-[0-9]*' || true)"
echo "ticket='$ticket'"
[ -z "$ticket" ] && exit 0

echo "$ticket" | grep -Eq 'ISREST-[0-9]*' || (echo "'$ticket' is not in caps or not a PWA ticket" && exit 1)

echo "$title" | grep -Eq "\($ticket\)$" || (echo "'$ticket' must be in parentheses at the end of the first line of the topic" && exit 1)
