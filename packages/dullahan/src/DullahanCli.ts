import {config as loadEnvironmentVariables} from 'dotenv';
import {argv} from 'yargs';

import {DullahanClient} from './DullahanClient';
import {DullahanConfig} from './DullahanConfig';
import {ensureScopedOptions, requireDependency} from './nodejs_helpers';

export type DullahanCliArguments = {
    config?: string;
};

export const cli = async (args: DullahanCliArguments = argv as DullahanCliArguments): Promise<void> => {

    process.on('unhandledRejection', (reason: unknown) => {
        console.error(reason);
        process.exit(1);
    });

    loadEnvironmentVariables();

    const {DULLAHAN_CLI_CONFIG} = process.env;
    const enableTypescript = process.argv.findIndex((part: string) => part.includes('ts-node')) >= 0;
    const configFileExtension = enableTypescript ? 'ts' : 'js';
    const configPathOrName = args.config ?? (DULLAHAN_CLI_CONFIG || `dullahan.config.${configFileExtension}`);
    const configPartial = requireDependency(configPathOrName, {}) as Partial<DullahanConfig>;

    const config: DullahanConfig = {
        api: ensureScopedOptions(configPartial.api ?? '@k2g/dullahan'),
        adapter: ensureScopedOptions(configPartial.adapter),
        runner: ensureScopedOptions(configPartial.runner),
        plugins: (configPartial.plugins ?? []).map(ensureScopedOptions)
    };

    const client = new DullahanClient(config);

    await client.start();
    await client.stop();
};
