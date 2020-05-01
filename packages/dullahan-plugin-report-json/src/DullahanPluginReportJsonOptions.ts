import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@kaartje2go/temp-dullahan';

export type DullahanPluginReportJsonUserOptions = Partial<DullahanPluginUserOptions & {

}>;

export const DullahanPluginReportJsonDefaultOptions = {
    ...DullahanPluginDefaultOptions
};

export type DullahanPluginReportJsonOptions = DullahanPluginReportJsonUserOptions & typeof DullahanPluginReportJsonDefaultOptions;
