const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'playwright_firefox',
    displayName: 'Playwright Firefox',
    setupFiles: ['<rootDir>/scripts/jest/variables/playwright_firefox.js']
};
