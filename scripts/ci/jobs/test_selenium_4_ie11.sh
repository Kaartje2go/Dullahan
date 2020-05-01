#!/usr/bin/env bash

set -e

set +e
yarn test-selenium-4-ie11 --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F selenium4ie11
exit ${test_results:=0}
