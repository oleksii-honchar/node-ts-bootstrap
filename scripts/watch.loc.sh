#!/usr/bin/env bash
envFile="configs/envs/local.env"

env-cmd -f $envFile ./scripts/kill-node-zombies.sh
env-cmd -f $envFile webpack --config ./configs/webpack.config.js --mode development --watch --progress
