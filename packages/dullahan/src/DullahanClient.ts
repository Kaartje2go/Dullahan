import {createHash} from 'crypto';
import cloneDeep = require('clone-deep');

import {DullahanAdapter} from './adapter';
import {DullahanApi} from './api';
import {
    DullahanFunctionEndCall,
    DullahanFunctionStartCall,
    DullahanTestEndCall,
    DullahanTestStartCall
} from './DullahanCall';
import {DullahanConfig} from './DullahanConfig';
import {DullahanPlugin} from './DullahanPlugin';
import {DullahanTest, isValidTest} from './DullahanTest';
import {
    Artifact,
    DullahanScopedOptions,
    requireDependency,
    saveArtifactToFile,
    saveArtifactToRemotes,
    StoredArtifact
} from './nodejs_helpers';
import {DullahanRunner} from './runner';

type ApiContructor = new (args: {
    testId: string;
    test: DullahanTest<never>;
    adapter: DullahanAdapter<never, never>;
    client: DullahanClient;
    userOptions: object;
}) => DullahanApi<never, never>;

type AdapterConstructor = new (args: {
    testId: string;
    client: DullahanClient;
    userOptions: object;
}) => DullahanAdapter<never, never>;

type RunnerConstructor = new (args: {
    client: DullahanClient;
    userOptions: object;
}) => DullahanRunner<never, never>;

type PluginConstructor = new (args: {
    client: DullahanClient;
    userOptions: object;
}) => DullahanPlugin<never, never>;

export class DullahanClient {

    private Api: ApiContructor;

    private Adapter: AdapterConstructor;

    public readonly config: DullahanConfig;

    private readonly runner: DullahanRunner<never, never>;

    private readonly plugins: DullahanPlugin<never, never>[];

    private readonly storedArtifactPromises: Promise<StoredArtifact>[] = [];

    private readonly functionStartCalls: DullahanFunctionStartCall[] = [];
    private readonly functionEndPromises: Promise<DullahanFunctionEndCall>[] = [];
    private readonly testStartCalls: DullahanTestStartCall[] = [];
    private readonly testEndPromises: Promise<DullahanTestEndCall>[] = [];

    public constructor(config: DullahanConfig) {
        const Api = requireDependency(config.api[0], {
            expectedName: /^DullahanApi/i
        }) as ApiContructor;

        const Adapter = requireDependency(config.adapter[0], {
            expectedName: /^DullahanAdapter/i
        }) as AdapterConstructor;

        const Runner = requireDependency(config.runner[0], {
            expectedName: /^DullahanRunner/i
        }) as RunnerConstructor;

        const plugins = config.plugins.map(([nameOrPath, userOptions]: DullahanScopedOptions) => {
            const Plugin = requireDependency(nameOrPath, {
                expectedName: /^DullahanPlugin/i
            }) as PluginConstructor;

            return new Plugin({
                client: this,
                userOptions
            });
        });

        const runner = new Runner({
            client: this,
            userOptions: config.runner[1]
        });

        this.Api = Api;
        this.Adapter = Adapter;
        this.runner = runner;
        this.plugins = plugins;
        this.config = config;
    }

    public reloadApi(clearCache?: 'shallow' | 'recursive'): void {
        const {api} = this.config;

        this.Api = requireDependency(api[0], {
            clearCache,
            expectedName: /^DullahanApi/i
        }) as ApiContructor;
    }

    public reloadAdapter(clearCache?: 'shallow' | 'recursive'): void {
        const {adapter} = this.config;

        this.Adapter = requireDependency(adapter[0], {
            clearCache,
            expectedName: /^DullahanAdapter/i
        }) as AdapterConstructor;
    }

    public getTestInstance(file: string, clearCache?: 'shallow' | 'recursive'): {
        testId: string;
        api: DullahanApi<never, never>;
        adapter: DullahanAdapter<never, never>;
        test: DullahanTest;
    } | null {
        const {config, Api, Adapter} = this;

        const testId = createHash('sha256').update(file).digest('hex');
        const test = requireDependency(file, {clearCache}) as Partial<DullahanTest>;

        if (!isValidTest(test)) {
            return null;
        }

        const adapter = new Adapter({
            testId,
            client: this,
            userOptions: config.adapter[1]
        });

        const api = new Api({
            testId,
            test,
            adapter,
            client: this,
            userOptions: config.api[1]
        });

        return {
            testId,
            api,
            adapter,
            test
        };
    }

    public async start(): Promise<void> {
        const {plugins, runner} = this;

        console.log('Starting plugins');
        await Promise.all(plugins.map(async (plugin) => plugin.start()));

        console.log('Starting runner');
        await runner.start();
    }

    public async stop(earlyTermination = false): Promise<{
        storedArtifacts: StoredArtifact[];
        testEndCalls: DullahanTestEndCall[];
        functionEndCalls: DullahanFunctionEndCall[];
    }> {
        const {plugins, runner, testEndPromises, functionEndPromises} = this;

        console.log('Stopping runner');
        await runner.stop();
        console.log('Stopping runner complete');

        console.log('Stopping plugins');
        await Promise.all(plugins.map(async (plugin) => plugin.stop()));
        const [testEndCalls, functionEndCalls] = await Promise.all([
            Promise.all(testEndPromises),
            Promise.all(functionEndPromises)
        ]);
        console.log('Stopping plugins complete');

        console.log('Processing artifacts');
        await Promise.all(plugins.map(async (plugin) => {
            const artifacts = await plugin.getArtifacts(cloneDeep(testEndCalls), cloneDeep(functionEndCalls));
            artifacts.forEach((artifact) => this.submitArtifact(artifact));
        }));
        const storedArtifacts = await Promise.all(this.storedArtifactPromises);
        await Promise.all(plugins.map(async (plugin) => plugin.processResults(storedArtifacts, testEndCalls, functionEndCalls, earlyTermination).catch(console.error)));
        console.log('Processing artifacts complete');

        return {
            storedArtifacts,
            testEndCalls,
            functionEndCalls
        };
    }

    public submitArtifact(artifact: Artifact): Promise<StoredArtifact> {
        const {storedArtifactPromises, plugins} = this;

        const submissionPromise = (async (): Promise<StoredArtifact> => {
            const localUrlPromise = saveArtifactToFile(artifact);
            const remoteUrlsPromise = saveArtifactToRemotes(artifact, plugins);

            const localUrl = await localUrlPromise;
            const remoteUrls = await remoteUrlsPromise;

            return {
                ...artifact,
                localUrl,
                remoteUrls
            };
        })();

        storedArtifactPromises.push(submissionPromise);

        return submissionPromise;
    }

    public emitTestStart(dtsc: DullahanTestStartCall): void {
        console.log(dtsc.testName);
        this.testStartCalls.push(dtsc);
    }

    public emitTestEnd(dtec: DullahanTestEndCall): void {
        const {testEndPromises} = this;
        console.log(dtec.testName, dtec.error ?? 'success');

        testEndPromises.push(this.processTestEnd(dtec));
    }

    public emitFunctionStart(dfsc: DullahanFunctionStartCall): void {
        console.log(dfsc.functionScope, dfsc.functionName, dfsc.functionArguments);
        this.functionStartCalls.push(dfsc);
    }

    public emitFunctionEnd(dfec: DullahanFunctionEndCall): void {
        const {functionEndPromises} = this;

        functionEndPromises.push(this.processFunctionEnd(dfec));
    }

    public async processTestEnd(dtec: DullahanTestEndCall): Promise<DullahanTestEndCall> {
        const {plugins} = this;

        const dtecs = await Promise.all(plugins.map((plugin) => {
            return plugin.onTestEnd(cloneDeep(dtec)).catch((error) => {
                console.error(error);

                return dtec;
            });
        }));

        return Object.assign({}, ...dtecs, dtec);
    }

    private async processFunctionEnd(dfec: DullahanFunctionEndCall): Promise<DullahanFunctionEndCall> {
        const {functionScope, functionName, functionResult, timeStart, timeEnd} = dfec;
        const {plugins} = this;

        let dfecs: DullahanFunctionEndCall[] = [];

        if (functionScope === 'adapter' && functionName === 'screenshotPage' && typeof functionResult === 'string') {
            const {remoteUrls} = await this.submitArtifact({
                scope: 'dullahan',
                name: `${timeStart}${timeEnd}`,
                ext: 'png',
                encoding: 'base64',
                data: functionResult,
                mimeType: 'image/png'
            });

            dfecs = await Promise.all(plugins.map((plugin) => {
                return plugin.onFunctionEnd(cloneDeep({remoteUrls, ...dfec})).catch((error) => {
                    console.error(error);

                    return dfec;
                });
            }));
        } else {
            dfecs = await Promise.all(plugins.map((plugin) => {
                return plugin.onFunctionEnd(cloneDeep(dfec)).catch((error) => {
                    console.error(error);

                    return dfec;
                });
            }));
        }

        return Object.assign({}, ...dfecs, dfec);
    }
}
