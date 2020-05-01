global.dullahanApiName = '@kaartje2go/temp-dullahan';
global.dullahanApiOptions = {};
global.dullahanAdapterName = '@kaartje2go/temp-dullahan-adapter-selenium-3';
global.dullahanAdapterOptions = {
    headless: true,
    maximizeWindow: true,
    browserName: 'firefox',
    requireDriver: process.env.CI ? undefined : 'geckodriver'
};
