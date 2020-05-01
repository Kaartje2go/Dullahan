const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_4_firefox',
    displayName: 'Selenium4 Firefox',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_4_firefox.js']
};
