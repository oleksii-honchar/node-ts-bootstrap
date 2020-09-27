#!/usr/bin/env bash
set -e

source ./devops/utils/console-colors.sh

if [[ -n "${IS_CI_RUNNER-}" ]] ; then
    echo 'skip loading project.env'
else
    source ./devops/local/load-project-env.sh
fi

source ./configs/envs/deployment.env
source ./devops/ci/get-latest-version.sh

source ./devops/docker/login-to-registry.sh
docker push $IMAGE_NAME:$VERSION
