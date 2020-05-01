global.dullahanApiName = '@k2g/dullahan';
global.dullahanApiOptions = {};
global.dullahanAdapterName = '@k2g/dullahan-adapter-selenium-3';
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
