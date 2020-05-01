#!/usr/bin/env bash

set -e

set +e
yarn test-playwright-firefox --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F playwrightfirefox
exit ${test_results:=0}
