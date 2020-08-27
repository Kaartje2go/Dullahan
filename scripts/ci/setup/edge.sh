curl.exe -o "C:\SeleniumWebDrivers\EdgeDriver\edgedriver.zip" https://msedgedriver.azureedge.net/86.0.620.0/edgedriver_win64.zip
timeout 5
tar.exe --force-local -xf "C:\SeleniumWebDrivers\EdgeDriver\edgedriver.zip"
