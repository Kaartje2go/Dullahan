import {DullahanPluginGitlabUserOptions, DullahanPluginGitlabDefaultOptions} from './DullahanPluginGitlabOptions';
import fetch from 'node-fetch';
import {
    DullahanPlugin,
    DullahanClient,
    StoredArtifact,
    DullahanTestEndCall,
    DullahanFunctionEndCall
} from '@k2g/dullahan';

export default class DullahanPluginGitlab extends DullahanPlugin<
    DullahanPluginGitlabUserOptions,
    typeof DullahanPluginGitlabDefaultOptions
> {

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginGitlabUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginGitlabDefaultOptions
        });
    }

    public async processResults(artifacts: StoredArtifact[], dtecs: DullahanTestEndCall[], dfecs: DullahanFunctionEndCall[]): Promise<void> {
        const {options} = this;
        const {gitlabToken, projectId, mergeRequestInternalId, enableMergeRequestComments} = options;

        const html = artifacts.find(({scope, name}) => scope === 'dullahan-plugin-report-html' && name === 'report');
        const markdown = artifacts.find(({scope, name}) => scope === 'dullahan-plugin-report-markdown' && name === 'report');
        const reportUrl = html?.remoteUrls[0] ?? markdown?.remoteUrls[0];

        let comment = markdown?.data ?? '[@k2g/dullahan-plugin-report-markdown](https://github.com/Kaartje2go/Dullahan/tree/master/packages/dullahan-plugin-report-markdown) not found';
        const identifier = comment.substring(0, comment.indexOf(']'));

        if (reportUrl) {
            comment += `\n\n[Click here to review the full report.](${reportUrl})`
        }

        const commentId = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestInternalId}/notes`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${gitlabToken}`
            }
        })
            .then((response) => response.json())
            .then((comments: any) => comments.find(({body}) => body.startsWith(identifier)))
            .then((comment) => comment?.id ?? null);

        await fetch(commentId === null
            ? `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestInternalId}/notes`
            : `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestInternalId}/notes/${commentId}`, {
            method: commentId === null ? 'POST' : 'PUT',
            headers: {
                Authorization: `Bearer ${gitlabToken}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({body: comment})
        });
    }
}
