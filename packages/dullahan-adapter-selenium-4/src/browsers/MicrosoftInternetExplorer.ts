import {Builder, Capabilities, WebDriver} from 'selenium-webdriver';
import * as Ie from 'selenium-webdriver/ie';

import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';

export const buildInternetExplorer = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
    const {requireDriver} = options;

    if (requireDriver) {
        require(requireDriver);
    }

    const args: string[] = [];

    const builder = new Builder().forBrowser('ie');

    const defaultSeleniumCapabilities = builder.getCapabilities().merge(new Ie.Options().ignoreZoomSetting(true));
    const defaultDullahanCapabilities = new Capabilities({
        browser: 'ie',
        args
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return builder.withCapabilities(capabilities).build();
};
