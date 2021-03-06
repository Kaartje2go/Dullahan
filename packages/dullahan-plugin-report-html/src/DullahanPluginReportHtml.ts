import {
    DullahanPluginReportHtmlDefaultOptions,
    DullahanPluginReportHtmlUserOptions,
} from "./DullahanPluginReportHtmlOptions";
import { render } from "ejs";
import { promisify } from "util";
import { resolve as resolvePath } from "path";
import {
    isFailingTest,
    isSlowTest,
    isSuccessfulTest,
    isUnstableTest,
    Test,
} from "./helpers";
import { readFile } from "fs";

import {
    Artifact,
    DullahanClient,
    DullahanError,
    DullahanFunctionEndCall,
    DullahanPlugin,
    DullahanTestEndCall,
    isAbsolutePath,
    isRelativePath
} from "@k2g/dullahan";
export default class DullahanPluginReportHtml extends DullahanPlugin<
    DullahanPluginReportHtmlUserOptions,
    typeof DullahanPluginReportHtmlDefaultOptions
> {

    private startTime: number;
    private readonly filename;
    private readonly templatePromise: Promise<string>;

    public constructor(args: {
        client: DullahanClient;
        userOptions: DullahanPluginReportHtmlUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanPluginReportHtmlDefaultOptions,
        });

        if (!this.options.template) {
            this.filename = resolvePath(__dirname, '../template/report.ejs');
        } else if (this.options.template.includes('<')) {
            this.filename = 'report.ejs';
            this.templatePromise = Promise.resolve(this.options.template);
        } else if (isRelativePath(this.options.template)) {
            this.filename = resolvePath(process.cwd(), this.options.template)
        } else if (isAbsolutePath(this.options.template)) {
            this.filename = resolvePath(this.options.template);
        } else {
            throw new DullahanError('Loading templates from node_modules is not (yet) supported');
        }

        this.templatePromise ??= promisify(readFile)(this.filename).then((buffer) => buffer.toString());
        this.startTime = Date.now();
    }

    public async getArtifacts(
        dtecs: DullahanTestEndCall[],
        dfecs: DullahanFunctionEndCall[]
    ): Promise<Artifact[]> {
        const { options, filename, templatePromise } = this;
        const { slowTestThreshold } = options;

        const dedupedDtecs = dtecs.reduce(
            (acc: DullahanTestEndCall[], current: DullahanTestEndCall) => {
                const previouslyFound = acc.find(
                    (prev) => prev.testId === current.testId
                );
                if (!previouslyFound) {
                    acc.push(current);
                } else if (previouslyFound.error && !current.error) {
                    const index = acc.indexOf(previouslyFound);
                    acc[index] = current;
                }
                return acc;
            },
            []
        );

        const tests: Test[] = dedupedDtecs.map((dtec) => ({
            ...dtec,
            calls: dfecs
                .filter(({ testId }) => dtec.testId === testId)
                .map((call) => {
                    const { functionResult } = call;

                    if (
                        typeof functionResult === "string" &&
                        functionResult.length > 1024
                    ) {
                        return {
                            ...call,
                            functionResult: "<truncated>",
                        };
                    }

                    return call;
                }),
        }));

        const failingTests = tests.filter(isFailingTest);
        const unstableTests = tests.filter(isUnstableTest);
        const slowTests = tests.filter(
            isSlowTest.bind(null, slowTestThreshold)
        );
        const successfulTests = tests.filter(
            isSuccessfulTest.bind(null, slowTestThreshold)
        );

        const add = (accumulator, test) => {
            return (
                accumulator +
                (parseInt(test.timeEnd, 10) -
                parseInt(test.timeStart, 10)) / 1000
            );
        };

        const totalTimeTests = tests.reduce(add, 0);
        const totalRunningTime = (Date.now() - this.startTime) / 1000

        return [
            {
                scope: "dullahan-plugin-report-html",
                name: "report",
                ext: "html",
                encoding: "utf-8",
                mimeType: "text/html",
                data: render(
                    await templatePromise,
                    {
                        totalRunningTime,
                        totalTimeTests,
                        failingTests,
                        unstableTests,
                        slowTests,
                        successfulTests,
                        ...options,
                        config: {
                            ...this.client.config,
                        },
                    },
                    {
                        filename,
                        rmWhitespace: true,
                    }
                ),
            },
        ];
    }
}
