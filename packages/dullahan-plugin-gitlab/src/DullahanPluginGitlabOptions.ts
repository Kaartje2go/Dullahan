import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

export type DullahanPluginGitlabUserOptions = Partial<DullahanPluginUserOptions & {

}>;

export const DullahanPluginGitlabDefaultOptions = {
    ...DullahanPluginDefaultOptions
};

export type DullahanPluginGitlabOptions = DullahanPluginGitlabUserOptions & typeof DullahanPluginGitlabDefaultOptions;
