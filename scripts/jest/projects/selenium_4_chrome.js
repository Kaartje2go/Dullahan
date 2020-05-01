const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_4_chrome',
    displayName: 'Selenium4 Chrome',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_4_chrome.js']
};
