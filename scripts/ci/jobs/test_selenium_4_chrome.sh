#!/usr/bin/env bash

set -e

set +e
yarn test-selenium-4-chrome --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F selenium4chrome
exit ${test_results:=0}
