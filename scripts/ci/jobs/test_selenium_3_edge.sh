#!/usr/bin/env bash

set -e

set +e
yarn test-selenium-3-edge --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F selenium3edge
exit ${test_results:=0}
