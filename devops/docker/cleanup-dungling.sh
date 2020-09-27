#!/bin/bash

source ./devops/utils/console-colors.sh

printf "${LBLUE}Removing dangling images...${NC}\n"
docker images -f "dangling=true" -q | xargs docker rmi

printf "${GREEN}Done${NC}\n"