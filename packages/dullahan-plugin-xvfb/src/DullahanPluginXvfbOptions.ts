import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

export type DullahanPluginXvfbUserOptions = Partial<DullahanPluginUserOptions & {
    displayNum: number;
    reuse: boolean;
    timeout: number;
    silent: boolean;
    xvfb_args: (string | number)[];
}>;

export const DullahanPluginXvfbDefaultOptions = {
    ...DullahanPluginDefaultOptions
};

export type DullahanPluginXvfbOptions = DullahanPluginXvfbUserOptions & typeof DullahanPluginXvfbDefaultOptions;
