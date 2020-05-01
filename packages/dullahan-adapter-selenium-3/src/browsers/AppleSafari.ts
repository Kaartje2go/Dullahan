import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';
import * as Safari from 'selenium-webdriver/safari';

import {DullahanAdapterSelenium3Options} from '../DullahanAdapterSelenium3Options';

export const buildSafari = async (options: DullahanAdapterSelenium3Options): Promise<WebDriver> => {
    const args: string[] = [];

    const builder = new Builder().forBrowser('safari');

    const defaultSeleniumCapabilities = builder.getCapabilities().merge(new Safari.Options().setCleanSession(true).
        toCapabilities());
    const defaultDullahanCapabilities = new Capabilities({
        browser: 'safari',
        args
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
