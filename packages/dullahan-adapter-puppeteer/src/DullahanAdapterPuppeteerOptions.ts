import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@kaartje2go/temp-dullahan';

export type DullahanAdapterPuppeteerUserOptions = Partial<DullahanAdapterUserOptions & {
    browserName?: 'chrome' | 'firefox';
 }>;

export const DullahanAdapterPuppeteerDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    browserName: 'chrome'
};
