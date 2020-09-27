#!/bin/bash
source ./devops/utils/console-colors.sh

printf "${LBLUE}Removing exited docker containers...${NC}\n"
docker ps -a -q -f status=exited | xargs docker rm -v

printf "${LBLUE}Removing dangling images...${NC}\n"
docker images -f "dangling=true" -q | xargs docker rmi

printf "${LBLUE}Removing unused images...${NC}\n"
docker images -q |xargs docker rmi

printf "${LBLUE}Removing volumes...${NC}\n"
docker volume ls -q |xargs docker volume rm

printf "${GREEN}Done${NC}\n"