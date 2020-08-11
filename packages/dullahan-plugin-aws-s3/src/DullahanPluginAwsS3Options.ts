import {DullahanPluginDefaultOptions, DullahanPluginUserOptions} from '@k2g/dullahan';

const {
    DULLAHAN_PLUGIN_AWS_S3_AWS_REGION, AWS_REGION, AWS_DEFAULT_REGION,
    DULLAHAN_PLUGIN_AWS_S3_AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_ID,
    DULLAHAN_PLUGIN_AWS_S3_AWS_SECRET_ACCESS_KEY, AWS_SECRET_ACCESS_KEY
} = process.env;

export type DullahanPluginAwsS3UserOptions = Partial<DullahanPluginUserOptions & {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    secrets: (string | RegExp)[];
    useAccessKeys: boolean;
}>;

export const DullahanPluginAwsS3DefaultOptions = {
    ...DullahanPluginDefaultOptions,
    region: DULLAHAN_PLUGIN_AWS_S3_AWS_REGION || AWS_REGION || AWS_DEFAULT_REGION,
    accessKeyId: DULLAHAN_PLUGIN_AWS_S3_AWS_ACCESS_KEY_ID || AWS_ACCESS_KEY_ID,
    secretAccessKey: DULLAHAN_PLUGIN_AWS_S3_AWS_SECRET_ACCESS_KEY || AWS_SECRET_ACCESS_KEY,
    secrets: [] as (string | RegExp)[],
    useAccessKeys: true
};

export type DullahanPluginAwsS3Options = DullahanPluginAwsS3UserOptions & typeof DullahanPluginAwsS3DefaultOptions;
