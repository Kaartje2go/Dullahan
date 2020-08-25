import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@k2g/dullahan';

export type DullahanAdapterPuppeteerUserOptions = Partial<DullahanAdapterUserOptions & {
    args?: string[];
    browserName?: 'chrome' | 'firefox';
    devtools?: boolean;
    emulateDevice?: string;
    executablePath?: string;
    rawOptions: Record<string, unknown>;
    userAgent?: string;
 }>;

export const DullahanAdapterPuppeteerDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    args: [],
    browserName: 'chrome',
    devTools: false,
    rawOptions: {}
};
