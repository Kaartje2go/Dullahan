const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_4_safari',
    displayName: 'Selenium4 Safari',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_4_safari.js']
};
