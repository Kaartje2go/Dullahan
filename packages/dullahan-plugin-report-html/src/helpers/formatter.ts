import {DullahanError, DullahanFunctionEndCall, DullahanTestEndCall} from "@k2g/dullahan";

export interface Test extends DullahanTestEndCall {
    calls: DullahanFunctionEndCall[];
}

export interface FailingTest extends Test {
    error: DullahanError;
}

export const isFailingTest = (test: Test): test is FailingTest => {
    const {error} = test;

    return !!error;
};

export const isUnstableTest = (test: Test): boolean => {
    const {error, calls} = test;

    return !error && calls.filter(({error}) => !!error).length > 0;
};

export const isSlowTest = (slowThreshold: number, test: Test): boolean => {
    const {error, timeStart, timeEnd} = test;

    return !error && timeEnd - timeStart >= slowThreshold;
};

export const isSuccessfulTest = (slowThreshold: number, test: Test): boolean => {
    const {error, timeStart, timeEnd} = test;

    return !error && timeEnd - timeStart < slowThreshold;
};
