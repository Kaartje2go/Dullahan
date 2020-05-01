#!/usr/bin/env bash

set -e

yarn commitlint --from=$(git log -n 1 origin/master --pretty=format:"%H")
