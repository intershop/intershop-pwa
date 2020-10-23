#!/bin/sh

[ -z "$1" ] && echo "instance name required" && exit 1

currentPort=`docker inspect --format="{{(index (index .NetworkSettings.Ports \"${2:-4200}/tcp\") 0).HostPort}}" "$1"`

if [ -z "$currentPort" ]
then
  echo -n '--publish-all'
else
  echo -n "--publish $currentPort:${2:-4200}"
fi
