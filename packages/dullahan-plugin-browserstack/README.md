# Dullahan Plugin Browserstack
Allows Dullahan to manage Browserstack.

While this plugin is not needed to be able to use Dullahan on Browserstack, it does add the following functionality:
* Tests in Browserstack will show the test name, rather than the session ID;
* Tests in Browserstack will show `success` or `failure` statuses;
* Browserstack will be able to test against localhost, so your website/webapp does not even need to be live;
* Browserstack will be able to bypass an IP-whitelist on your server by using the system Dullahan is running on as a proxy;
* This plugin shares some data with other plugins, so that reporting plugins can link to failed tests on Browserstack.

## Table of Contents
- [Getting Started](#getting-started)
- [Plugin Options](#plugin-options)
- [Frequently Asked Questions](#frequently-asked-questions)
- [License](#license)

## Getting Started
Install this plugin:
```bash
yarn add @k2g/dullahan-plugin-browserstack
```

And make sure you have at least one of these installed:

```bash
yarn add @k2g/dullahan-adapter-selenium-3
yarn add @k2g/dullahan-adapter-selenium-4
```

Note: Our documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Now that the plugin is installed, you can add it to your Dullahan configuration file:
```js
export default {
    runner: [
        '@k2g/dullahan-runner-standard', {
            // Or more, your choice
            maxConcurrency: 1
        }
    ],
    adapter: ['@k2g/dullahan-adapter-selenium-3', {
        browserName: 'chrome',
        seleniumRemoteUrl: 'https://hub-cloud.browserstack.com/wd/hub',
        rawCapabilities: {

            // Operating system of the remote machine
            os: 'Windows',

            // Operating system version of the remote machine
            os_version: '10',

            // The resolution of the remote machine, _not_ the browser's window size
            resolution: '1920x1080',

            // Name of the browser on the remote machine
            browserName: 'Chrome',

            // Version of the browser on the remote machine
            browser_version: '81.0',

            // The build ID (preferably unique)
            build: `Chrome at ${Date.now()}`,

            // The project this build belongs to
            project: 'Dullahan-Tests',

            // This version must match the adapter you've chosen
            'browserstack.selenium_version': '3.6.0',

            // This version _must_ be provided for Dullahan to work correctly
            'browserstack.chrome.driver': '81.0.4044.69',

            // Must be set to true to be able to test on localhost
            'browserstack.local': 'false',

            // Collect and show browser console information on Browserstack
            'browserstack.console': 'verbose',

            // Collect and show network logs on Browserstack
            'browserstack.networkLogs': 'true',

            // Set the timezone of the remote machine
            'browserstack.timezone': 'Europe/Amsterdam',

            // Your Browserstack credentials
            'browserstack.user': BROWSERSTACK_USERNAME,
            'browserstack.key': BROWSERSTACK_ACCESS_KEY,
        }
    }],
    plugins: [
        '@k2g/dullahan-plugin-browserstack'
    ]
}
```

## Plugin Options
This plugin uses [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) internally and passes through almost all options given to it. A value of `-` means that the plugin leaves it up to `browserstack-local` to decide.

Next to that, the Selenium adapter will also need some options to connect with Browserstack. You can use the example above as a template and use the [Capabilities Generator](https://www.browserstack.com/automate/capabilities) to tailor it to your needs.

| name | type | default | description |
| --- | --- | --- | :--- |
| useLocal | boolean | false | Tunnel requests through your local network |
| removeFailedAfterRetrySuccess | boolean | true | Remove "failed" tests after they have passed a successful retry |
| username | string | BROWSERSTACK_USERNAME | Your Browserstack username |
| accessKey | string | BROWSERSTACK_ACCESS_KEY | Your Browserstack access key |
| localOptions.verbose | boolean | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.force | boolean | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.only | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.onlyAutomate | boolean | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.forceLocal | boolean | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.localIdentifier | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.folder | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.proxyHost | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.proxyPort | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.proxyUser | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.proxyPass | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.forceProxy | boolean | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.logFile | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.parallelRuns | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |
| localOptions.binarypath | string | - |  See [browserstack-local](https://yarnpkg.com/en/package/browserstack-local) |

To change any of these options, pass along an object containing the options you wish to change to Dullahan:
```js
export default {
    plugins: [
        ['@k2g/dullahan-plugin-browserstack', {
            useLocal: true,
            localOptions: {
                forceLocal: true
            }
        }]
    ]
}
```

## Frequently Asked Questions
**Question:** Can I use this with Puppeteer or Playwright?

**Answer:** No, not until Browserstack starts supporting them.

**Question:** Can I use Dullahan to run tests in parallel on Browserstack?

**Answer:** Yes, provided your Browserstack subscription also allows it.

## License

This plugin is [licensed under GPL-3.0](./LICENSE).
