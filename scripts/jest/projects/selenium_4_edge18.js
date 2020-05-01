const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_4_edge18',
    displayName: 'Selenium4 Edge 18',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_4_edge18.js']
};
