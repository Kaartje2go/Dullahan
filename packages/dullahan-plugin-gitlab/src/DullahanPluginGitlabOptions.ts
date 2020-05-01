import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@kaartje2go/temp-dullahan';

export type DullahanPluginGitlabUserOptions = Partial<DullahanPluginUserOptions & {

}>;

export const DullahanPluginGitlabDefaultOptions = {
    ...DullahanPluginDefaultOptions
};

export type DullahanPluginGitlabOptions = DullahanPluginGitlabUserOptions & typeof DullahanPluginGitlabDefaultOptions;
