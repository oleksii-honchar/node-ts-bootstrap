#!/usr/bin/env bash
envFile="configs/envs/qa.env"

npx env-cmd -f $envFile ./scripts/kill-node-zombies.sh
npx env-cmd -f $envFile devops/local/check-env-vars.sh
npx env-cmd -f $envFile node dist/bundle.js
