import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';
import * as Safari from 'selenium-webdriver/safari';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildSafari = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const args: string[] = [];

    const builder = new Builder().forBrowser('safari');

    const defaultSeleniumCapabilities = builder.getCapabilities().merge(new Safari.Options());
    const defaultDullahanCapabilities = new Capabilities({
        browser: 'safari',
        args
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
