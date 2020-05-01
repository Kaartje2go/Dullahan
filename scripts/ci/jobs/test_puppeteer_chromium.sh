#!/usr/bin/env bash

set -e

set +e
yarn test-puppeteer-chromium --coverage --runInBand --forceExit
test_results=$?
set -e

yarn codecov -F puppeteerchromium
exit ${test_results:=0}
