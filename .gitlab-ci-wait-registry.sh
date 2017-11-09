#!/bin/sh

while ! ping -q -c 1 "$CI_REGISTRY"
do
  sleep 2
done
