#!/usr/bin/env bash

source ./devops/utils/console-colors.sh

function checkVar () {
    printf "$1 ";

    eval value='$'$1

    if [ -z "$value" ]
    then
        printf "${RED}[NOT FOUND]${NC}\n";
        return 1
    else
        printf "${GREEN}[OK]${NC}\n";
        return 0
    fi
}

printf "${LBLUE}Gonna check env vars...${NC}\n";

checkVar ENV_NAME
checkVar LOG_LEVEL
checkVar NODE_ENV
checkVar SVC_PORT
checkVar SVC_DEBUG_PORT
checkVar SVC_MOUNT_POINT
checkVar SVC_RATE_LIMIT_WINDOW_MINUTES
checkVar SVC_RATE_LIMIT_MAX_REQUESTS
checkVar JWT_TTL_SECONDS
checkVar SVC_POSTGRES_PASSWORD
checkVar SVC_SECRET_KEY
checkVar SVC_POSTGRES_HOST
checkVar SVC_POSTGRES_PORT
checkVar SVC_POSTGRES_DB
checkVar SVC_MAILER_HOST
checkVar SVC_MAILER_PORT
checkVar SVC_MAILER_ACCOUNT_USER
checkVar SVC_MAILER_ACCOUNT_PASSWORD

printf "${LBLUE}Check completed${NC}\n";
