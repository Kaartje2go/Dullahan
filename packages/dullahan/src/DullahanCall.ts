import {DullahanClient} from './DullahanClient';
import {DullahanError} from './DullahanError';

export type DullahanFunctionScope = 'api' | 'adapter';

export interface DullahanCallStart {
    testId: string;
    timeStart: number;
}

export interface DullahanCallEnd extends DullahanCallStart {
    timeEnd: number;
    error: DullahanError | null;

    [key: string]: unknown;
}

export type DullahanTestStartCall = DullahanCallStart & {
    testName: string;
};

export type DullahanTestEndCall = DullahanTestStartCall & DullahanCallEnd;

export type DullahanFunctionStartCall = DullahanCallStart & {
    functionScope: DullahanFunctionScope;
    functionName: string;
    functionArguments: unknown[];
};

export type DullahanFunctionEndCall = DullahanFunctionStartCall & DullahanCallEnd & {
    functionResult: unknown;
    remoteUrls?: URL[];
};

const isObject = (obj: unknown): obj is Record<string, unknown> => Object.prototype.toString.call(obj) === '[object Object]';

const truncateRecursive = (val: unknown) => {
    if (typeof val === 'string') {
        return val.length > 51 ? val.substring(0,50) + '...' : val;
    }
    if (isObject(val)) {
        const clone = { ...val };
        for (let key in clone) {
            clone[key] = truncateRecursive(clone[key]);
        }
        return clone
    }
    if (Array.isArray(val)) {
        return val.map(v => truncateRecursive(v));
    }
    return val;
}

const stringifyAndTruncate = (val: unknown) => {
    const str = JSON.stringify(val);
    return truncateRecursive(str);
}

export class DullahanCallSpy {

    protected constructor(args: {
        testId: string;
        client: DullahanClient;
        functionScope: DullahanFunctionScope;
        slowMotion: number;
    }) {
        const {testId, client, functionScope, slowMotion} = args;

        return new Proxy(this, {
            get: (target: DullahanCallSpy, functionName: string): unknown => {
                const property = target[functionName];

                if (typeof property !== 'function' || property.name.trim() === 'bound') {
                    return property;
                }

                return (...functionArguments: unknown[]): unknown => {
                    let intermediate: any;
                    const timeStart = Date.now();

                    try {
                        client.emitFunctionStart({
                            testId,
                            timeStart,
                            functionScope,
                            functionName,
                            functionArguments: functionArguments.map(v => truncateRecursive(v))
                        });

                        intermediate = property.apply(this, functionArguments);
                    } catch (error: any) {
                        client.emitFunctionEnd({
                            testId,
                            timeStart,
                            timeEnd: Date.now(),
                            functionScope,
                            functionName,
                            functionArguments,
                            functionResult: undefined,
                            error: new DullahanError(error)
                        });
                        throw error;
                    }

                    if (!intermediate?.then) {
                        client.emitFunctionEnd({
                            testId,
                            timeStart,
                            timeEnd: Date.now(),
                            functionScope,
                            functionName,
                            functionArguments,
                            functionResult: stringifyAndTruncate(intermediate),
                            error: null
                        });

                        return intermediate;
                    }

                    if (slowMotion) {
                        intermediate = intermediate.then(async (functionResult: any) => {
                            await new Promise((resolve) => setTimeout(resolve, slowMotion));
                            return functionResult;
                        });
                    }

                    return intermediate.then((functionResult: any) => {
                        client.emitFunctionEnd({
                            testId,
                            timeStart,
                            timeEnd: Date.now(),
                            functionScope,
                            functionName,
                            functionArguments,
                            functionResult: stringifyAndTruncate(functionResult),
                            error: null
                        });

                        return functionResult;
                    }).catch((error: Error) => {
                        client.emitFunctionEnd({
                            testId,
                            timeStart,
                            timeEnd: Date.now(),
                            functionScope,
                            functionName,
                            functionArguments,
                            functionResult: undefined,
                            error: new DullahanError(error)
                        });

                        throw error;
                    });
                };
            }
        });
    }
}
