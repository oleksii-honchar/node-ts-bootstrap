#!/usr/bin/env bash
currDir="$(dirname "$0")"
mkdir -p tmp
mkdir -p src/src/assets/docs

cd tmp
if [ ! -d "swagger-ui" ]; then
  git clone https://github.com/swagger-api/swagger-ui.git
fi

cp -r swagger-ui/dist/ ../src/src/assets/docs
#sudo rm -rf tmp