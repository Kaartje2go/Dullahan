# Dullahan
Work in progress, lots of (currently) private code is being transferred bit by bit :-)

## Browser Support
We test against a wide range of browsers to make sure Dullahan doesn't accidentally break something that used to be work. However, we cannot test against every browser version, as that would either be crazy expensive or take weeks to complete between every release. For example, all releases are tested to work with Edge 12 and Edge 18, but versions in between are not tested. If both Edge 12 and Edge 18 work, we assume Edge 13 through 17 will also work.

The versions listed in this table are the versions that Dullahan is guaranteed to work with.

|  | Selenium 3 | Selenium 4 | Puppeteer | Playwright |
| --- | :---: | :---: | :---: | :---: |
| Internet Explorer | 11 | 11 | X | X |
| Edge (EdgeHTML) | 12 - 18 | 12 - 18 | X | X |
| Edge (Chromium) | ?? - ?? | ?? - ?? | ? | ? |
| Firefox | ?? - latest | ?? - latest | nightly | nightly |
| Chrome | ?? - latest | ?? - latest | latest | latest |
| Chromium | ?? - ?? | ?? - ?? | latest | latest |
| Safari | ?? - ?? | ?? - latest | X | X |
| WebKit | ?? - ?? | ?? - ?? | X | latest |
| Opera (Presto) | ?? - ?? | ?? - ?? | X | X |
| Opera (Chromium) | ?? - ?? | ?? - ?? | ? | ? |

There are a few considerations to take into account:
* Headless mode is not supported by Internet Explorer 11;
* Offline simulation is not supported by Selenium 3 and Selenium 4;
* Firefox support for Puppeteer and Playwright is still experimental and should be considered unstable;

## Adapters: Selenium, Puppeteer and Playwright
* [@k2g/dullahan-adapter-selenium-3](./packages/dullahan-adapter-selenium-3)
* [@k2g/dullahan-adapter-selenium-4](./packages/dullahan-adapter-selenium-4)
* [@k2g/dullahan-adapter-puppeteer](./packages/dullahan-adapter-puppeteer)
* [@k2g/dullahan-adapter-playwright](./packages/dullahan-adapter-playwright)

Selenium supports an incredibly wide range of browsers, but not all browsers support the same Selenium versions and the drivers for each browser are horrible inconsistent in behaviour. Puppeteer and Playwright are a lot more consistent and slightly faster, but do not support as many browsers and also don't play well with tools like Browserstack.

Instead of creating yet another protocol, Dullahan simply wraps around these existing protocols with a custom API. Each function in Dullahan's API is tested to behave exactly the same for each of these protocols, allowing you to switch between them at will, without having to change any of your code.

## Runners: Standard, Development and AWS-Lambda
* [@k2g/dullahan-runner-standard](./packages/dullahan-runner-standard)
* [@k2g/dullahan-runner-development](./packages/dullahan-runner-development)
* [@k2g/dullahan-runner-aws-lambda](./packages/dullahan-runner-aws-lambda)

... TODO

## Plugins: AWS S3
* [@k2g/dullahan-plugin-aws-s3](./packages/dullahan-plugin-aws-s3)

... TODO

## Plugins: HTML, Markdown, JSON
* [@k2g/dullahan-plugin-report-html](./packages/dullahan-plugin-report-html)
* [@k2g/dullahan-plugin-report-markdown](./packages/dullahan-plugin-report-markdown)
* [@k2g/dullahan-plugin-report-json](./packages/dullahan-plugin-report-json)

... TODO

## Plugins: Other

| Name | Summary|
| :--- | :--- |
| [@k2g/dullahan-plugin-browserstack](./packages/dullahan-plugin-browserstack) | Allows Dullahan to manage Browserstack |
| [@k2g/dullahan-plugin-github](./packages/dullahan-plugin-github) | Allows Dullahan to share test results on GitHub |
| [@k2g/dullahan-plugin-gitlab](./packages/dullahan-plugin-gitlab) | |
| [@k2g/dullahan-plugin-slack](./packages/dullahan-plugin-slack) | Allows Dullahan to send messages to Slack |
| [@k2g/dullahan-plugin-xvfb](./packages/dullahan-plugin-xvfb) | Allows Dullahan to manage Xvfb by starting, stopping and/or re-using a virtual frame buffer whenever Dullahan needs it |
