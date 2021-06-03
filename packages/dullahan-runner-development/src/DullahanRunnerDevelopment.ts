import {Stats} from 'fs';

import * as micromatch from 'micromatch';
import {unwatchTree, watchTree} from 'watch';

import {
    DullahanRunnerDevelopmentDefaultOptions,
    DullahanRunnerDevelopmentUserOptions
} from './DullahanRunnerDevelopmentOptions';

import {
    DullahanAdapter,
    DullahanApi,
    DullahanError,
    DullahanRunner,
    DullahanRunnerArguments,
    DullahanTest,
    tryIgnore
} from '@k2g/dullahan';

export default class DullahanRunnerDevelopment extends DullahanRunner<DullahanRunnerDevelopmentUserOptions, typeof DullahanRunnerDevelopmentDefaultOptions> {

    private isBusy = false;

    private instance?: ({
        api: DullahanApi<any, any>;
        adapter: DullahanAdapter<any, any>;
        test: DullahanTest;
    });

    public constructor(args: DullahanRunnerArguments<DullahanRunnerDevelopmentUserOptions,
        typeof DullahanRunnerDevelopmentDefaultOptions>) {
        super({
            ...args,
            defaultOptions: DullahanRunnerDevelopmentDefaultOptions
        });
    }

    public async start(): Promise<void> {
        const {options, rootDirectories, includeGlobs, excludeGlobs, includeRegexes, excludeRegexes} = this;
        const {ignoreDotFiles, ignoreUnreadableDir, ignoreNotPermitted} = options;

        const watchOptions = {
            ignoreDotFiles,
            ignoreUnreadableDir,
            ignoreNotPermitted,
            filter: (file: string): boolean => {
                if (!/[\\/].*\..+/.test(file)) {
                    // Always accept sub-directories
                    return true;
                }

                return (!includeGlobs.length || micromatch.isMatch(file, includeGlobs))
                    && !micromatch.isMatch(file, excludeGlobs)
                    && (!includeRegexes.length || includeRegexes.some((iRegex) => iRegex.test(file)))
                    && !excludeRegexes.some((eRegex) => eRegex.test(file));
            }
        };

        const watchCallback = async (file: string | object, curr: Stats | null, prev: Stats | null): Promise<void> => {
            if (!this.isBusy && typeof file === 'string' && (prev === null || curr?.nlink !== 0)) {
                const {client, options} = this;
                const {testPredicate, minSuccesses, maxAttempts} = options;

                this.isBusy = true;

                client.reloadApi('recursive');
                client.reloadAdapter('recursive');
                const tempInstance = client.getTestInstance(file, 'recursive');
                const testPredicateResult = !!tempInstance && await testPredicate(file, tempInstance.test);

                if (!testPredicateResult) {
                    this.isBusy = false;
                    return;
                }

                let successes = 0;
                let failures = 0;

                while (successes < minSuccesses && successes + failures < maxAttempts && maxAttempts - failures >= minSuccesses) {
                    const instance = client.getTestInstance(file);
                    const success = !!instance && await this.processFile(file, instance);
                    success ? successes++ : failures++;
                }

                this.isBusy = false;
            }
        };

        rootDirectories.forEach((rootDirectory) => watchTree(rootDirectory, watchOptions, watchCallback));

        console.log('Watching for changes, press [CTRL+C] once to stop watching');
        await new Promise((resolve) => process.once('SIGINT', resolve));
    }

    public async stop(): Promise<void> {
        const {rootDirectories, instance} = this;

        rootDirectories.forEach((rootDirectory) => unwatchTree(rootDirectory));
        await tryIgnore(1, async () => instance?.adapter.closeBrowser());
    }

    private async processFile(file: string, instance: {
        testId: string;
        api: DullahanApi<any, any>;
        adapter: DullahanAdapter<any, any>;
        test: DullahanTest;
    }): Promise<boolean> {
        const {client} = this;
        const {testId, test, adapter, api} = instance;
        const {instance: oldInstance} = this;

        if (oldInstance) {
            await tryIgnore(3, async () => {
                if (await oldInstance.adapter.isBrowserOpen()) {
                    await oldInstance.adapter.closeBrowser();
                }
            });
        }

        this.instance = instance;
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

            await tryIgnore(1, () => adapter.screenshotPage());

            return false;
        }

        return true;
    }
}
