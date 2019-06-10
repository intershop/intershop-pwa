#!/bin/sh

set -e

curl --request DELETE --data "name_regex=.*$CI_COMMIT_REF_SLUG.*" --header "PRIVATE-TOKEN: $PRIVATE_API_TOKEN" "https://gitlab.intershop.de/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/registry/repositories/51/tags"
