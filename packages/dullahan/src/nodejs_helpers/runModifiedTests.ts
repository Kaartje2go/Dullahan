import {readFile,pathExists} from 'fs-extra';

export const getChangedFiles = async () : Promise<string[]> => {
    // file created in Dullahan-Tests repo with changed files from current branch using git history in drone build step
    const file = './.changed-files.txt';
    const fileExists = await pathExists(file);

    if (fileExists) {
        const data = await readFile(file, 'utf-8');
        const splitted = data.split('\n');
        // last element is empty line
        splitted.splice(-1);
        return splitted;
    }
    return [];
}

export const testIfOnlyTestsModified = (splited : string[]) : boolean => {
    if (splited.length === 0) {
        return false;
    }
    return splited.some(line => line.startsWith('tests/'));
}

export const testFile = (files: string[], fileToMatch: string) : boolean => {
    return files.some(file => {
        console.log(file, fileToMatch);
        return fileToMatch.endsWith(file)
    });
}
