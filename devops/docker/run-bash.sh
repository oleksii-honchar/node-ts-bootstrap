#!/usr/bin/env bash
source ./configs/envs/deployment.env

docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
docker run --name $CONTAINER_NAME \
    -p 8080:80 \
    -it $IMAGE_NAME:$VERSION bash
