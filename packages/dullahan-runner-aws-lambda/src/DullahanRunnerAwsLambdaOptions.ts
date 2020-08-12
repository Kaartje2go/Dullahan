import {DullahanRunnerDefaultOptions, DullahanRunnerUserOptions} from '@k2g/dullahan';

const {
    DULLAHAN_RUNNER_AWS_LAMBDA_AWS_LAMBDA_FUNCTION_NAME, AWS_LAMBDA_FUNCTION_NAME,
    DULLAHAN_RUNNER_AWS_LAMBDA_AWS_LAMBDA_FUNCTION_VERSION, AWS_LAMBDA_FUNCTION_VERSION,
    DULLAHAN_RUNNER_AWS_LAMBDA_AWS_REGION, AWS_REGION, AWS_DEFAULT_REGION,
    DULLAHAN_RUNNER_AWS_LAMBDA_AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_ID,
    DULLAHAN_RUNNER_AWS_LAMBDA_AWS_SECRET_ACCESS_KEY, AWS_SECRET_ACCESS_KEY
} = process.env;

export type DullahanRunnerAwsLambdaUserOptions = Partial<DullahanRunnerUserOptions & {
    role: 'master' | 'slave';
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    maxConcurrency: number;
    slaveFunctionName: string;
    slaveQualifier: string;
    slaveOptions: {
        file: string;
        [key: string]: unknown;
    };
    useAccessKeys: boolean;
}>;

export const DullahanRunnerAwsLambdaDefaultOptions = {
    ...DullahanRunnerDefaultOptions,
    maxConcurrency: 900,
    role: 'master',
    region: DULLAHAN_RUNNER_AWS_LAMBDA_AWS_REGION || AWS_REGION || AWS_DEFAULT_REGION,
    accessKeyId: DULLAHAN_RUNNER_AWS_LAMBDA_AWS_ACCESS_KEY_ID || AWS_ACCESS_KEY_ID,
    secretAccessKey: DULLAHAN_RUNNER_AWS_LAMBDA_AWS_SECRET_ACCESS_KEY || AWS_SECRET_ACCESS_KEY,
    slaveFunctionName: DULLAHAN_RUNNER_AWS_LAMBDA_AWS_LAMBDA_FUNCTION_NAME || AWS_LAMBDA_FUNCTION_NAME,
    slaveQualifier: DULLAHAN_RUNNER_AWS_LAMBDA_AWS_LAMBDA_FUNCTION_VERSION || AWS_LAMBDA_FUNCTION_VERSION,
    slaveOptions: {},
    useAccessKeys: true,
};

export type DullahanRunnerAwsLambdaOptions =
    DullahanRunnerAwsLambdaUserOptions
    & typeof DullahanRunnerAwsLambdaDefaultOptions;
