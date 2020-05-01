const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'puppeteer_firefox',
    displayName: 'Puppeteer Firefox',
    setupFiles: ['<rootDir>/scripts/jest/variables/puppeteer_firefox.js']
};
