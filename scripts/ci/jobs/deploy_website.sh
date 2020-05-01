#!/usr/bin/env bash

set -e

git checkout master
git reset --hard "$GITHUB_SHA"

source scripts/ci/jobs/build_website.sh

git add website/build/Dullahan --force
git commit -anm "release(website): deployment for $GITHUB_SHA --skip-ci"
git push origin $(git subtree split --prefix website/build/Dullahan master):gh-pages --force
