#!/usr/bin/env bash

#For zombie process problem, auto kill previous svc process / this solution is cross platform
node -e "process.exit(0) || process.exit(1)" && echo "Killing on port: $SVC_PORT" && npx cross-port-killer $SVC_PORT
