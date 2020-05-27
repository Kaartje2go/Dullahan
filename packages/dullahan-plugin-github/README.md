# Dullahan Plugin GitHub
Allows Dullahan to share test results on GitHub.

## Table of Contents
- [Getting Started](#getting-started)
- [Plugin Options](#plugin-options)
- [Companion Plugins](#companion-plugins)
- [Frequently Asked Questions](#frequently-asked-questions)
- [License](#license)

## Getting Started
Install this plugin:
```bash
yarn add @k2g/dullahan-plugin-github @k2g/dullahan-plugin-report-markdown
```

Note: Our documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Now that the plugin is installed, you can add it to your Dullahan configuration file:
```js
export default {
    plugins: [
        '@k2g/dullahan-plugin-github',
        '@k2g/dulllahan-plugin-report-markdown'
    ]
}
```

## Plugin Options
| name | type | default | description |
| --- | --- | --- | :--- |
| enableStatusChecks | boolean | true | Enable or disable the submitting of commit status checks |
| enablePullRequestReviews | boolean | false | Enable or disable the submitting of reviews on pull requests |
| enablePullRequestComments | boolean | true | Enable or disable the submitting of comments on pull requests |
| statusName | string | 'Dullahan' | The name for the status to show in GitHub |
| statusUrl | string | `URL of HTML report` or `URL of Markdown report` or `'https://dullahan.io'` | The URL used for the "Details" link on a commit status |
| githubToken | string | `DULLAHAN_PLUGIN_GITHUB_GITHUB_TOKEN`, `GITHUB_TOKEN`, `GH_TOKEN` | The personal access token for GitHub to use |
| repositoryName | string | - | The name of the repository (ex: Dullahan for this repository) |
| repositoryOwner | string | - | The name of the owner of the repository (ex: Kaartje2go for this repository) |
| commitHash | string | - | The target commit's SHA-1 hash |
| commitOwner | string | - | The name of the owner of the commit, only needed if the pull request originates from a fork |
| branchName | string | - | The name of the source branch of the pull request |

To change any of these options, pass along an object containing the options you wish to change to Dullahan:
```js
module.exports = {
    plugins: [
        ['@k2g/dullahan-plugin-github', {
            githubToken: '203d8c15720af0a8dd89f05cd9a637790003fbf2',
            repositoryOwner: 'Kaartje2go',
            repositoryName: 'Dullahan'
        }]
    ]
};
```
## Companion Plugins
* [@k2g/dullahan-plugin-report-markdown](../dullahan-plugin-report-markdown)
* [@k2g/dullahan-plugin-report-html](../dullahan-plugin-report-html)
* [@k2g/dullahan-plugin-aws-s3](../dullahan-plugin-aws-s3)

If the `@k2g/dullahan-plugin-aws-s3` plugin and at least one of `@k2g/dullahan-plugin-report-html` or `@k2g/dullahan-plugin-report-markdown` are installed and configured, the HTML report will be linked to in the commit status. If the HTML report is not available the Markdown report - if available - is linked.

If the `@k2g/dullahan-plugin-report-markdown` plugin is installed, this plugin will also be able to post comments on pull requests with the Markdown as content.

## Frequently Asked Questions
**Question:** Which permissions are required for the GitHub Token?

**Answer:**
* `repo:status`  if `enableStatusChecks` is `true`
* `repo` if `enablePullRequestReviews` or `enablePullRequestComments` is `true`

## License

This plugin is [licensed under GPL-3.0](./LICENSE).
