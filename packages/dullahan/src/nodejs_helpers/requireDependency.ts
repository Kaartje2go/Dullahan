import {resolve as resolvePath} from 'path';

import decache from 'decache';

import {DullahanError} from '../DullahanError';

const resolveDependencyPath = (nameOrPath: string): string => {
    try {
        const path = require.resolve(nameOrPath);

        return path;
    } catch {
        console.log(`Dependency could not be found by NodeJS ${nameOrPath}`);
    }

    try {
        const cwd = process.cwd();
        const absolutePath = resolvePath(cwd, nameOrPath);
        const path = require.resolve(absolutePath);

        return path;
    } catch {
        console.log(`Dependency could not be found relative to the current working directory for ${nameOrPath}`);
    }

    throw new DullahanError(`Could not resolve dependency "${nameOrPath}"`);
};

export const requireDependency = (nameOrPath: string, options: {
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
    } catch (error) {
        throw new DullahanError(error);
    }
};
