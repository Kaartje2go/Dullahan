const base = require('./shared');

module.exports = {
    ...base,
    testTimeout: 30000,
    testMatch: [
        '**/__tests__/env_nodejs/**/*.ts',
        '**/packages/*/__tests__/**/*.ts'
    ],
    setupFilesAfterEnv: ['<rootDir>/scripts/jest/setup/before_test_nodejs.ts']
};
