const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'puppeteer_chromium',
    displayName: 'Puppeteer Chromium',
    setupFiles: ['<rootDir>/scripts/jest/variables/puppeteer_chromium.js']
};
