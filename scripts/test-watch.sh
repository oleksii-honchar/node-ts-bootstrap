#!/usr/bin/env bash
envFile="configs/envs/test.env"

source ./devops/local/load-project-env.sh

env-cmd -f $envFile ./scripts/kill-node-zombies.sh
env-cmd -f $envFile devops/local/check-env-vars.sh
env-cmd -f $envFile npx jest --watch --runInBand --detectOpenHandles -c ./configs/jest.config.js
