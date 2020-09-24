import * as assignDeep from 'assign-deep';

import {DullahanClient} from './DullahanClient';
import {Artifact, StoredArtifact} from './nodejs_helpers/artifacts';
import {
    DullahanFunctionEndCall,
    DullahanFunctionStartCall,
    DullahanTestEndCall,
    DullahanTestStartCall
} from './DullahanCall';

export type DullahanPluginUserOptions = Partial<{

}>;

export const DullahanPluginDefaultOptions = {

};

export abstract class DullahanPlugin<
    DullahanPluginSubclassUserOptions extends DullahanPluginUserOptions,
    DullahanPluginSubclassDefaultOptions extends typeof DullahanPluginDefaultOptions
> {

    protected readonly client: DullahanClient;

    protected readonly options: DullahanPluginSubclassUserOptions & DullahanPluginSubclassDefaultOptions;

    public constructor({
        client,
        userOptions,
        defaultOptions
    }: {
        client: DullahanClient;
        userOptions: DullahanPluginSubclassUserOptions;
        defaultOptions: DullahanPluginSubclassDefaultOptions;
    }) {
        this.client = client;
        this.options = assignDeep({}, defaultOptions, userOptions);
    }

    public async start(): Promise<void> {
        // Nothing
    }

    public async stop(earlyTermination): Promise<void> {
        // Nothing
    }

    public async onTestStart(dtsc: DullahanTestStartCall): Promise<void> {
        // Nothing
    }

    public async onTestEnd(dtec: DullahanTestEndCall): Promise<DullahanTestEndCall> {
        return dtec;
    }

    public async onFunctionStart(dfsc: DullahanFunctionStartCall): Promise<void> {
        // Nothing
    }

    public async onFunctionEnd(dfec: DullahanFunctionEndCall): Promise<DullahanFunctionEndCall> {
        return dfec;
    }

    public async getArtifacts(dtecs: DullahanTestEndCall[], dfecs: DullahanFunctionEndCall[]): Promise<Artifact[]> {
        return [];
    }

    public async uploadArtifact(artifact: Artifact): Promise<URL | null> {
        return null;
    }

    public async processResults(artifacts: StoredArtifact[], dtecs: DullahanTestEndCall[], dfecs: DullahanFunctionEndCall[], earlyTermination: boolean): Promise<void> {
        // Nothing
    }
}
