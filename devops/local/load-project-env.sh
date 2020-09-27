#!/usr/bin/env bash

BLUE='\033[0;34m'
LBLUE='\033[1;36m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

if [ -z "${1}" ]
then
  filePath="project.env"
else
  filePath=${1}
fi

if [ -f $filePath ]; then
    printf "Gonna load '${filePath}' file ";
    source $filePath && \
    export $(grep -o '^[^#]*' $filePath);

    if [ $? -eq 0 ]; then
        printf "${GREEN}[Ok]${NC}\n";
    else
        printf "${RED}[Error]${NC}\n";
        exit 1;
    fi
else
    printf "${RED}No project.env file found in: ${NC}$PWD $filePath\n"
    exit 1;
fi
