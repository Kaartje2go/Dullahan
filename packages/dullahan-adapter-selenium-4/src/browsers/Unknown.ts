import {Builder, WebDriver} from 'selenium-webdriver';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildUnknown = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const {browserName, requireDriver} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const builder = new Builder().forBrowser(browserName);

    builder.withCapabilities(builder.getCapabilities().merge({
        browser: browserName
    }));

    return builder.build();
};
