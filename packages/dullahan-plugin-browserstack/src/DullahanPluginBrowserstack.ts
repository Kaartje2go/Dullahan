import {Local as BrowserstackLocal} from 'browserstack-local';
import fetch from 'node-fetch';

import {
    DullahanPluginBrowserstackDefaultOptions,
    DullahanPluginBrowserstackUserOptions
} from './DullahanPluginBrowserstackOptions';

import {DullahanClient, DullahanFunctionEndCall, DullahanPlugin, DullahanTestEndCall} from '@k2g/dullahan';

export default class DullahanPluginBrowserstack extends DullahanPlugin<
    DullahanPluginBrowserstackUserOptions,
    typeof DullahanPluginBrowserstackDefaultOptions
> {

    private browserstackBuildUrl?: string;
    private stopBrowserstackLocal?: () => Promise<void>;

    private readonly sessionCache: {
        [testID: string]: string[];
    } = {};

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginBrowserstackUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginBrowserstackDefaultOptions
        });
    }

    public async start(): Promise<void> {
        const {accessKey: key, username: user, useLocal, localOptions} = this.options;

        if (!useLocal) {
            return;
        }

        const browserstack = new BrowserstackLocal();

        await new Promise<void>((resolve, reject) => {
            browserstack.start({
                key,
                user,
                ...localOptions
            }, (error?: Error) => {
                error ? reject(error) : resolve();
            });
        });

        this.stopBrowserstackLocal = async (): Promise<void> => new Promise((resolve, reject) => {
            browserstack.stop((error?: Error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public async onTestEnd(dtec: DullahanTestEndCall): Promise<DullahanTestEndCall> {
        const {options, sessionCache} = this;
        const {testId, testName, error} = dtec;
        const {username, accessKey, removeFailedAfterRetrySuccess} = options;
        const sessionIds = sessionCache[testId];
        const curSessionId = sessionIds[sessionIds.length - 1];

        const requests: Promise<void>[] = [
            fetch(`https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${curSessionId}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: testName,
                    status: error ? 'failed' : 'passed',
                    reason: ''
                })
            }).catch(console.error)
        ];

        if (removeFailedAfterRetrySuccess && sessionIds.length > 1 && !error) {
            requests.push(...sessionIds.slice(0, sessionIds.length - 1).map(async (oldSessionId) => {
                await fetch(`https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${oldSessionId}.json`, {
                    method: 'DELETE'
                }).catch(console.error);
            }));
        }

        await Promise.all(requests);

        return {
            browserstackBuildUrl: this.browserstackBuildUrl,
            browserstackSessionUrl: `${this.browserstackBuildUrl}/sessions/${curSessionId}`,
            ...dtec
        };
    }

    public async onFunctionEnd(dfec: DullahanFunctionEndCall): Promise<DullahanFunctionEndCall> {
        const {browserstackBuildUrl, options} = this;
        const {testId, functionScope, functionName, functionResult} = dfec;
        const {username, accessKey} = options;

        if (functionScope !== 'adapter' || functionName !== 'openBrowser' || !functionResult || !(functionResult as any).sessionId) {
            return dfec;
        }

        const {sessionId} = (functionResult as any);
        if (!this.sessionCache[testId]) {
            this.sessionCache[testId] = [sessionId];
        } else {
            this.sessionCache[testId].push(sessionId);
        }

        if (!browserstackBuildUrl) {
            const response = await fetch(`https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`, {
                method: 'GET'
            }).then((response) => response.json()).catch(console.error);

            if (response) {
                const {automation_session} = response;
                const {browser_url, hashed_id} = automation_session;

                this.browserstackBuildUrl = browser_url.replace(`/${hashed_id}`, '');
            }
        }

        return dfec;
    }

    public async stop(): Promise<void> {
        const {stopBrowserstackLocal} = this;

        await stopBrowserstackLocal?.();
    }
}
