#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # build
  VERSION=$VERSION npm run build

  npm version $VERSION --message "$VERSION"

  # publish
  if [[ $VERSION =~ "beta" ]]
  then
    npm publish --tag beta
  else
    npm publish
  fi

  echo "Publish $VERSION success"

  # sync
  git push origin main
  git push origin refs/tags/v$VERSION
  git checkout dev
  git rebase main
  git push origin dev

  echo "sync success"

  npm run deploy $VERSION

fi
