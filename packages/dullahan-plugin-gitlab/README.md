# Dullahan Plugin GitLab
Allows Dullahan to share test results on GitLab.

## Table of Contents
- [Getting Started](#getting-started)
- [Plugin Options](#plugin-options)
- [Companion Plugins](#companion-plugins)
- [Frequently Asked Questions](#frequently-asked-questions)
- [License](#license)

## Getting Started
Install this plugin:
```bash
yarn add @k2g/dullahan-plugin-gitlab @k2g/dullahan-plugin-report-markdown
```

Note: Our documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Now that the plugin is installed, you can add it to your Dullahan configuration file:
```js
export default {
    plugins: [
        '@k2g/dullahan-plugin-gitlab',
        '@k2g/dulllahan-plugin-report-markdown'
    ]
}
```

## Plugin Options
| name | type | default | description |
| --- | --- | --- | :--- |
| gitlabToken | string | `DULLAHAN_PLUGIN_GITLAB_GITLAB_TOKEN`, `GITLAB_TOKEN` | The personal access token for GitLab to use |
| enableMergeRequestComments | boolean | true | Enable or disable the submitting of comments on pull requests |
| projectId | string or number | - | The project ID of your repository |
| mergeRequestInternalId | string or number | - | The internal ID of the merge request you're testing |

To change any of these options, pass along an object containing the options you wish to change to Dullahan:
```js
export default {
    plugins: [
        ['@k2g/dullahan-plugin-gitlab', {
            projectId: 12345678,
            mergeRequestInternalId: 'Dullahan'
        }]
    ]
}
```
## Companion Plugins
* [@k2g/dullahan-plugin-report-markdown](../dullahan-plugin-report-markdown)
* [@k2g/dullahan-plugin-report-html](../dullahan-plugin-report-html)
* [@k2g/dullahan-plugin-aws-s3](../dullahan-plugin-aws-s3)

If the `@k2g/dullahan-plugin-aws-s3` plugin and at least one of `@k2g/dullahan-plugin-report-html` or `@k2g/dullahan-plugin-report-markdown` are installed and configured, the HTML report will be linked to in the commit status. If the HTML report is not available the Markdown report - if available - is linked.

If the `@k2g/dullahan-plugin-report-markdown` plugin is installed, this plugin will also be able to post comments on pull requests with the Markdown as content.

## Frequently Asked Questions
**Question:** Which permissions are required for the GitLab Token?

**Answer:**
* `repo:status`  if `enableStatusChecks` is `true`
* `repo` if `enablePullRequestReviews` or `enablePullRequestComments` is `true`

## License

This plugin is [licensed under GPL-3.0](./LICENSE).
