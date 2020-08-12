import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@k2g/dullahan';

export type DullahanAdapterPuppeteerUserOptions = Partial<DullahanAdapterUserOptions & {
    browserName?: 'chrome' | 'firefox';
    emulateDevice?: string;
    executablePath?: string;
    userAgent?: string;
 }>;

export const DullahanAdapterPuppeteerDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    browserName: 'chrome'
};
