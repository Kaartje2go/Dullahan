import {DullahanPluginAwsS3DefaultOptions, DullahanPluginAwsS3UserOptions} from './DullahanPluginAwsS3Options';
import {S3} from 'aws-sdk';

import {Artifact, DullahanClient, DullahanError, DullahanPlugin} from '@k2g/dullahan';

export default class DullahanPluginAwsS3 extends DullahanPlugin<
    DullahanPluginAwsS3UserOptions,
    typeof DullahanPluginAwsS3DefaultOptions
> {

    private readonly s3 = this.options.useAccessKeys ? new S3({
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey,
        region: this.options.region
    }) : new S3({
        region: this.options.region
    });

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginAwsS3UserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginAwsS3DefaultOptions,
        });
    }

    public async start(): Promise<void> {
        const {options} = this;
        const {bucketName, region, accessKeyId, secretAccessKey} = options;

        if (typeof bucketName !== 'string' || bucketName.length === 0) {
            throw new DullahanError(`Option "bucketName" was expected to be a string, but was: ${bucketName}`);
        }

        if (!/^(af|ap|ca|cn|eu|me|sa|us)-(central|north|east|south|west|northeast|northwest|southeast|southwest)-\d$/.test(region ?? '')) {
            throw new DullahanError(`Option "region" was expected to be a valid region code, but was: ${region}`);
        }

        if (!/^[A-Z0-9]{20}$/.test(accessKeyId ?? '')) {
            throw new DullahanError('Option "accessKeyId" did not match RegExp /^[A-Z0-9]{20}$/');
        }

        if (!/^[A-Za-z0-9\/+=]{40}$/.test(secretAccessKey ?? '')) {
            throw new DullahanError('Option "secretAccessKey" did not match RegExp /^[A-Za-z0-9\\/+=]{40}$/');
        }
    }

    private getRegexForSecret(secret: string | RegExp): RegExp {
        if (secret instanceof RegExp)    {
            return secret;
        }
        const secretRegex = /\/(.+)\//.exec(secret);
        return secretRegex !== null
            ? new RegExp(secretRegex[1], 'gim')
            : new RegExp(secret.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'gim');
    }

    public async uploadArtifact(artifact: Artifact): Promise<URL | null> {
        const {s3, options} = this;
        const {bucketName, region, accessKeyId, secretAccessKey, secrets} = options;
        const {scope, name, ext, encoding, data, mimeType} = artifact;

        const Key = `artifacts/${encodeURIComponent(scope)}/${encodeURIComponent(name)}-${Date.now()}.${encodeURIComponent(ext)}`;
        const url = new URL(`https://${bucketName}.s3.${region}.amazonaws.com/${Key}`);

        let safeData = data;
        [...new Set([
            ...secrets,
            accessKeyId,
            secretAccessKey,
            ...Object.entries(process.env)
                .filter(([key, value]) => /token|key|secret|password/i.test(key) && value?.length)
                .map(([, value]) => value)
        ])].forEach((secret) => {
            if (secret) {
                const searchValue = this.getRegexForSecret(secret);
                safeData = safeData.replace(searchValue, '<secret>');
            }
        });

        try {
            console.log(`Uploading file "${url}"`);

            await s3.putObject({
                Key,
                ACL: 'public-read',
                Body: Buffer.from(safeData, encoding),
                ContentType: mimeType,
                ContentEncoding: encoding,
                Bucket: bucketName!
            }).promise();

            return url;
        } catch (error) {
            console.error(error);

            return null;
        }
    }
}
