#!/usr/bin/env bash

set -e

if [[ -z "${PUPPETEER_PRODUCT}" ]]; then
    export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
fi

git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --global user.name "github-actions[bot]"

git fetch origin +refs/heads/master:refs/remotes/origin/master

echo '--install.frozen-lockfile true' >> .yarnrc
#echo '--install.ignore-optional true' >> .yarnrc
yarn install
