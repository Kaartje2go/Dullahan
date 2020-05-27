# Dullahan Plugin Xvfb
Allows Dullahan to manage Xvfb by starting, stopping and/or re-using a virtual frame buffer whenever Dullahan needs it.

## Table of Contents
- [Getting Started](#getting-started)
- [Plugin Options](#plugin-options)
- [Frequently Asked Questions](#frequently-asked-questions)
- [License](#license)

## Getting Started
Install this plugin:
```bash
yarn add @k2g/dullahan-plugin-xvfb
```

Note: Our documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Now that the plugin is installed, you can add it to your Dullahan configuration file:
```js
export default {
    plugins: [
        '@k2g/dullahan-plugin-xvfb'
    ]
}
```

## Plugin Options
This plugin uses [xvfb](https://yarnpkg.com/en/package/xvfb) internally and passes through all options given to it. A value of `-` means that the plugin leaves it up to `xvfb` to decide.

| name | type | default | description |
| --- | --- | --- | :--- |
| displayNum | integer | - |  See [xvfb](https://yarnpkg.com/en/package/xvfb) |
| reuse | boolean | - | See [xvfb](https://yarnpkg.com/en/package/xvfb) |
| timeout | integer | - | See [xvfb](https://yarnpkg.com/en/package/xvfb) |
| silent | boolean | - | See [xvfb](https://yarnpkg.com/en/package/xvfb) |
| xvfb_args | string | - | See [xvfb](https://yarnpkg.com/en/package/xvfb) |

To change any of these options, pass along an object containing the options you wish to change to Dullahan:
```js
export default {
    plugins: [
        ['@k2g/dullahan-plugin-xvfb', {
            displayNum: 13
        }]
    ]
}
```

## Frequently Asked Questions
**Question:** What happens if I use this plugin on a system that does not have or support Xvfb?

**Answer:** Dullahan will display an error stating that Xvfb failed to start and will then shut down.

## License

This plugin is [licensed under GPL-3.0](./LICENSE).
