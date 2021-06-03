import {mkdir, writeFile} from 'fs';
import {resolve as resolvePath} from 'path';
import {pathToFileURL} from 'url';
import {promisify} from 'util';

import {DullahanPlugin} from '../DullahanPlugin';

const writeFileP = promisify(writeFile);
const mkdirP = promisify(mkdir);

export interface Artifact {
    scope: string;
    name: string;
    ext: string;
    data: string;
    mimeType: string;
    encoding: BufferEncoding;
}

export interface StoredArtifact extends Artifact {
    localUrl: URL;
    remoteUrls: URL[];
}

export const saveArtifactToFile = async (artifact: Artifact): Promise<URL> => {
    const {scope, name, ext, encoding, data} = artifact;

    const directoryPath = resolvePath(process.cwd(), `__artifacts__/${scope}`);
    const filePath = resolvePath(directoryPath, `${name}.${ext}`);

    console.log(`Writing file "${filePath}"`);

    try {
        await mkdirP(directoryPath, {recursive: true});
        await writeFileP(filePath, data, {encoding});
    } catch (error) {
        console.log(`Failed to write file "${filePath}": ${error.name}`);
    }

    return pathToFileURL(filePath);
};

export const saveArtifactToRemotes = async (artifact: Artifact, plugins: DullahanPlugin<any, any>[]): Promise<URL[]> => {
    const uploads = plugins.map(async (plugin: DullahanPlugin<any, any>) => plugin.uploadArtifact(artifact));

    return (await Promise.all(uploads)).filter((url): url is URL => !!url);
};
