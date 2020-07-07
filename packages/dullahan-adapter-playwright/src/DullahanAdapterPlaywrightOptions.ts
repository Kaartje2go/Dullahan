import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@k2g/dullahan';

export type DullahanAdapterPlaywrightUserOptions = Partial<DullahanAdapterUserOptions & {
    browserName?: 'chromium' | 'firefox' | 'webkit';
    emulateDevice?: string;
 }>;

export const DullahanAdapterPlaywrightDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    browserName: 'chromium'
};
