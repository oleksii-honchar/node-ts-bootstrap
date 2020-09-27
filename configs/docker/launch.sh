#!/usr/bin/env bash
set -e

cd /usr/src/svc-application

echo "ENV_NAME=${ENV_NAME}"
if [[ -z "${ENV_NAME+x}" ]] ; then
    echo 'env is not defined -> production'
    export ENV_NAME="production"
fi

echo "ENV_NAME=${ENV_NAME}"

if [[ "$ENV_NAME" == "local" ]]; then
    npm run launch:loc
elif [[ "$ENV_NAME" == "development" ]]; then
    npm run launch:dev
elif [[ "$ENV_NAME" == "qa" ]]; then
    npm run launch:qa
else
    npm run launch
fi

# for debug only
#while :; do echo 'Hit CTRL+C'; sleep 1; done