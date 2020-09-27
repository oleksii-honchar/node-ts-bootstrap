#!/usr/bin/env bash
envFile="./configs/envs/deployment.env"
export $(grep -v '^#' $envFile | xargs)

envFile="./configs/envs/development.env"
export $(grep -v '^#' $envFile | xargs)

source ./devops/local/load-project-env.sh "./project.env"

./devops/docker/check-free-space.sh

docker-compose -f ./configs/docker/docker-compose/development.yml down
docker-compose -f ./configs/docker/docker-compose/development.yml up --build