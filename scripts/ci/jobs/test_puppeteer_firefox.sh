#!/usr/bin/env bash

set -e

set +e
yarn test-puppeteer-firefox --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F puppeteerfirefox
exit ${test_results:=0}
