global.dullahanApiName = '@k2g/dullahan';
global.dullahanApiOptions = {};
global.dullahanAdapterName = '@k2g/dullahan-adapter-selenium-4';
global.dullahanAdapterOptions = {
    headless: true,
    maximizeWindow: true,
    browserName: 'firefox',
    requireDriver: process.env.CI ? undefined : 'geckodriver'
};
