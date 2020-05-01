const {
    BROWSERSTACK_USERNAME,
    BROWSERSTACK_ACCESS_KEY
} = process.env;

export default {
    runner: [
        '@kaartje2go/temp-dullahan-runner-standard', {
            rootDirectories: ['./__tests__/env_dullahan'],
            includeRegexes: [/\.ts$/i],
            excludeRegexes: [],
            includeGlobs: [],
            excludeGlobs: [],
            minSuccesses: 1,
            maxAttempts: 1,
            maxConcurrency: 1
        }
    ],
    adapter: [
        '@kaartje2go/temp-dullahan-adapter-selenium-4', {
            headless: false,
            maximizeWindow: true,
            browserName: 'chrome',
            requireDriver: 'chromedriver',
            seleniumRemoteUrl: 'https://hub-cloud.browserstack.com/wd/hub',
            rawCapabilities: {
                os: 'Windows',
                os_version: '10',
                browserName: 'Chrome',
                browser_version: '81.0',
                project: 'DullahanStephan',
                build: `Stephan Test`,
                resolution: '1920x1080',
                'browserstack.local': 'false',
                'browserstack.console': 'verbose',
                'browserstack.networkLogs': 'true',
                'browserstack.timezone': 'Europe/Amsterdam',
                'browserstack.selenium_version': '4.0.0-alpha-2',
                'browserstack.chrome.driver': '81.0.4044.69',
                'browserstack.user': BROWSERSTACK_USERNAME,
                'browserstack.key': BROWSERSTACK_ACCESS_KEY,
            }
        }
    ],
    plugins: [
        //'@kaartje2go/temp-dullahan-plugin-github',
        //'@kaartje2go/temp-dullahan-plugin-xvfb',
        '@kaartje2go/temp-dullahan-plugin-report-json',
        '@kaartje2go/temp-dullahan-plugin-report-html',
        '@kaartje2go/temp-dullahan-plugin-report-markdown',
        '@kaartje2go/temp-dullahan-plugin-browserstack',
        /*['@kaartje2go/temp-dullahan-plugin-aws-s3', {
            bucketName: 'dullahan-artifacts-test'
        }]*/
    ]
};
