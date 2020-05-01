const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_4_edge',
    displayName: 'Selenium4 Edge',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_4_edge.js']
};
