import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';

import {DullahanAdapterSelenium3Options} from '../DullahanAdapterSelenium3Options';

export const buildChrome = async (options: DullahanAdapterSelenium3Options): Promise<WebDriver> => {
    const {headless, requireDriver} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const args: string[] = [
        '--disable-dev-shm-usage',
        '--no-sandbox'
    ];

    if (headless) {
        args.push('--headless');
    }

    const builder = new Builder().forBrowser('chrome');

    const defaultSeleniumCapabilities = builder.getCapabilities();
    const defaultDullahanCapabilities = new Capabilities({
        browser: 'chrome',
        args,
        'goog:chromeOptions': {
            args
        }
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
