import {DullahanPluginGithubDefaultOptions, DullahanPluginGithubUserOptions} from './DullahanPluginGithubOptions';
import {Octokit} from '@octokit/rest';

import {
    DullahanClient,
    DullahanError,
    DullahanFunctionEndCall,
    DullahanPlugin,
    DullahanTestEndCall,
    StoredArtifact
} from '@k2g/dullahan';
import {isFailingTest, isSlowTest, isSuccessfulTest, isUnstableTest, Test} from './helpers';

export default class DullahanPluginGithub extends DullahanPlugin<DullahanPluginGithubUserOptions,
    typeof DullahanPluginGithubDefaultOptions> {

    private lastStatusCheck = Date.now() - 60000;
    private successfulTestsCounter = 0;
    private failedTestsCounter = 0;
    private failedTests: string[] = [];

    private readonly octokit = new Octokit({
        auth: `token ${this.options.githubToken}`
    });

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginGithubUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginGithubDefaultOptions
        });
    }

    public async start(): Promise<void> {
        const {enableStatusChecks, enableDetailedStatusChecks, statusName, statusUrl} = this.options;

        const promises: Promise<void>[] = [];

        if (enableStatusChecks || enableDetailedStatusChecks) {
            promises.push(this.setStatus({
                state: 'pending'
            }));
        }

        if (enableDetailedStatusChecks) {
            promises.push(
                this.setStatus({
                    state: 'pending',
                    name: `${statusName} / Failing`
                }),
                this.setStatus({
                    state: 'pending',
                    name: `${statusName} / Unstable`
                }),
                this.setStatus({
                    state: 'pending',
                    name: `${statusName} / Slow`
                }),
                this.setStatus({
                    state: 'pending',
                    name: `${statusName} / Successful`
                })
            );
        }

        await Promise.all(promises);
    }

    public async onTestEnd(dtec: DullahanTestEndCall): Promise<DullahanTestEndCall> {
        const {options, lastStatusCheck} = this;
        const {enableStatusChecks, enableDetailedStatusChecks} = options;
        const {error} = dtec;

        if (error) {
            // Make sure to count failures only once
            if (!this.failedTests.includes(dtec.testId)) {
                this.failedTestsCounter++;
                this.failedTests.push(dtec.testId);
            }
        } else {
            this.successfulTestsCounter++;
            // If this test was marked as a failure before, decrease the failed tests count
            if (this.failedTests.includes(dtec.testId)) {
                this.failedTestsCounter--;
            }
        }

        if ((enableStatusChecks || enableDetailedStatusChecks) && lastStatusCheck + 15000 > Date.now()) {
            await this.setStatus({
                state: 'pending',
                description: `${this.successfulTestsCounter}/${this.successfulTestsCounter + this.failedTestsCounter} tests have passed`
            })
        }

        return dtec;
    }

    public async processResults(artifacts: StoredArtifact[], dtecs: DullahanTestEndCall[], dfecs: DullahanFunctionEndCall[], earlyTermination: boolean): Promise<void> {
        const {options} = this;
        const {enableStatusChecks, enablePullRequestComments, enablePullRequestReviews, enableDetailedStatusChecks, slowTestThreshold, statusName, statusUrl} = options;

        const html = artifacts.find(({scope, name}) => scope === 'dullahan-plugin-report-html' && name === 'report');
        const markdown = artifacts.find(({scope, name}) => scope === 'dullahan-plugin-report-markdown' && name === 'report');
        const url = html?.remoteUrls[0] ?? markdown?.remoteUrls[0] ?? new URL( statusUrl);

        let comment = markdown?.data ?? '[@k2g/dullahan-plugin-report-markdown](https://github.com/Kaartje2go/Dullahan/tree/master/packages/dullahan-plugin-report-markdown) not found';

        if (html?.remoteUrls?.[0]) {
            comment += `\n[Continue to review full report.](${html?.remoteUrls[0]})`
        }

        const dedupedDtecs = dtecs.reduce((acc: DullahanTestEndCall[], current: DullahanTestEndCall) => {
            const previouslyFound = acc.find((prev) => prev.testId === current.testId);
            if (!previouslyFound) {
                acc.push(current);
            } else if (previouslyFound.error && !current.error) {
                const index = acc.indexOf(previouslyFound);
                acc[index] = current;
            }
            return acc;
        }, []);

        const tests: Test[] = dedupedDtecs.map((dtec) => ({
            ...dtec,
            calls: dfecs
                .filter(({testId}) => dtec.testId === testId)
                .map((call) => {
                    const {functionResult} = call;

                    if (typeof functionResult === "string" && functionResult.length > 1024) {
                        return {
                            ...call,
                            functionResult: "<truncated>",
                        };
                    }

                    return call;
                })
        }));

        const failingTests = tests.filter(isFailingTest).length;
        const unstableTests = tests.filter(isUnstableTest).length;
        const slowTests = tests.filter(isSlowTest.bind(null, slowTestThreshold)).length;
        const successfulTests = tests.filter(isSuccessfulTest.bind(null, slowTestThreshold)).length;
        const allTests = failingTests + unstableTests + slowTests + successfulTests;

        const promises: Promise<void>[] = [];

        if (enableStatusChecks || enableDetailedStatusChecks) {
            promises.push(this.setStatus({
                state: earlyTermination || failingTests ? 'failure' : 'success',
                description: earlyTermination
                    ? 'Dullahan terminated early'
                    :`${successfulTests + slowTests + unstableTests}/${allTests} tests have passed`,
                url
            }));

            if (enableDetailedStatusChecks) {
                promises.push(
                    this.setStatus({
                        state: earlyTermination || failingTests ? 'failure' : 'success',
                        name: `${statusName} / Failing`,
                        url
                    }),
                    this.setStatus({
                        state: earlyTermination || unstableTests ? 'failure' : 'success',
                        name: `${statusName} / Unstable`,
                        url
                    }),
                    this.setStatus({
                        state: earlyTermination || slowTests ? 'failure' : 'success',
                        name: `${statusName} / Slow`,
                        url
                    }),
                    this.setStatus({
                        state: earlyTermination || !successfulTests ? 'failure' : 'success',
                        name: `${statusName} / Successful`,
                        url
                    })
                );
            }
        }

        if (enablePullRequestReviews) {
            promises.push(this.setReview(comment));
        }

        if (enablePullRequestComments) {
            promises.push(this.setComment(comment));
        }

        await Promise.all(promises);
    }

    private async setStatus({state, name, description, url}: {
        state: 'pending' | 'failure' | 'success';
        description?: string;
        name?: string;
        url?: URL;
    }): Promise<void> {
        const {options, octokit} = this;
        const {repositoryName, repositoryOwner, commitHash, statusUrl, statusName} = options;

        if (typeof repositoryOwner !== 'string') {
            throw new DullahanError('Could not set status on Github: no repositoryOwner');
        }

        if (typeof repositoryName !== 'string') {
            throw new DullahanError('Could not set status on Github: no repositoryName');
        }

        if (typeof commitHash !== 'string') {
            throw new DullahanError('Could not set status on Github: no commitHash');
        }

        await octokit.repos.createCommitStatus({
            owner: repositoryOwner,
            repo: repositoryName,
            sha: commitHash,
            state,
            context: name ?? statusName,
            target_url: url?.href ?? statusUrl,
            description: description ?? ''
        });
    }

    private async setComment(comment: string): Promise<void> {
        const {options, octokit} = this;
        const {repositoryName, repositoryOwner, commitOwner, branchName} = options;
        const identifier = comment.substring(0, comment.indexOf(']'));

        if (typeof repositoryOwner !== 'string') {
            throw new DullahanError('Could not add/update comment on Github: no repositoryOwner');
        }

        if (typeof repositoryName !== 'string') {
            throw new DullahanError('Could not add/update comment on Github: no repositoryName');
        }

        if (typeof branchName !== 'string') {
            throw new DullahanError('Could not add/update comment on Github: no branchName');
        }

        const {data: pullRequests} = await octokit.pulls.list({
            owner: repositoryOwner,
            repo: repositoryName,
            head: `${commitOwner ?? repositoryOwner}:${branchName}`,
            state: 'open'
        });
        const pullRequestNumber = pullRequests[0]?.number;

        if (!pullRequestNumber) {
            console.info('No open pull request to comment on');
            return;
        }

        const {data: comments} = await octokit.issues.listComments({
            owner: repositoryOwner,
            repo: repositoryName,
            issue_number: pullRequestNumber
        });
        const commentId = comments.find(({body}) => body.includes(identifier))?.id;
        if (typeof commentId === 'number') {
            try {
                await octokit.issues.updateComment({
                    owner: repositoryOwner,
                    repo: repositoryName,
                    comment_id: commentId,
                    body: comment
                });
            } catch (error) {
                console.error('Error updating Github comment', error);
            }
        } else {
            try {
                await octokit.issues.createComment({
                    owner: repositoryOwner,
                    repo: repositoryName,
                    issue_number: pullRequestNumber,
                    body: comment
                });
            } catch (error) {
                console.error('Error creating Github comment', error);
            }
        }
    }

    private async setReview(comment: string): Promise<void> {
        const {options, octokit, failedTestsCounter} = this;
        const {repositoryName, repositoryOwner, commitOwner, branchName} = options;

        if (typeof repositoryOwner !== 'string') {
            throw new DullahanError('Could not add review on Github: no repositoryOwner');
        }

        if (typeof repositoryName !== 'string') {
            throw new DullahanError('Could not add review on Github: no repositoryName');
        }

        if (typeof branchName !== 'string') {
            throw new DullahanError('Could not add review on Github: no branchName');
        }

        const {data: pullRequests} = await octokit.pulls.list({
            owner: repositoryOwner,
            repo: repositoryName,
            head: `${commitOwner ?? repositoryOwner}:${branchName}`,
            state: 'open'
        });
        const pullRequestNumber = pullRequests[0]?.number;

        await octokit.pulls.createReview({
            owner: repositoryOwner,
            repo: repositoryName,
            pull_number: pullRequestNumber,
            body: comment,
            event: failedTestsCounter ? 'REQUEST_CHANGES' : 'APPROVE'
        });
    }
}
