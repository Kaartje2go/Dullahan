import {DullahanRunnerDefaultOptions, DullahanRunnerUserOptions} from '@k2g/dullahan';

export type DullahanRunnerStandardUserOptions = Partial<DullahanRunnerUserOptions & {
    maxConcurrency: number;
}>;

export const DullahanRunnerStandardDefaultOptions = {
    ...DullahanRunnerDefaultOptions
};

export type DullahanRunnerStandardOptions =
    DullahanRunnerStandardUserOptions
    & typeof DullahanRunnerStandardDefaultOptions;
