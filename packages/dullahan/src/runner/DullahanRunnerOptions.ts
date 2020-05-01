import {DullahanTest} from '../DullahanTest';

export type DullahanRunnerUserOptions = Partial<{
    failFast: boolean;
    minSuccesses: number;
    maxAttempts: number;
    rootDirectories: string[];
    includeRegexes: RegExp[];
    excludeRegexes: RegExp[];
    includeGlobs: string[];
    excludeGlobs: string[];
    testPredicate: (file: string, test: DullahanTest<never>) => Promise<boolean> | boolean;
}>;

export const DullahanRunnerDefaultOptions = {
    failFast: false,
    minSuccesses: 1,
    maxAttempts: 1,
    rootDirectories: ['./'],
    includeRegexes: [/test/i],
    excludeRegexes: [/node_modules/],
    includeGlobs: [
        '**/tests/**/*.{ts,js}',
        '**/*.test.{ts,js}'
    ],
    testPredicate: (file: string, test: DullahanTest<never>): boolean => !test.disabled
};

export type DullahanRunnerOptions = DullahanRunnerUserOptions & typeof DullahanRunnerDefaultOptions;
