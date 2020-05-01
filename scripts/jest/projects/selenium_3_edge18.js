const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_3_edge18',
    displayName: 'Selenium3 Edge 18',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_3_edge18.js']
};
