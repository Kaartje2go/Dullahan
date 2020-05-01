const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'playwright_webkit',
    displayName: 'Playwright Webkit',
    setupFiles: ['<rootDir>/scripts/jest/variables/playwright_webkit.js']
};
