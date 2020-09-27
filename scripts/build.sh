#!/usr/bin/env bash
baseDir=${PWD}
envFile="$baseDir/configs/envs/development.env"

env-cmd -f $envFile webpack \
  --env.BUILD_ANALYZE=$BUILD_ANALYZE \
  --config ./configs/webpack.config.js \
  --mode production
