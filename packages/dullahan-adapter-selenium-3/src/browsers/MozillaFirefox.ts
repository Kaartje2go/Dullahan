import {Capabilities, Builder, WebDriver} from 'selenium-webdriver';

import {DullahanAdapterSelenium3Options} from '../DullahanAdapterSelenium3Options';

export const buildFirefox = async (options: DullahanAdapterSelenium3Options): Promise<WebDriver> => {
    const {headless, requireDriver, userAgent} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const args: string[] = [];

    if (headless) {
        args.push('--headless');
    }

    const builder = new Builder().forBrowser('firefox');

    const prefs = userAgent ? {
        'general.useragent.override': userAgent
    } : {};

    const defaultSeleniumCapabilities = builder.getCapabilities();
    const defaultDullahanCapabilities = new Capabilities({
        browser: 'firefox',
        browserName: 'firefox',
        args,
        'moz:firefoxOptions': {
            args,
            prefs
        }
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
