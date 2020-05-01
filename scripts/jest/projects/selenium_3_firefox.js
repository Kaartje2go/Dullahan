const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_3_firefox',
    displayName: 'Selenium3 Firefox',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_3_firefox.js']
};
