import {Capabilities, WebDriver} from 'selenium-webdriver';
import * as Edge from 'selenium-webdriver/edge';

import {DullahanAdapterSelenium3Options} from '../DullahanAdapterSelenium3Options';

import {buildUnknown} from './Unknown';

export const buildEdgeClassic = buildUnknown;

export const buildEdgeChromium = async (options: DullahanAdapterSelenium3Options): Promise<WebDriver> => {
    const {
        headless,
        requireDriver,
        browserBinary = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        driverBinary = requireDriver && require(requireDriver)?.binPath?.()
    } = options;

    const args: string[] = [
        '--disable-dev-shm-usage',
        '--no-sandbox'
    ];

    if (headless) {
        args.push('--headless');
    }

    const service = new Edge.ServiceBuilder(driverBinary).build();
    const defaultSeleniumCapabilities = new Edge.Options().toCapabilities();
    const defaultDullahanCapabilities = new Capabilities({
        'ms:edgeOptions': {
            binary: browserBinary,
            args
        }
    });
    const capabilities = defaultSeleniumCapabilities.merge(defaultDullahanCapabilities);

    return Edge.Driver.createSession(capabilities, service);
};
