import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@k2g/dullahan';

export type DullahanAdapterPuppeteerUserOptions = Partial<DullahanAdapterUserOptions & {
    browserName?: 'chrome' | 'firefox';
 }>;

export const DullahanAdapterPuppeteerDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    browserName: 'chrome'
};
