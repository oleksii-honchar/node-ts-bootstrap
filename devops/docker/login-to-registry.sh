#!/bin/bash
source ./devops/utils/console-colors.sh

source ./configs/envs/deployment.env

printf "${LBLUE}Login to registry:${NC} ${DOCKER_REGISTRY_HOST}\n"
docker login -u="$DOCKER_REGISTRY_USER" -p="$DOCKER_REGISTRY_PWD" $DOCKER_REGISTRY_HOST
printf "${LBLUE}Login to registry finished${NC}\n"
