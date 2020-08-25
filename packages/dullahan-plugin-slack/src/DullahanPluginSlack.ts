import {DullahanPluginSlackDefaultOptions, DullahanPluginSlackUserOptions} from './DullahanPluginSlackOptions';
import {IncomingWebhook} from '@slack/client';
import {
    DullahanClient,
    DullahanError,
    DullahanFunctionEndCall,
    DullahanPlugin,
    DullahanTestEndCall,
    StoredArtifact
} from '@k2g/dullahan';
import {isFailingTest, isSlowTest, isSuccessfulTest, isUnstableTest, Test} from './helpers';

export default class DullahanPluginSlack extends DullahanPlugin<DullahanPluginSlackUserOptions, typeof DullahanPluginSlackDefaultOptions> {

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginSlackUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginSlackDefaultOptions
        });
    }

    public async start(): Promise<void> {
        const {options} = this;
        const {webhook, channel} = options;

        if (typeof webhook !== 'string') {
            throw new DullahanError('Could not send message to Slack: no webhook');
        }

        if (typeof channel !== 'string') {
            throw new DullahanError('Could not send message to Slack: no channel');
        }
    }

    public async processResults(artifacts: StoredArtifact[], dtecs: DullahanTestEndCall[], dfecs: DullahanFunctionEndCall[]): Promise<void> {
        const {webhook, channel, mention, slowTestThreshold, when, attachments, maxPreviews} = this.options;

        const tests: Test[] = dtecs
            .reverse()
            .filter(({testId}, index) => index === dtecs.findIndex((dtec) => dtec.testId === testId))
            .map((dtec) => ({
                ...dtec,
                calls: dfecs
                    .filter(({testId}) => dtec.testId === testId)
                    .map((call) => {
                        const {functionResult} = call;

                        if (typeof functionResult === 'string' && functionResult.length > 1024) {
                            return {
                                ...call,
                                functionResult: '<truncated>'
                            };
                        }

                        return call;
                    })
            }))
            .reverse();

        const failingTests = tests.filter(isFailingTest);
        const unstableTests = tests.filter(isUnstableTest);
        const slowTests = tests.filter(isSlowTest.bind(null, slowTestThreshold));
        const successfulTests = tests.filter(isSuccessfulTest.bind(null, slowTestThreshold));

        const links = artifacts
            .filter(({scope, name, remoteUrls}) => scope.startsWith('dullahan-plugin-report-') && name.includes('report') && remoteUrls.length)
            .map(({scope, remoteUrls}) => {
                const link = remoteUrls[0]
                const name = /report-(.*)/.exec(scope);
                return `<${link}|${name ? name[1] : link}>`
            });

        const {browserstackBuildUrl} = tests.find(({browserstackBuildUrl}) => !!browserstackBuildUrl) ?? {
            browserstackBuildUrl: undefined
        };

        if (browserstackBuildUrl) {
            links.push(`<${browserstackBuildUrl}|browserstack>`);
        }

        const message = {
            blocks: [{
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `${failingTests.length ? mention : ''} New results: ${failingTests.length} failing tests, ${unstableTests.length} unstable tests, ${slowTests.length} slow tests and ${successfulTests.length} successful tests`
                }
            }, {
                type: 'divider'
            }, ...failingTests.slice(0, maxPreviews).map((test) => ({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*${test.testName}*\n${test.error.name}: ${test.error.message}`
                },
                accessory: test.calls
                    .filter(({remoteUrls}) => remoteUrls?.length)
                    .map(({remoteUrls}) => (remoteUrls && {
                        image_url: remoteUrls[0],
                        type: 'image',
                        alt_text: 'screenshot'
                    }))
                    .pop()
            })), {
                type: 'divider'
            }, {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `More information: ${links.join(', ')}`
                }
            }, {
                type: 'divider'
            }],
            attachments: [
                {
                    color: '#000000',
                    fields: Object.entries(attachments).map(([title, value]) => ({
                        title,
                        value: `${value}`,
                        short: true
                    }))
                }
            ]
        };

        if (webhook && (when === 'always' || (failingTests.length === 0 && when === 'success') || (failingTests.length > 0 && when === 'failure'))) {
            console.info(`Dullahan Plugin Slack: sending message to webhook: ${webhook}`);
            const response = await new IncomingWebhook(webhook, {
                link_names: true,
                channel
            }).send(message);
            console.info(`Dullahan Plugin Slack: message sent - response: ${response.text}`);
        }
    }
}
