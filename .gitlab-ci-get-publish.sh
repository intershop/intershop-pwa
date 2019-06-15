#!/bin/sh

[ -z "$1" ] && echo "instance name required" && exit 1
internalPort="${2:-4200}"

currentPort="$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{(index $conf 0).HostPort}}{{end}}' "$1")"

if [ -z "$currentPort" ]
then
  echo -n '--publish-all'
else
  echo -n "--publish $currentPort:$internalPort"
fi
