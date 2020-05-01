#!/usr/bin/env bash

set -e

sudo apt-get install libgbm1

chrome_version=$(google-chrome --version | cut -f 3 -d ' ' | cut -d '.' -f 1)
package_version=$(curl --location --fail --retry 10 http://chromedriver.storage.googleapis.com/LATEST_RELEASE_${chrome_version})

wget -c -nc --retry-connrefused --tries=0 https://chromedriver.storage.googleapis.com/${package_version}/chromedriver_linux64.zip
unzip -o -q chromedriver_linux64.zip
sudo mv chromedriver /usr/local/bin/chromedriver
rm chromedriver_linux64.zip
