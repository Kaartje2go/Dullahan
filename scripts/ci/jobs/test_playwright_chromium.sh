#!/usr/bin/env bash

set -e

set +e
yarn test-playwright-chromium --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F playwrightchromium
exit ${test_results:=0}
