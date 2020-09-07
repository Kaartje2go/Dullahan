import {DullahanRunnerStandardDefaultOptions, DullahanRunnerStandardUserOptions} from './DullahanRunnerStandardOptions';

import {DullahanClient, DullahanError, DullahanRunner, tryIgnore} from '@k2g/dullahan';
import asyncPool from 'tiny-async-pool';
import * as fastGlob from 'fast-glob';
import {cpus} from 'os';
import {readFile,pathExists} from 'fs-extra';

const getChangedFiles = async () : Promise<string[]> => {
    // file created in Dullahan-Tests repo with changed files from current branch using git history in drone build step
    const file = './.changed-files.txt';
    const fileExists = await pathExists(file);

    if (fileExists) {
        const data = await readFile(file, 'utf-8');
        const splitted = data.split('\n');
        // last element is empty line
        splitted.splice(-1);
        return splitted;
    }
    return [];
}

const testIfOnlyTestsModified = (splited : string[]) : boolean => {
    if (splited.length === 0) {
        return false;
    }
    return splited.every(line => line.startsWith('tests/'));
}

const testFile = (files: string[], fileToMatch: string) : boolean => {
    return files.some(file => fileToMatch.endsWith(file));
}

export default class DullahanRunnerStandard extends DullahanRunner<DullahanRunnerStandardUserOptions, typeof DullahanRunnerStandardDefaultOptions> {

    private hasStopSignal = false;

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanRunnerStandardUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanRunnerStandardDefaultOptions
        });
    }

    public async start(): Promise<void> {
        const {options, rootDirectories, includeGlobs, excludeGlobs, includeRegexes, excludeRegexes} = this;
        const {maxConcurrency = cpus().length, minSuccesses, maxAttempts, failFast} = options;

        if (includeGlobs.length === 0) {
            includeGlobs.push('**/*')
        }

        const concurrency = Math.max(1, Math.min(Math.floor(maxConcurrency / rootDirectories.length), maxConcurrency));
        const searchResults = await Promise.all(rootDirectories.map((rootDirectory) => fastGlob(includeGlobs, {
            concurrency,
            cwd: rootDirectory,
            ignore: excludeGlobs,
            absolute: true,
            dot: true,
        })));

        const files = await getChangedFiles();
        const onlyModifiedTests = testIfOnlyTestsModified(files);

        const testFiles = searchResults.flat()
            .filter((file) => {
                if (onlyModifiedTests) {
                    return testFile(files, file);
                }
                return (!includeRegexes.length || includeRegexes.some((iRegex) => iRegex.test(file)))
                && (!excludeRegexes.length || !excludeRegexes.some((eRegex) => eRegex.test(file)))
            })
            .map((file) => ({
                file,
                successes: 0,
                failures: 0
            }));

        process.once('SIGINT', () => {
            this.hasStopSignal = true;
        });

        const nextPool = [...testFiles];

        do {
            const currentPool = nextPool.splice(0, nextPool.length);

            await asyncPool(maxConcurrency, currentPool, async (testData) => {
                if (this.hasStopSignal) {
                    return;
                }

                const success = await this.processFile(testData.file);
                success ? testData.successes++ : testData.failures++;

                if (testData.successes >= minSuccesses) {
                    return;
                }

                const hasMoreAttempts = testData.successes + testData.failures < maxAttempts;
                const couldStillPass = maxAttempts - testData.failures >= minSuccesses;

                if (hasMoreAttempts && couldStillPass) {
                    nextPool.push(testData);
                } else if (failFast) {
                    this.hasStopSignal = true;
                }
            });
        } while (nextPool.length && !this.hasStopSignal);
    }

    private async processFile(file: string): Promise<boolean> {
        const {client, options} = this;
        const {testPredicate} = options;

        const instance = client.getTestInstance(file);

        if (!instance) {
            return true;
        }

        const {testId, test, adapter, api} = instance;

        if (!(await testPredicate(file, test))) {
            return true;
        }

        const timeStart = Date.now();
        const testName = test.name;

        try {
            client.emitTestStart({
                testId,
                testName,
                timeStart
            });

            await adapter.openBrowser();
            await test.run(api);
            await adapter.closeBrowser();

            client.emitTestEnd({
                testId,
                testName,
                timeStart,
                error: null,
                timeEnd: Date.now()
            });
        } catch (error) {
            client.emitTestEnd({
                testId,
                error: new DullahanError(error),
                testName,
                timeStart,
                timeEnd: Date.now()
            });

            await tryIgnore(1, async () => {
                if (await adapter.isBrowserOpen()) {
                    await adapter.screenshotPage();
                }
            });

            await tryIgnore(3, async () => {
                if (await adapter.isBrowserOpen()) {
                    await adapter.closeBrowser();
                }
            });

            return false;
        }

        return true;
    }
}
