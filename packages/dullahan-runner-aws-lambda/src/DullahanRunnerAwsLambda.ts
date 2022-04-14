import * as fastGlob from 'fast-glob';
import asyncPool from 'tiny-async-pool';
import {Lambda} from 'aws-sdk';
import {RateLimit} from 'async-sema';
import {
    DullahanClient,
    DullahanError,
    DullahanFunctionEndCall,
    DullahanRunner,
    DullahanTest,
    DullahanTestEndCall,
    hasProperty,
    tryIgnore,
} from '@k2g/dullahan';
import {
    DullahanRunnerAwsLambdaDefaultOptions,
    DullahanRunnerAwsLambdaUserOptions
} from './DullahanRunnerAwsLambdaOptions';

export default class DullahanRunnerAwsLambda extends DullahanRunner<DullahanRunnerAwsLambdaUserOptions, typeof DullahanRunnerAwsLambdaDefaultOptions> {

    private hasStopSignal = false;

    private readonly lambda = this.options.useAccessKeys ? new Lambda({
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey,
        httpOptions: this.options.httpOptions,
        region: this.options.region,
    }) : new Lambda({
        httpOptions: this.options.httpOptions,
    });

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanRunnerAwsLambdaUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanRunnerAwsLambdaDefaultOptions,
        });
    }

    public async start(): Promise<void> {
        return this.options.role === "master" ? this.startMaster() : this.startSlave();
    }

    public async stop(earlyTermination = false): Promise<void> {
        if (earlyTermination) {
            this.hasStopSignal = true;
        }
    }

    private async getTestDataFromFiles(): Promise<{
        file: string;
        successes: number;
        failures: number;
    }[]> {
        const {client, options, rootDirectories, includeGlobs, excludeGlobs, includeRegexes, excludeRegexes} = this;
        const {testPredicate} = options;

        if (includeGlobs.length === 0) {
            includeGlobs.push("**/*");
        }

        const searchResults = await Promise.all(rootDirectories.map((rootDirectory) => fastGlob(includeGlobs, {
            cwd: rootDirectory,
            ignore: excludeGlobs,
            absolute: true,
            dot: true
        })));

        const filteredSearchResults = searchResults.flat().filter((file) => (
            (!includeRegexes.length || includeRegexes.some((iRegex) => iRegex.test(file)))
            && (!excludeRegexes.length || !excludeRegexes.some((eRegex) => eRegex.test(file)))
        ));

        return (await Promise.all(filteredSearchResults.map(async (file: string) => {
            const instance = client.getTestInstance(file);
            const accepted = !!instance && (await testPredicate(file, instance.test));
            return {file, accepted};
        }))).filter(({accepted}) => accepted).map(({file}) => ({
            file,
            successes: 0,
            failures: 0
        }));
    }

    private async getTestDataFromInstances(): Promise<{
        testIndex: number;
        successes: number;
        failures: number;
    }[]> {
        const {options} = this;
        const {tests = [], testPredicate} = options;

        return (await Promise.all(tests.map(async (test: DullahanTest, testIndex: number) => {
            const accepted = await testPredicate('', test);
            return {testIndex, accepted};
        }))).filter(({accepted}) => accepted).map(({testIndex}) => ({
            testIndex,
            successes: 0,
            failures: 0
        }));
    }

    private async startMaster(): Promise<void> {
        const {options} = this;
        const {tests, maxConcurrency, rateLimitConcurrency, minSuccesses, maxAttempts, failFast} = options;

        const allTestData: (({
            file: string;
        } | {
            testIndex: number;
        }) & {
            successes: number;
            failures: number;
        })[] = await (tests?.length ? this.getTestDataFromInstances() : this.getTestDataFromFiles());

        let failureCount = 0;
        const nextPool = [...allTestData];
        const rateLimit = rateLimitConcurrency === Infinity ? null
            : RateLimit(rateLimitConcurrency, {uniformDistribution: true});

        console.log(`Dullahan Runner AWS Lambda - found ${allTestData.length} valid test files`);
        console.log(`Running tests with concurrency ${maxConcurrency}`);

        do {
            const currentPool = nextPool.splice(0, nextPool.length);

            await asyncPool(maxConcurrency, currentPool, async (testData: typeof allTestData[0]) => {
                if (this.hasStopSignal) {
                    return;
                }

                rateLimit && await rateLimit();

                const test = hasProperty(testData, 'file') ? testData.file : testData.testIndex;
                const success = await this.processFile(test).catch((error) => {
                    console.error(error);
                    return false;
                });
                success ? testData.successes++ : testData.failures++;

                if (testData.successes >= minSuccesses) {
                    return;
                }

                const hasMoreAttempts = testData.successes + testData.failures < maxAttempts;
                const couldStillPass = maxAttempts - testData.failures >= minSuccesses;

                if (hasMoreAttempts && couldStillPass) {
                    nextPool.push(testData);
                } else if (failFast) {
                    failureCount++;
                    this.hasStopSignal ||= failureCount >= Number(failFast);
                }
            });
        } while (nextPool.length && !this.hasStopSignal);
    }

    private async startSlave(): Promise<void> {
        const {client, options} = this;
        const {file, test: testInstance} = options.slaveOptions;

        const instance = client.getTestInstance(testInstance ?? file!);

        if (!instance) {
            return;
        }

        const {testId, test, adapter, api} = instance;

        const timeStart = Date.now();
        const testName = test.name;

        try {
            client.emitTestStart({
                testId,
                testName,
                timeStart,
            });

            await adapter.openBrowser();
            await test.run(api);

            client.emitTestEnd({
                testId,
                testName,
                timeStart,
                error: null,
                timeEnd: Date.now(),
            });
        } catch (error) {
            client.emitTestEnd({
                testId,
                error: new DullahanError(error),
                testName,
                timeStart,
                timeEnd: Date.now(),
            });

            await tryIgnore(1, async () => {
                if (await adapter.isBrowserOpen()) {
                    await adapter.screenshotPage();
                }
            });
        } finally {
            await adapter.closeBrowser();
        }
    }

    private async processFile(file: string | number): Promise<boolean> {
        const {lambda, client, options} = this;
        const {slaveQualifier, slaveFunctionName, slaveOptions} = options;

        const data = await lambda.invoke({
            Qualifier: slaveQualifier!,
            FunctionName: slaveFunctionName!,
            Payload: JSON.stringify({
                body: JSON.stringify({
                    ...slaveOptions,
                    file: typeof file === 'string' ? file : undefined,
                    testIndex: typeof file === 'number' ? file : undefined,
                })
            })
        }).promise();

        const {Payload} = data;

        // If the payload is not of type string, it cannot be parsed.
        if (typeof Payload !== 'string') {
            console.error(`Invoked test returned incorrect Payload of type ${typeof Payload}`);
            return false;
        }
        try {
            const payload = JSON.parse(Payload);
            const parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;
            const {functionEndCalls, testEndCalls} = parsedPayload || {};
            const testEndCall = testEndCalls?.[0];

            functionEndCalls?.forEach((functionEndCall) => client.emitFunctionEnd(functionEndCall));
            testEndCall && client.emitTestEnd(testEndCall);

            return !testEndCall?.error;
        } catch (e) {
            console.info('Failed with Payload', Payload);
            console.info('Failed with data', JSON.stringify(data));
            console.error(e);
            return false;
        }
    }
}
