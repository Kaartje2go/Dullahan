import {
    DullahanPluginReportJsonDefaultOptions,
    DullahanPluginReportJsonUserOptions
} from './DullahanPluginReportJsonOptions';

import {
    Artifact,
    DullahanClient,
    DullahanFunctionEndCall,
    DullahanPlugin,
    DullahanTestEndCall
} from '@k2g/dullahan';

export default class DullahanPluginReportJson extends DullahanPlugin<DullahanPluginReportJsonUserOptions,
    typeof DullahanPluginReportJsonDefaultOptions> {

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginReportJsonUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginReportJsonDefaultOptions
        });
    }

    public async getArtifacts(dtecs: DullahanTestEndCall[], dfecs: DullahanFunctionEndCall[]): Promise<Artifact[]> {
        const dedupedDtecs = dtecs.reduce((acc: DullahanTestEndCall[], current: DullahanTestEndCall) => {
            const previouslyFound = acc.find(prev => prev.testId === current.testId);
            if (!previouslyFound) {
                acc.push(current);
            } else if (previouslyFound.error && !current.error) {
                const index = acc.indexOf(previouslyFound);
                acc[index] = current;
            }
            return acc;
        }, []);

        const tests = dedupedDtecs
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
            }));

        return [{
            scope: 'dullahan-plugin-report-json',
            name: 'report',
            ext: 'json',
            encoding: 'utf-8',
            mimeType: 'application/json',
            data: JSON.stringify(tests, null, 4)
        }];
    }
}
