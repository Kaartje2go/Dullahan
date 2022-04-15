import {resolve as resolvePath} from 'path';

import decache from 'decache';

import {DullahanError} from '../DullahanError';
import {DependencyPath, isAbsolutePath, isRelativePath} from "./types";

const resolveDependencyPath = (path: DependencyPath): string => {
    if (isAbsolutePath(path)) {
        try {
            return require.resolve(path);
        } catch (error: any) {
            throw new DullahanError(`Could not resolve dependency "${path}" as an absolute path`);
        }
    }

    if (isRelativePath(path)) {
        const cwd = process.cwd();
        try {
            const absolutePath = resolvePath(cwd, path);
            return require.resolve(absolutePath);
        } catch (error: any) {
            throw new DullahanError(`Could not resolve dependency "${path}" as a relative path to "${cwd}"`);
        }
    }

    try {
        return require.resolve(path);
    } catch (error: any) {
        throw new DullahanError(`Could not resolve dependency "${path}" as a node module`);
    }
};

export const requireDependency = (nameOrPath: DependencyPath, options: {
    expectedName?: RegExp;
    clearCache?: 'shallow' | 'recursive';
}): unknown => {
    const path = resolveDependencyPath(nameOrPath);
    const {expectedName, clearCache} = options;

    try {
        if (clearCache) {
            const before = Object.keys(require.cache);
            decache(path);
            const after = Object.keys(require.cache);

            before.forEach((key) => {
                if (!after.includes(key)) {
                    console.log(`Removed dependency "${key}" from the NodeJS cache`);
                }
            });
        }

        const importedData = require(path);
        const keys = Object.keys(importedData ?? {});

        if (!keys.length) {
            throw new DullahanError(`Imported dependency "${path}" appears to be an empty file`);
        } else if (keys.includes('default')) {

            return importedData.default as unknown;
        } else if (keys.length === 1) {
            const [key] = keys;

            return importedData[key] as unknown;
        } else {
            if (expectedName) {
                const matchedKeys = keys.filter((key) => expectedName.test(key)).sort((a, b) => a.length - b.length);
                const [key] = matchedKeys;

                if (key) {
                    console.log(matchedKeys);
                    return importedData[key] as unknown;
                }
            }

            return importedData as unknown;
        }
    } catch (error: any) {
        throw new DullahanError(error);
    }
};
