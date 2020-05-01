#!/usr/bin/env bash

set -e

set +e
yarn test-selenium-3-safari --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F selenium3safari
exit ${test_results:=0}
