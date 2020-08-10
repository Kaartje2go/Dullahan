# Dullahan Plugin AWS S3
Allows Dullahan to upload artifacts to AWS S3.

## Table of Contents
- [Getting Started](#getting-started)
- [Plugin Options](#plugin-options)
- [Secrets](#secrets)
- [Frequently Asked Questions](#frequently-asked-questions)
- [License](#license)

## Getting Started
Install this plugin:
```bash
yarn add @k2g/dullahan-plugin-aws-s3
```

Note: Our documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Now that the plugin is installed, you can add it to your Dullahan configuration file:
```js
export default {
    plugins: [
        '@k2g/temp-dullahan-plugin-aws-s3'
    ]
}
```

## Plugin Options
| name | type | default | description |
| --- | --- | --- | :--- |
| bucketName | string | - | The name of the bucket to upload everything to |
| region | string | `DULLAHAN_PLUGIN_AWS_S3_AWS_REGION`, `AWS_REGION`, `AWS_DEFAULT_REGION` | The region in which the bucket is located |
| accessKeyId | string | `DULLAHAN_PLUGIN_AWS_S3_AWS_ACCESS_KEY_ID`, `AWS_ACCESS_KEY_ID` | Security credentials for the account used to perform the uploads |
| secretAccessKey | string | `DULLAHAN_PLUGIN_AWS_S3_AWS_SECRET_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` | Security credentials for the account used to perform the uploads |
| useAccessKeys | boolean | true | Whether or not the access keys should be used. |
| secrets | (string or RegExp)[] | `DULLAHAN_PLUGIN_AWS_S3_AWS_SECRET_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` | An optional list of information that you want to be redacted before it is uploaded. Setting this option does not replace the secrets that Dullahan is able to determine at runtime. |

To change any of these options, pass along an object containing the options you wish to change to Dullahan:
```js
export default {
    plugins: [
        ['@k2g/dullahan-plugin-aws-s3', {
            bucketName: 'my-dullahan-artifacts',
            region: 'eu-central-1',
            secrets: ['sensitive-info', /sensitive-info/gim]
        }]
    ]
}
```

## Secrets
This plugin will scan all data before uploading and any secrets that are found within the data will be replaced with `<secret>`. If -for whatever weird reason- your credentials end up in the data: it will not end up in the uploaded files.

That said, you should always limit the permissions of your credentials; preferably even to a single bucket.

The following will automatically (and always) be considered secret:
* `accessKeyId`
* `secretAccessKey`,
* Environment variables with `token`, `key`, `secret` and/or `password` in their names (case-insensitive)

## Frequently Asked Questions
**Question:** I added the plugin, but nothing is being uploaded, what is going on?

**Answer:** It could be that there is simply nothing to upload. To be sure though, check the logs, there may be an issue with your configuration.

**Question:** I get the error `UnrecognizedClientException: The security token included in the request is invalid.`. What can I do?

**Answer:** Dependening on your S3 settings and the environment Dullahan runs in, the `access key` and `secret access key` environment variables should not be used. Sometimes, they are needed for other AWS plugins though, and you _do_ need to set them. You can set `useAccessKeys` to `false` which should fix this issue.

**Question:** Can I use this plugin together with another plugin that also uploads artifacts?

**Answer:** Yes, absolutely.

## License

This plugin is [licensed under GPL-3.0](./LICENSE).
