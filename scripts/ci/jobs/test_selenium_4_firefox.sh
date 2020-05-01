#!/usr/bin/env bash

set -e

set +e
yarn test-selenium-4-firefox --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F selenium4firefox
exit ${test_results:=0}
