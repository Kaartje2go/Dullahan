import {resolve as resolvePath} from 'path';

import * as assignDeep from 'assign-deep';

import {DullahanClient} from '../DullahanClient';
import {ensureArray} from '../nodejs_helpers';

import {DullahanRunnerDefaultOptions, DullahanRunnerUserOptions} from './DullahanRunnerOptions';

export type DullahanRunnerArguments<DullahanRunnerSubclassUserOptions extends DullahanRunnerUserOptions,
    DullahanRunnerSubclassDefaultOptions extends typeof DullahanRunnerDefaultOptions> = {
    client: DullahanClient;
    userOptions: DullahanRunnerSubclassUserOptions;
    defaultOptions?: DullahanRunnerSubclassDefaultOptions;
};

export abstract class DullahanRunner<DullahanRunnerSubclassUserOptions extends DullahanRunnerUserOptions,
    DullahanRunnerSubclassDefaultOptions extends typeof DullahanRunnerDefaultOptions> {

    protected readonly client: DullahanClient;

    protected readonly options: DullahanRunnerSubclassUserOptions & DullahanRunnerSubclassDefaultOptions;

    protected readonly rootDirectories: string[];

    protected readonly includeGlobs: string[];

    protected readonly excludeGlobs: string[];

    protected readonly includeRegexes: RegExp[];

    protected readonly excludeRegexes: RegExp[];

    public constructor({
                           client,
                           userOptions,
                           defaultOptions = DullahanRunnerDefaultOptions as DullahanRunnerSubclassDefaultOptions
                       }: DullahanRunnerArguments<DullahanRunnerSubclassUserOptions, DullahanRunnerSubclassDefaultOptions>) {
        this.client = client;
        this.options = assignDeep({}, defaultOptions, userOptions);
        this.options.testPredicate = userOptions.testPredicate || defaultOptions.testPredicate;
        const {rootDirectories, includeGlobs, excludeGlobs, includeRegexes, excludeRegexes} = this.options;
        this.includeGlobs = ensureArray<string>(includeGlobs);
        this.excludeGlobs = ensureArray<string>(excludeGlobs);
        this.includeRegexes = ensureArray<RegExp>(includeRegexes);
        this.excludeRegexes = ensureArray<RegExp>(excludeRegexes);
        this.rootDirectories = ensureArray<string>(rootDirectories).map((rootDirectory) => resolvePath(process.cwd(), rootDirectory));
    }

    public abstract start(): Promise<void>;

    public async stop(): Promise<void> {

    }
}
