#!/usr/bin/env bash

set -e

sudo apt-get install libgbm1

wget -c -nc --retry-connrefused --tries=0 https://msedgedriver.azureedge.net/86.0.620.0/edgedriver_win64.zip
unzip -o -q edgedriver_win64.zip
sudo mv edgedriver C:\\SeleniumWebDrivers\\EdgeDriver
rm edgedriver_win64.zip
