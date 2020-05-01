const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_3_ie11',
    displayName: 'Selenium3 IE 11',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_3_ie11.js']
};
