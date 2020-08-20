import {DullahanError, DullahanFunctionEndCall, DullahanTestEndCall} from "@k2g/dullahan";

const fixLinebreaks = (input: string) => input.replace(/(\r\n|\n|\r)/gm, '<br>')

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

export const formatFailingTest = (test: FailingTest): string => {
    const {testName, error} = test;

    return fixLinebreaks(`:x: | ${testName} | ${error.name} | ${error.message}`);
};

export const formatFailingTable = (rows: string[]) => {
    const header = `## ${rows.length} Failing tests`;
    if (rows.length === 0) {
        return [header];
    }
    return [
        `## ${rows.length} Failing tests`,
        'Result | Name | Error |  Message',
        ':---: | :--- | :---: | :---',
        ...rows,
        ''
    ].join('\n');
};

export const isUnstableTest = (test: Test): boolean => {
    const {error, calls} = test;

    return !error && calls.filter(({error}) => !!error).length > 0;
};

export const formatUnstableTest = (test: Test): string => {
    const {testName, timeStart, timeEnd, calls} = test;

    return `:heavy_multiplication_x: | ${testName} | ${Math.ceil((timeEnd - timeStart) / 1000)}s | ${calls.filter(({error}) => !!error).length}`;
};

export const formatUnstableTable = (rows: string[], headerOnly: boolean) => {
    const header = `## ${rows.length} Unstable tests`;
    if (headerOnly || rows.length === 0) {
        return [header];
    }
    return [
        header,
        'Result | Name | Time |  Error Count',
        ':---: | :--- | :---: | :---:',
        ...rows,
        ''
    ].join('\n');
};

export const isSlowTest = (slowThreshold: number, test: Test): boolean => {
    const {error, timeStart, timeEnd} = test;

    return !error && timeEnd - timeStart >= slowThreshold;
};

export const formatSlowTest = (test: Test) => {
    const {testName, timeStart, timeEnd} = test;

    return fixLinebreaks(`:clock4: | ${testName} | ${Math.ceil((timeEnd - timeStart) / 1000)}s`);
};

export const formatSlowTable = (rows: string[], headerOnly) => {
    const header = `## ${rows.length} Slow tests`;
    if (headerOnly || rows.length === 0) {
        return [header];
    }
    return [
        header,
        `Result | Name | Time`,
        ':---: | :--- | :---:',
        ...rows,
        ''
    ].join('\n');
};

export const isSuccessfulTest = (slowThreshold: number, test: Test): boolean => {
    const {error, timeStart, timeEnd, calls} = test;

    return !error && timeEnd - timeStart < slowThreshold && !calls.find(({error}) => !!error);
};

export const formatSuccessfulTest = (test: Test) => {
    const {testName, timeStart, timeEnd} = test;

    return fixLinebreaks(`:heavy_check_mark: | ${testName} | ${Math.ceil((timeEnd - timeStart) / 1000)}s`);
};

export const formatSuccessfulTable = (rows: string[], headerOnly: boolean) => {
    const header = `## ${rows.length} Successful tests`;
    if (headerOnly || rows.length === 0) {
        return [header];
    }
    return [
        header,
        `Result | Name | Time`,
        ':---: | :--- | :---:',
        ...rows,
        ''
    ].join('\n');
};
