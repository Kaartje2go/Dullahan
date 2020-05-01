const base = require('../config/env_browser');

module.exports = {
    ...base,
    name: 'selenium_3_edge',
    displayName: 'Selenium3 Edge',
    setupFiles: ['<rootDir>/scripts/jest/variables/selenium_3_edge.js']
};
