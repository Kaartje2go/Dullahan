import {DullahanPluginDefaultOptions, DullahanPluginUserOptions} from '@k2g/dullahan';

export type DullahanPluginBrowserstackUserOptions = Partial<DullahanPluginUserOptions & {
    accessKey: string;
    username: string;

    useLocal: boolean;
    removeFailedAfterRetrySuccess: boolean;

    localOptions: {
        verbose: boolean;
        force: boolean;
        only: string;
        onlyAutomate: boolean;
        forceLocal: boolean;
        localIdentifier: string;
        folder: string;
        proxyHost: string;
        proxyPort: string;
        proxyUser: string;
        proxyPass: string;
        forceProxy: boolean;
        logFile: string;
        parallelRuns: string;
        binarypath: string;
    };
}>;

export const DullahanPluginBrowserstackDefaultOptions = {
    ...DullahanPluginDefaultOptions,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    username: process.env.BROWSERSTACK_USERNAME,

    useLocal: false,
    removeFailedAfterRetrySuccess: true,

    localOptions: {}
};

export type DullahanPluginBrowserstackOptions =
    DullahanPluginBrowserstackUserOptions
    & typeof DullahanPluginBrowserstackDefaultOptions;
