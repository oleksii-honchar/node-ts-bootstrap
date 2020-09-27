#!/usr/bin/env bash
source ./configs/envs/deployment.env

docker exec -it $CONTAINER_NAME bash
