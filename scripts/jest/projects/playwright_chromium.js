const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'playwright_chromium',
    displayName: 'Playwright Chromium',
    setupFiles: ['<rootDir>/scripts/jest/variables/playwright_chromium.js']
};
