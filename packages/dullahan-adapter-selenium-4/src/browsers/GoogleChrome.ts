import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';
import * as deepmerge from 'deepmerge';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildChrome = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const {headless, requireDriver, userAgent, rawCapabilities} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const args: string[] = [
        '--disable-dev-shm-usage',
        '--no-sandbox'
    ];

    if (userAgent) {
        args.push(`--user-agent="${userAgent}"`);
    }

    if (headless) {
        args.push('--headless');
    }

    const dullahanCapabilities = deepmerge(
        {
            browser: 'chrome',
            args,
            'goog:chromeOptions': {
                args
            }
        },
        rawCapabilities
    )

    const builder = new Builder().forBrowser('chrome');
    const defaultSeleniumCapabilities = builder.getCapabilities();
    const defaultDullahanCapabilities = new Capabilities(dullahanCapabilities);
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
