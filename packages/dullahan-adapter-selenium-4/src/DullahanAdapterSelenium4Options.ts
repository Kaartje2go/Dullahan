import {DullahanAdapterDefaultOptions, DullahanAdapterUserOptions} from '@k2g/dullahan';

export type DullahanAdapterSelenium4UserOptions = Partial<DullahanAdapterUserOptions & {
    browserName?: 'chrome' | 'firefox' | 'edge' | 'ie' | 'safari';
    requireDriver?: 'chromedriver' | 'geckodriver' | 'iedriver' | '@sitespeed.io/edgedriver' | string;
    browserBinary: string;
    driverBinary: string;
    seleniumRemoteUrl: string;
    rawCapabilities: object;
    maximizeWindow: boolean;
    userAgent?: string;
}>;

export const DullahanAdapterSelenium4DefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    browserName: 'chrome',
    maximizeWindow: true,
    rawCapabilities: {}
};

export type DullahanAdapterSelenium4Options =
    DullahanAdapterSelenium4UserOptions
    & typeof DullahanAdapterSelenium4DefaultOptions;
