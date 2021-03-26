import {
    DullahanRunnerAwsLambdaDefaultOptions,
    DullahanRunnerAwsLambdaUserOptions,
} from "./DullahanRunnerAwsLambdaOptions";
import * as fastGlob from "fast-glob";
import asyncPool from "tiny-async-pool";
import {
    DullahanClient,
    DullahanError,
    DullahanFunctionEndCall,
    DullahanRunner,
    DullahanTestEndCall,
    tryIgnore,
    testFile,
    testIfOnlyTestsModified,
    getChangedFiles,
    sleep,
} from "@k2g/dullahan";
import { Lambda } from "aws-sdk";

const startTime = Date.now();

interface Test {
    functionEndCalls?: DullahanFunctionEndCall[];
    testEndCalls?: DullahanTestEndCall[];
}

export default class DullahanRunnerAwsLambda extends DullahanRunner<
    DullahanRunnerAwsLambdaUserOptions,
    typeof DullahanRunnerAwsLambdaDefaultOptions
> {
    private hasStopSignal = false;

    // private totalFailures = 0;

    private readonly lambda = this.options.useAccessKeys
        ? new Lambda({
              accessKeyId: this.options.accessKeyId,
              secretAccessKey: this.options.secretAccessKey,
              httpOptions: this.options.httpOptions,
              region: this.options.region,
          })
        : new Lambda({
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
        return this.options.role === "master"
            ? this.startMaster()
            : this.startSlave();
    }

    public async stop(earlyTermination = false): Promise<void> {
        if (earlyTermination) {
            console.log(
                "set hasStop signal to end loop early because early termination is true"
            );
            this.hasStopSignal = true;
        }
    }

    private async startMaster(): Promise<void> {
        const {
            client,
            options,
            rootDirectories,
            includeGlobs,
            excludeGlobs,
            includeRegexes,
            excludeRegexes,
        } = this;
        const {
            maxConcurrency,
            minSuccesses,
            maxAttempts,
            failFast,
            testPredicate,
        } = options;

        if (includeGlobs.length === 0) {
            includeGlobs.push("**/*");
        }

        console.log("Dullahan Runner AWS Lambda - finding tests");

        const searchResults = await Promise.all(
            rootDirectories.map((rootDirectory) =>
                fastGlob(includeGlobs, {
                    cwd: rootDirectory,
                    ignore: excludeGlobs,
                    absolute: true,
                    dot: true,
                })
            )
        );

        const files = await getChangedFiles();
        const onlyModifiedTests = await testIfOnlyTestsModified(files);

        const testFiles = (
            await Promise.all(
                searchResults
                    .flat()
                    .filter((file) => {
                        if (onlyModifiedTests) {
                            return testFile(files, file);
                        }
                        return (
                            (!includeRegexes.length ||
                                includeRegexes.some((iRegex) =>
                                    iRegex.test(file)
                                )) &&
                            (!excludeRegexes.length ||
                                !excludeRegexes.some((eRegex) =>
                                    eRegex.test(file)
                                ))
                        );
                    })
                    .map(async (file: string) => {
                        const instance = client.getTestInstance(file);
                        const accepted =
                            !!instance &&
                            (await testPredicate(file, instance.test));
                        return { file, accepted };
                    })
            )
        )
            .filter(({ accepted }) => accepted)
            .map(({ file }) => ({
                file,
                successes: 0,
                failures: 0,
            }));

        const nextPool = [...testFiles];

        console.log(
            `Dullahan Runner AWS Lambda - found ${testFiles.length} valid test files`
        );
        console.log(`Running tests with concurrency ${maxConcurrency}`);

        let i = 0;

        do {
            const currentPool = nextPool.splice(0, nextPool.length);

            await asyncPool(maxConcurrency, currentPool, async (testData) => {
                if (this.hasStopSignal) {
                    return;
                }

                const success = await this.processFile(testData.file, i++).catch(
                    (error) => {
                        console.error(error);

                        return false;
                    }
                );
                success ? testData.successes++ : testData.failures++;

                if (testData.successes >= minSuccesses) {
                    return;
                }

                const hasMoreAttempts =
                    testData.successes + testData.failures < maxAttempts;
                const couldStillPass =
                    maxAttempts - testData.failures >= minSuccesses;

                if (hasMoreAttempts && couldStillPass) {
                    nextPool.push(testData);
                } else if (failFast) {
                    this.hasStopSignal = true;
                }
            });
        } while (nextPool.length && !this.hasStopSignal);
    }

    private async startSlave(): Promise<void> {
        const { client, options } = this;
        const { file } = options.slaveOptions;

        const instance = client.getTestInstance(file);

        if (!instance) {
            return;
        }

        const { testId, test, adapter, api } = instance;

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

    private sleepTillSecondsFromStart(secondsFromStart) {
        return new Promise(resolve => {
            setTimeout(resolve, startTime + secondsFromStart * 1000 - Date.now());
        })
    }

    private async backpressure(i : number) {
        if (i >= 6 && i <= 10) {
            await this.sleepTillSecondsFromStart(5)
        } else if (i >= 11 && i <=15) {
            await this.sleepTillSecondsFromStart(10)
        } else if (i >= 16 && i <=20) {
            await this.sleepTillSecondsFromStart(15)
        } else if (i >= 21 && i <=25) {
            await this.sleepTillSecondsFromStart(20)
        } else if (i >= 26 && i <= 30) {
            await this.sleepTillSecondsFromStart(25)
        } 
    }

    private async processFile(file: string, i: number): Promise<boolean> {
        const { lambda, client, options } = this;
        const { slaveQualifier, slaveFunctionName, slaveOptions } = options;


        await this.backpressure(i);

        const { Payload } = await lambda
            .invoke({
                Qualifier: slaveQualifier!,
                FunctionName: slaveFunctionName!,
                Payload: JSON.stringify({
                    body: JSON.stringify({
                        ...slaveOptions,
                        file,
                    }),
                }),
            })
            .promise();

        // If the payload is not of type string, it cannot be parsed.
        if (typeof Payload !== "string") {
            console.error(
                `Invoked test returned incorrect Payload of type ${typeof Payload}`
            );
            return false;
        }
        try {
            const parsedPayload = JSON.parse(
                JSON.parse(Payload as string)
            ) as Test;
            const { functionEndCalls, testEndCalls } = parsedPayload;
            const testEndCall = testEndCalls && testEndCalls[0];

            functionEndCalls?.forEach((functionEndCall) =>
                client.emitFunctionEnd(functionEndCall)
            );
            testEndCall && client.emitTestEnd(testEndCall);

            return !testEndCall?.error;
        } catch (e) {
            console.info("Failed with Payload", Payload);
            console.error(e);
            return false;
        }
    }
}
