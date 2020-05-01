import {Capabilities, WebDriver} from 'selenium-webdriver';
import * as Edge from 'selenium-webdriver/edge';
import {DullahanAdapterSelenium4Options} from '../DullahanAdapterSelenium4Options';
import {sep} from 'path';
import {buildUnknown} from './Unknown';

export const buildEdgeClassic = buildUnknown;

export const buildEdgeChromium = async (options: DullahanAdapterSelenium4Options): Promise<WebDriver> => {
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

    process.env.PATH = process.env.EdgeWebDriver + sep + process.env.PATH;
    console.log('driverBinary', driverBinary);
    console.log('process.env.EdgeWebDriver', process.env.EdgeWebDriver);
    console.log('process.env.PATH', process.env.PATH);

    const service = new Edge.ServiceBuilder().build();
    const defaultSeleniumCapabilities = new Edge.Options();
    const defaultDullahanCapabilities = new Capabilities({
        'ms:edgeOptions': {
            binary: browserBinary,
            args
        }
    });
    const capabilities = new Capabilities({}).merge(defaultSeleniumCapabilities).merge(defaultDullahanCapabilities);

    return Edge.Driver.createSession(capabilities, service);
};
