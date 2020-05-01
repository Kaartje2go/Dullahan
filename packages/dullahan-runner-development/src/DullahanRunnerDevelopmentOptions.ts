import {DullahanRunnerDefaultOptions, DullahanRunnerUserOptions} from '@kaartje2go/temp-dullahan';

export type DullahanRunnerDevelopmentUserOptions = Partial<DullahanRunnerUserOptions & {
    ignoreDotFiles: boolean;
    ignoreUnreadableDir: boolean;
    ignoreNotPermitted: boolean;
}>;

export const DullahanRunnerDevelopmentDefaultOptions = {
    ...DullahanRunnerDefaultOptions,
    ignoreDotFiles: true,
    ignoreUnreadableDir: true,
    ignoreNotPermitted: true
};

export type DullahanRunnerDevelopmentOptions =
    DullahanRunnerDevelopmentUserOptions
    & typeof DullahanRunnerDevelopmentDefaultOptions;
