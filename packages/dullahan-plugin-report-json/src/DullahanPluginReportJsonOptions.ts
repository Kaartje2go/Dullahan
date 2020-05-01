import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

export type DullahanPluginReportJsonUserOptions = Partial<DullahanPluginUserOptions & {

}>;

export const DullahanPluginReportJsonDefaultOptions = {
    ...DullahanPluginDefaultOptions
};

export type DullahanPluginReportJsonOptions = DullahanPluginReportJsonUserOptions & typeof DullahanPluginReportJsonDefaultOptions;
