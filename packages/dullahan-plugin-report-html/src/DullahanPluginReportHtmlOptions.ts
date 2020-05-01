import {DullahanPluginUserOptions, DullahanPluginDefaultOptions} from '@kaartje2go/temp-dullahan';

export type DullahanPluginReportHtmlUserOptions = Partial<DullahanPluginUserOptions & {
    reportTitle: string;
    slowTestThreshold: number;
    colorHeader: string;
    colorSection: string;
    colorFailing: string;
    colorUnstable: string;
    colorSlow: string;
    colorSuccessful: string;
    template: string;
}>;

export const DullahanPluginReportHtmlDefaultOptions = {
    ...DullahanPluginDefaultOptions,
    reportTitle: 'Dullahan Report',
    slowTestThreshold: 60000,
    colorHeader: '#1b4373',
    colorSection: '#02b8ff',
    colorFailing: '#da002b',
    colorUnstable: '#ff9b00',
    colorSlow: '#87be3c',
    colorSuccessful: '#87be3c'
};

export type DullahanPluginReportHtmlOptions = DullahanPluginReportHtmlUserOptions & typeof DullahanPluginReportHtmlDefaultOptions;
