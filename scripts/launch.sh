#!/usr/bin/env bash
envFile="configs/envs/production.env"

debugEnvNames=("local" "development" "qa")

env-cmd -f $envFile devops/local/check-env-vars.sh

if [[ " ${debugEnvNames[@]} " =~ " ${ENV_NAME} " ]]; then
    env-cmd -f $envFile node --inspect=0.0.0.0:9001 ./dist/bundle-with-map.js
else
    env-cmd -f $envFile node ./dist/bundle.js
fi
