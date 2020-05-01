const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_3_safari',
    displayName: 'Selenium3 Safari',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_3_safari.js']
};
