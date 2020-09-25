import {Builder, WebDriver} from 'selenium-webdriver';
import * as deepmerge from 'deepmerge';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildUnknown = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const {browserName, requireDriver, rawCapabilities} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const dullahanCapabilities = deepmerge(
        {
            browser: browserName
        },
        rawCapabilities
    )

    const builder = new Builder().forBrowser(browserName);
    builder.withCapabilities(builder.getCapabilities().merge(dullahanCapabilities));

    return builder.build();
};
