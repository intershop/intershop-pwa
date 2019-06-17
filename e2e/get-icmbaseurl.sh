#!/bin/sh

JQ_QUERY=".[] | select(.type == \"DiscussionNote\") | select(.resolved == false) .body"

getNotes()
{
  notes="$1"
  if which jq >/dev/null
  then
    echo "$notes" | jq -r "$JQ_QUERY"
  else
    docker pull realguess/jq >/dev/null
    docker run --rm realguess/jq sh -c "echo '$notes' | jq -r '$JQ_QUERY'"
  fi
}

for page in `seq 0 100`
do
  notes="$(curl -s --header "PRIVATE-TOKEN: $PRIVATE_API_TOKEN" "https://gitlab.intershop.de/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes?per_page=100&page=$page")"
  [ "$notes" = "[]" ] && break

  parsed="$(echo "$(getNotes "$notes")" | grep 'ICM_BASE_URL' | head -n1 | grep -Eo 'https?:\/\/[^\ ]*')"
  [ ! -z "$parsed" ] && echo "$parsed" && exit 0
done

echo "$ICM_BASE_URL"
