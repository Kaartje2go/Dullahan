import * as XVirtualFrameBuffer from 'xvfb';

import {DullahanPluginXvfbUserOptions, DullahanPluginXvfbDefaultOptions} from './DullahanPluginXvfbOptions';

import {DullahanPlugin, DullahanClient} from '@k2g/dullahan';

export default class DullahanPluginXvfb extends DullahanPlugin<
    DullahanPluginXvfbUserOptions,
    typeof DullahanPluginXvfbDefaultOptions
> {

    private readonly xvfb = new XVirtualFrameBuffer(this.options);

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginXvfbUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginXvfbDefaultOptions
        });
    }

    public async start(): Promise<void> {
        const {xvfb} = this;

        await new Promise<void>((resolve, reject) => {
            xvfb.start((error?: Error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public async stop(): Promise<void> {
        const {xvfb} = this;

        await new Promise<void>((resolve, reject) => {
            xvfb.stop((error?: Error) => {
                error ? reject(error) : resolve();
            });
        });
    }
}
