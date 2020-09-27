#!/usr/bin/env bash
./devops/docker/login-to-registry.sh
source ./configs/envs/deployment.env

docker pull $IMAGE_NAME
