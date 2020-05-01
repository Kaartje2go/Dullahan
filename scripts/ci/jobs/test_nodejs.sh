#!/usr/bin/env bash

set -e

set +e
yarn test-nodejs --coverage
test_results=$?
set -e

yarn codecov -F nodejs
exit ${test_results:=0}
