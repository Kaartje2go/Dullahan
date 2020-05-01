const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_3_chrome',
    displayName: 'Selenium3 Chrome',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_3_chrome.js']
};
