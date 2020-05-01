#!/usr/bin/env bash

set -e

git config --global user.email "google_dev+dullahan@kaartje2go.nl"
git config --global user.name "Dullahan2bot"

git checkout master
git reset --hard "$GITHUB_SHA"

yarn ensure-all
yarn build-code

git status;

set +e
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> .npmrc
yarn lerna publish --yes --conventional-prerelease
publish_results=$?
rm .npmrc
set -e

git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --global user.name "github-actions[bot]"

exit ${publish_results:=0}
