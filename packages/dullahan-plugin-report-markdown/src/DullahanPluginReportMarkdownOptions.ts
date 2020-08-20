import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@k2g/dullahan';

export type DullahanPluginReportMarkdownUserOptions = Partial<DullahanPluginUserOptions & {
    reportTitle: string;
    reportTitleUrl: string;
    slowTestThreshold: number;
    hideUnstableTests: boolean;
    hideSlowTests: boolean;
    hideSuccessfulTests: boolean;
}>;

export const DullahanPluginReportMarkdownDefaultOptions = {
    ...DullahanPluginDefaultOptions,
    reportTitle: 'Dullahan Report',
    reportTitleUrl: 'https://dullahan.io',
    slowTestThreshold: 60000,
    hideUnstableTests: false,
    hideSlowTests: false,
    hideSuccessfulTests: false
};

export type DullahanPluginReportMarkdownOptions = DullahanPluginReportMarkdownUserOptions & typeof DullahanPluginReportMarkdownDefaultOptions;
