import {readFileSync, writeFile} from 'fs';
import {resolve as resolvePath} from 'path';

import {
    DullahanAdapter,
    DullahanAdapterArguments,
    DullahanApi,
    DullahanApiArguments,
    DullahanClient,
    DullahanTest
} from '@kaartje2go/temp-dullahan';
import {parse} from "dotenv";

declare let api: DullahanApi<never, never>;
declare let adapter: DullahanAdapter<never, never>;

declare const dullahanApiName: string;
declare const dullahanApiOptions: object;
declare const dullahanAdapterName: string;
declare const dullahanAdapterOptions: object;

declare namespace jasmine {
    const getEnv: () => {
        addReporter: (object: object) => void;
    };

    let currentTest: {
        id: string;
        description: string;
        fullName: string;
        failedExpectations: {
            actual: string;
            error: Error;
            expected: string;
            matcherName: string;
            message: string;
            passed: boolean;
            stack: string;
        }[];
        passedExpectations: unknown[];
        pendingReason: string;
        testPath: string;
    };
}

Object.keys(parse(Buffer.from(readFileSync('.env.example')))).forEach((key) => {
    delete process.env[key];
});

jest.setTimeout(60000);

jasmine.getEnv().addReporter({
    specStarted: (result) => jasmine.currentTest = result,
    specDone: (result) => jasmine.currentTest = result
});

const AdapterFactory: new (args: DullahanAdapterArguments<any, any>)
    => DullahanAdapter<never, never> = require(dullahanAdapterName).default;

const ApiFactory: new (args: DullahanApiArguments<any, any>)
    => DullahanApi<never, never> = require(dullahanApiName).DullahanApi;

beforeEach(() => {
    global['adapter'] = new AdapterFactory({
        testId: 'jest',
        client: {
            emitTestStart: jest.fn(),
            emitFunctionStart: jest.fn(),
            emitFunctionEnd: jest.fn(),
            emitTestEnd: jest.fn()
        } as unknown as DullahanClient,
        userOptions: dullahanAdapterOptions,
        defaultOptions: {}
    });

    global['api'] = new ApiFactory({
        testId: 'jest',
        test: jest.fn() as unknown as DullahanTest,
        client: {
            emitTestStart: jest.fn(),
            emitFunctionStart: jest.fn(),
            emitFunctionEnd: jest.fn(),
            emitTestEnd: jest.fn()
        } as unknown as DullahanClient,
        adapter,
        userOptions: dullahanApiOptions,
        defaultOptions: {}
    });
});

afterEach(async () => {
    const {
        currentTest: {
            fullName,
            failedExpectations
        }
    } = jasmine;

    if (await adapter.isBrowserOpen()) {
        if (failedExpectations.length) {
            try {
                const filename = `${fullName.replace(/[\s\.]/g, '_').replace(/\W/g, '')}.png`;
                const screenshot = await adapter.screenshotPage();

                await new Promise((resolve, reject) => {
                    writeFile(resolvePath(__dirname, '../../../__artifacts__/jest/', filename), screenshot, 'base64', (error) => {
                        error ? reject(error) : resolve();
                    });
                });
            } catch (error) {
                console.warn(error);
            }
        }

        await adapter.closeBrowser();
    }
});

afterAll(async () => {
    await Promise.all((await adapter.getActiveInstances()).map(async (instance) => {
        if (await instance.isBrowserOpen()) {
            await instance.closeBrowser();
        }
    }));
});
