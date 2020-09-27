#!/usr/bin/env bash
currDir="$(dirname "$0")"
mkdir -p tmp
mkdir -p src/src/assets/swagger-editor

cd tmp
if [ ! -d "swagger-editor" ]; then
  git clone https://github.com/swagger-api/swagger-editor.git
fi

cp -r swagger-editor/dist/ ../src/src/assets/swagger-editor