#!/usr/bin/env bash
envFile="configs/envs/local.env"

source ./devops/local/load-project-env.sh

env-cmd -f $envFile ./scripts/kill-node-zombies.sh
env-cmd -f $envFile devops/local/check-env-vars.sh
env-cmd -f $envFile nodemon --inspect --config ./configs/nodemon.json
