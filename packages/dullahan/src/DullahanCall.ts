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

export class DullahanCallSpy {

    protected constructor(args: {
        testId: string;
        client: DullahanClient;
        functionScope: DullahanFunctionScope;
    }) {
        const {testId, client, functionScope} = args;

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
                            functionArguments
                        });

                        intermediate = property.apply(this, functionArguments);
                    } catch (error) {
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
                            functionResult: intermediate,
                            error: null
                        });

                        return intermediate;
                    }

                    return intermediate.then((functionResult: any) => {
                        client.emitFunctionEnd({
                            testId,
                            timeStart,
                            timeEnd: Date.now(),
                            functionScope,
                            functionName,
                            functionArguments,
                            functionResult,
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
