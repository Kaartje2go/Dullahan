import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

const {
    DULLAHAN_PLUGIN_GITLAB_GITLAB_TOKEN, GITLAB_TOKEN
} = process.env;

export type DullahanPluginGitlabUserOptions = Partial<DullahanPluginUserOptions & {
    gitlabToken: string;
    projectId: number | string;
    mergeRequestInternalId: number | string;
    enableMergeRequestComments: boolean;
}>;

export const DullahanPluginGitlabDefaultOptions = {
    ...DullahanPluginDefaultOptions,
    gitlabToken: DULLAHAN_PLUGIN_GITLAB_GITLAB_TOKEN || GITLAB_TOKEN,
    enableMergeRequestComments: true
};

export type DullahanPluginGitlabOptions = DullahanPluginGitlabUserOptions & typeof DullahanPluginGitlabDefaultOptions;
