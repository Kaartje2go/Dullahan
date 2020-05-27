import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

const {
    DULLAHAN_PLUGIN_GITHUB_GITHUB_TOKEN, GITHUB_TOKEN, GH_TOKEN
} = process.env;

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
    statusUrl: 'https://dullahan.io',
    githubToken: DULLAHAN_PLUGIN_GITHUB_GITHUB_TOKEN || GITHUB_TOKEN || GH_TOKEN
};

export type DullahanPluginGithubOptions = DullahanPluginGithubUserOptions & typeof DullahanPluginGithubDefaultOptions;
