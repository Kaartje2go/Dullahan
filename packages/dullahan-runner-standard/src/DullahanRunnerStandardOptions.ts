import {DullahanRunnerDefaultOptions, DullahanRunnerUserOptions} from '@kaartje2go/temp-dullahan';

export type DullahanRunnerStandardUserOptions = Partial<DullahanRunnerUserOptions & {
    maxConcurrency: number;
}>;

export const DullahanRunnerStandardDefaultOptions = {
    ...DullahanRunnerDefaultOptions
};

export type DullahanRunnerStandardOptions =
    DullahanRunnerStandardUserOptions
    & typeof DullahanRunnerStandardDefaultOptions;
