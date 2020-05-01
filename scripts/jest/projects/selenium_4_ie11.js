const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_4_ie11',
    displayName: 'Selenium4 IE 11',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_4_ie11.js']
};
