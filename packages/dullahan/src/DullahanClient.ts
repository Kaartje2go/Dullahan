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
import {AdapterConstructor, ApiContructor, PluginConstructor, RunnerConstructor} from "./nodejs_helpers/types";
import {DullahanError} from "./DullahanError";

export class DullahanClient {

    private Api: ApiContructor;

    private Adapter: AdapterConstructor;

    public readonly config: DullahanConfig;

    private readonly runner: DullahanRunner<any, any>;

    private readonly plugins: DullahanPlugin<any, any>[];

    private readonly storedArtifactPromises: Promise<StoredArtifact>[] = [];

    private readonly functionStartCalls: DullahanFunctionStartCall[] = [];
    private readonly functionEndPromises: Promise<DullahanFunctionEndCall>[] = [];
    private readonly testStartCalls: DullahanTestStartCall[] = [];
    private readonly testEndPromises: Promise<DullahanTestEndCall>[] = [];

    public constructor(config: DullahanConfig) {
        const Api = typeof config.api[0] === 'string' ? requireDependency(config.api[0], {
            expectedName: /^DullahanApi/i
        }) as ApiContructor : config.api[0];

        const Adapter = typeof config.adapter[0] === 'string'?requireDependency(config.adapter[0], {
            expectedName: /^DullahanAdapter/i
        }) as AdapterConstructor : config.adapter[0];

        const Runner = typeof config.runner[0] === 'string' ? requireDependency(config.runner[0], {
            expectedName: /^DullahanRunner/i
        }) as RunnerConstructor : config.runner[0];

        const plugins = config.plugins.map(([nameOrPath, userOptions]: DullahanScopedOptions<PluginConstructor>) => {
            const Plugin = typeof nameOrPath === 'string' ? requireDependency(nameOrPath, {
                expectedName: /^DullahanPlugin/i
            }) as PluginConstructor : nameOrPath;

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

        if (typeof api[0] !== 'string') {
            throw new DullahanError('Cannot reload API: A file path is needed, but a constructor was provided.');
        }

        this.Api = requireDependency(api[0], {
            clearCache,
            expectedName: /^DullahanApi/i
        }) as ApiContructor;
    }

    public reloadAdapter(clearCache?: 'shallow' | 'recursive'): void {
        const {adapter} = this.config;

        if (typeof adapter[0] !== 'string') {
            throw new DullahanError('Cannot reload Adapter: A file path is needed, but a constructor was provided.');
        }

        this.Adapter = requireDependency(adapter[0], {
            clearCache,
            expectedName: /^DullahanAdapter/i
        }) as AdapterConstructor;
    }

    public getTestInstance(file: string | DullahanTest, clearCache?: 'shallow' | 'recursive'): {
        testId: string;
        api: DullahanApi<any, any>;
        adapter: DullahanAdapter<any, any>;
        test: DullahanTest;
    } | null {
        const {config, Api, Adapter} = this;

        const testId = createHash('sha256').update(JSON.stringify(file)).digest('hex');
        const test = typeof file === 'string' ? requireDependency(file, {clearCache}) as Partial<DullahanTest> : file;

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
