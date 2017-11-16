set -e
set -x

IMAGE="${CI_REGISTRY}/${CI_PROJECT_PATH}-prod:${CI_BUILD_REF}"
SERVICE="poc"

if ! docker service ps poc ; then
  docker service create -d --replicas $SERVICE_REPLICAS --publish mode=host,target=4000,published=4321 --name $SERVICE --env ICM_BASE_URL=$ICM_BASE_URL $IMAGE
fi

docker service update -d --image $IMAGE --env-add ICM_BASE_URL=$ICM_BASE_URL --force --replicas $SERVICE_REPLICAS $SERVICE

echo "successfully deployed service with image $IMAGE"
