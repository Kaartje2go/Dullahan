import {DullahanPluginDefaultOptions, DullahanPluginUserOptions} from '@k2g/dullahan';

const {
    DULLAHAN_SLACK_WEBHOOK, SLACK_WEBHOOK
} = process.env;

export type DullahanPluginSlackUserOptions = Partial<DullahanPluginUserOptions & {
    webhook: string;
    channel: string;
    mention?: string;
    when: 'always' | 'failure' | 'success';
    maxPreviews: number;
    slowTestThreshold: number;
    attachments: {
        [key: string]: string | number | boolean
    }
}>;

export const DullahanPluginSlackDefaultOptions = {
    ...DullahanPluginDefaultOptions,
    webhook: DULLAHAN_SLACK_WEBHOOK || SLACK_WEBHOOK,
    when: 'always',
    maxPreviews: 3,
    slowTestThreshold: 60000,
    attachments: {}
};

export type DullahanPluginSlackOptions = DullahanPluginSlackUserOptions & typeof DullahanPluginSlackDefaultOptions;
