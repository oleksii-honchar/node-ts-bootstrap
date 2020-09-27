#!/usr/bin/env bash
set -euo pipefail
source ./devops/utils/console-colors.sh
source ./configs/envs/deployment.env
source ./devops/ci/get-latest-version.sh

start=$SECONDS

# TODO: refactor for AWS
if [[ -n "${IS_CI_RUNNER-}" ]] ; then
    ./devops/local/check-env-vars.sh
    source ./devops/docker/login-to-registry.sh

    docker build -f "./Dockerfile" \
        --build-arg IS_CI_RUNNER \
        --build-arg LINT_SVC \
        --force-rm=true \
        -t="$IMAGE_NAME:$VERSION" .
else
    # local build
    docker build -f "./configs/docker/Dockerfile" \
        --force-rm=true \
        -t="$IMAGE_NAME:$VERSION" \
        -t="$IMAGE_NAME:latest" .
fi

duration=$(( SECONDS - start ))

./devops/docker/cleanup-dungling.sh

printf "${LBLUE}Build time:${NC} ${duration}s \n";
