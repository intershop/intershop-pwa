set -x
set -e

IMAGE="${CI_REGISTRY}/${CI_PROJECT_PATH_SLUG}-prod:${CI_BUILD_REF}"
SERVICE="intershop-pwa"

if ! docker service ps $SERVICE ; then
  docker service create -d \
      --replicas $SERVICE_REPLICAS \
      --publish mode=host,target=4000,published=4321 \
      --name $SERVICE \
      --env ICM_BASE_URL=$ICM_BASE_URL \
      --env LOGGING=true \
      $IMAGE
else
  docker service update -d \
      --image $IMAGE \
      --env-add ICM_BASE_URL=$ICM_BASE_URL \
      --env-add LOGGING=true \
      --force \
      --replicas $SERVICE_REPLICAS \
      --update-delay 0s \
      --update-parallelism 0 \
      --update-order stop-first \
      --update-failure-action continue \
      $SERVICE

fi

set +x
echo "successfully deployed service with image $IMAGE"
