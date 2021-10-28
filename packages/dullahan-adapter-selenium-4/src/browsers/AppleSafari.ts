import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';
import * as Safari from 'selenium-webdriver/safari';
import * as deepmerge from 'deepmerge';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildSafari = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const { rawCapabilities } = options;
    const args: string[] = [];

    const dullahanCapabilities = deepmerge(
        {
            browser: 'safari',
            args
        },
        rawCapabilities
    )

    const builder = new Builder().forBrowser('safari');
    const defaultSeleniumCapabilities = builder.getCapabilities().merge(new Safari.Options());
    const defaultDullahanCapabilities = new Capabilities(dullahanCapabilities);
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
