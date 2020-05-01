import {Builder, WebDriver} from 'selenium-webdriver';

import {DullahanAdapterSelenium3Options} from '../DullahanAdapterSelenium3Options';

export const buildUnknown = async (options: DullahanAdapterSelenium3Options): Promise<WebDriver> => {
    const {browserName} = options;

    const builder = new Builder().forBrowser(browserName);

    builder.withCapabilities(builder.getCapabilities().merge({
        browser: browserName
    }));

    return builder.build();
};
