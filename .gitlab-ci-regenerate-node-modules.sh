#!/bin/sh

sleep 5

(test -d cache && echo "cache found") || echo "cache not found"
(test -d node_modules && echo "node_modules found") || npm install --prefer-offline
