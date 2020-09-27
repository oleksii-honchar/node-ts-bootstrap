#!/usr/bin/env bash
envFile="./configs/envs/deployment.env"
export $(grep -v '^#' $envFile | xargs)

envFile="./configs/envs/local.env"
export $(grep -v '^#' $envFile | xargs)

source ./devops/local/load-project-env.sh "./project.env"

./devops/docker/check-free-space.sh

docker-compose -f ./configs/docker/docker-compose/local.yml down
docker-compose -f ./configs/docker/docker-compose/local.yml up --build
