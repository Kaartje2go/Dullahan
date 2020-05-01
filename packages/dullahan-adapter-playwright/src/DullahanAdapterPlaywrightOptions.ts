import {DullahanAdapterUserOptions, DullahanAdapterDefaultOptions} from '@kaartje2go/temp-dullahan';

export type DullahanAdapterPlaywrightUserOptions = Partial<DullahanAdapterUserOptions & {
    browserName?: 'chromium' | 'firefox' | 'webkit';
 }>;

export const DullahanAdapterPlaywrightDefaultOptions = {
    ...DullahanAdapterDefaultOptions,
    browserName: 'chromium'
};
