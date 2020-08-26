import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildChrome = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const {headless, requireDriver, userAgent} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const args: string[] = [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        `--user-agent="${userAgent}"`
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
