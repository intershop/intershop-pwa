#!/bin/sh

set -e

# https://docs.gitlab.com/ee/api/merge_requests.html#list-mr-pipelines
# https://docs.gitlab.com/ee/api/pipelines.html#cancel-a-pipelines-jobs

curl -s --header "PRIVATE-TOKEN: $PRIVATE_API_TOKEN" https://gitlab.intershop.de/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/pipelines | jq '.[] | select( .status | contains("running")) | .id' | tail -n +2 | xargs -r -I{} curl --request POST --header "PRIVATE-TOKEN: $PRIVATE_API_TOKEN" https://gitlab.intershop.de/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/pipelines/{}/cancel
