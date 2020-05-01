#!/usr/bin/env bash

set -e

set +e
yarn test-playwright-webkit --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F playwrightwebkit
exit ${test_results:=0}
