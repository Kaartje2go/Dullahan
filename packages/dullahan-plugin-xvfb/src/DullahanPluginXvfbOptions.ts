import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@kaartje2go/temp-dullahan';

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
