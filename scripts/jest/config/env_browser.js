const base = require('./shared');

module.exports = {
    ...base,
    testTimeout: 60000,
    testURL: 'http://0.0.0.0:8080',
    globalSetup: '<rootDir>/scripts/jest/setup/before_all_browser.js',
    globalTeardown: '<rootDir>/scripts/jest/setup/after_all_browser.js',
    testMatch: ['**/__tests__/env_browser/**/*.ts'],
    setupFilesAfterEnv: ['<rootDir>/scripts/jest/setup/before_test_browser.ts']
};
