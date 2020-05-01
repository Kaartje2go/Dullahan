global.dullahanApiName = '@kaartje2go/temp-dullahan';
global.dullahanApiOptions = {};
global.dullahanAdapterName = '@kaartje2go/temp-dullahan-adapter-selenium-4';
global.dullahanAdapterOptions = {
    headless: true,
    maximizeWindow: true,
    browserName: 'chrome',
    requireDriver: process.env.CI ? undefined : 'chromedriver',
    args: [
        '--disable-dev-shm-usage',
        '--no-sandbox'
    ]
};
