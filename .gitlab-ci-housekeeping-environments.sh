#!/bin/sh

set -e

curl -s --header "PRIVATE-TOKEN:$PRIVATE_API_TOKEN" "https://gitlab.intershop.de/api/v4/projects/$CI_PROJECT_ID/environments?per_page=100" | jq -r '.[] | "\(.id) \(.external_url)"' | while read id url
do
  if curl -fsLk $url &>/dev/null
  then
    echo "live: $url"
  elif [ "$url" = "null" ]
  then
    echo "unknown state of $id $url"
    curl --header "PRIVATE-TOKEN:$PRIVATE_API_TOKEN" "https://gitlab.intershop.de/api/v4/projects/$CI_PROJECT_ID/environments/$id" | jq '.'
  else
    echo "down: $url"
    curl -s --request DELETE --header "PRIVATE-TOKEN:$PRIVATE_API_TOKEN" "https://gitlab.intershop.de/api/v4/projects/$CI_PROJECT_ID/environments/$id"
  fi
done
