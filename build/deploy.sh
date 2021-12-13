#!/bin/bash

# abort on errors
set -e

if [[ -z $1 ]]; then
  MESSAGE="deploy"
else
  MESSAGE=$1
fi

echo "Deploying $MESSAGE ..."

# build
npm run docs:build

# navigate into the build output directory
cd docs/dist

git init --initial-branch=main
git add -A
git commit -m "$MESSAGE"

git push -f git@github.com:mengxiong10/vue-datepicker-next.git main:gh-pages

cd -
