#!/bin/sh

set -eu

image=${1:?Usage: brotli-cache.sh NGINX_IMAGE}
network=
upstream=
proxy=

cleanup() {
  if [ -n "$proxy" ]; then
    docker rm -f "$proxy" >/dev/null
  fi
  if [ -n "$upstream" ]; then
    docker rm -f "$upstream" >/dev/null
  fi
  if [ -n "$network" ]; then
    docker network rm "$network" >/dev/null
  fi
}
trap cleanup EXIT

network=$(docker network create "pwa-brotli-test-$$")
upstream=$(docker run -d --network "$network" --network-alias upstream --entrypoint sh nginx:mainline -c '
  printf "%s\n" "server { listen 80; default_type text/html; location / { root /usr/share/nginx/html; try_files /index.html =404; } }" > /etc/nginx/conf.d/default.conf
  head -c 262144 /dev/zero | tr "\000" x > /usr/share/nginx/html/index.html
  exec nginx -g "daemon off;"
')
proxy=$(docker run -d --network "$network" \
  -e UPSTREAM_PWA=http://upstream:80 \
  -e CACHE=1 -e CACHE_CLEARER=0 -e COMPRESSION=1 \
  -e NGINX_WORKER_PROCESSES=1 -e NGINX_ENTRYPOINT_QUIET_LOGS=1 "$image")

docker exec "$proxy" curl -fsS --retry 20 --retry-connrefused --retry-delay 1 --max-time 2 \
  -H 'Host: localhost' -o /dev/null http://127.0.0.1/

for cache_status in MISS HIT; do
  docker exec "$proxy" sh -ec '
    curl -fsS --compressed -D /tmp/brotli-test-headers -o /tmp/brotli-test-body \
      -H "Host: localhost" -H "Accept-Encoding: br" http://127.0.0.1/brotli-regression
    grep -iq "^Content-Encoding: br[[:space:]]*$" /tmp/brotli-test-headers
    grep -iq "^X-Cache-Status: $1[[:space:]]*$" /tmp/brotli-test-headers
    [ "$(wc -c < /tmp/brotli-test-body)" -eq 262144 ]
    [ "$(tr -d x < /tmp/brotli-test-body | wc -c)" -eq 0 ]
  ' sh "$cache_status" || {
    docker logs "$proxy" 2>&1
    exit 1
  }
done

if docker logs "$proxy" 2>&1 | grep -q 'exited on signal 11'; then
  echo 'NGINX worker crashed while serving Brotli responses' >&2
  exit 1
fi

echo 'Brotli compression with proxy cache: passed'
