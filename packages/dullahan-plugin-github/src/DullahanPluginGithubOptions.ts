import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

export type DullahanPluginGithubUserOptions = Partial<DullahanPluginUserOptions & {
    enableStatusChecks: boolean;
    enablePullRequestReviews: boolean;
    enablePullRequestComments: boolean;
    statusName: string;
    statusUrl: string;
    githubToken: string;
    repositoryName: string;
    repositoryOwner: string;
    commitHash: string;
    commitOwner: string;
    branchName: string;
}>;

export const DullahanPluginGithubDefaultOptions = {
    ...DullahanPluginDefaultOptions,
    enableStatusChecks: true,
    enablePullRequestReviews: false,
    enablePullRequestComments: true,
    statusName: 'Dullahan',
    statusUrl: 'https://dullahan.io'
};

export type DullahanPluginGithubOptions = DullahanPluginGithubUserOptions & typeof DullahanPluginGithubDefaultOptions;
