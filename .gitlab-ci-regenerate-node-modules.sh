#!/bin/sh

sleep 5

test -d node_modules || npm install --prefer-offline
