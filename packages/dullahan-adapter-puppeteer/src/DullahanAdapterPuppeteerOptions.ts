import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@k2g/dullahan';

export type DullahanAdapterPuppeteerUserOptions = Partial<DullahanAdapterUserOptions & {
    args?: string[];
    browserName?: 'chrome' | 'firefox';
    devtools?: boolean;
    emulateDevice?: string;
    useTouch?: boolean;
    executablePath?: string;
    rawOptions: Record<string, unknown>;
    userAgent?: string;
    har?: boolean;
 }>;

export const DullahanAdapterPuppeteerDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    args: [],
    browserName: 'chrome',
    devTools: false,
    useTouch: false,
    rawOptions: {}
};
