import {Capabilities, Builder, WebDriver} from 'selenium-webdriver';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildFirefox = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const {headless, requireDriver} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const args: string[] = [];

    if (headless) {
        args.push('--headless');
    }

    const builder = new Builder().forBrowser('firefox');
    const defaultSeleniumCapabilities = builder.getCapabilities();
    const defaultDullahanCapabilities = new Capabilities({
        browser: 'firefox',
        browserName: 'firefox',
        args,
        'moz:firefoxOptions': {
            args
        }
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
