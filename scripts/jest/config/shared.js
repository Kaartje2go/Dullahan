module.exports = {
    cache: false,
    silent: true,
    verbose: true,
    rootDir: '../../..',
    roots: [
        '<rootDir>/packages',
        '<rootDir>/__tests__'
    ],
    collectCoverageFrom: ['**/packages/*/src/**/*.ts'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/browser_helpers/'
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: ['/node_modules/(?!@)/'],
    snapshotResolver: '<rootDir>/scripts/jest/setup/custom_snapshot_resolver.js',
    moduleNameMapper: {
        '@k2g/([a-z0-9-]+)$': '<rootDir>/packages/$1/src/index.ts'
    }
};
