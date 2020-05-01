import {readFileSync, writeFileSync} from 'fs';

import {parse} from 'dotenv';

const parseSafely = (filename: string): object => {
    try {
        return parse(Buffer.from(readFileSync(filename)));
    } catch {
        return {};
    }
};


((): void => {
    const example = parseSafely('.env.example');
    const actual = parseSafely('.env');

    const exampleKeys = Object.keys(example);
    const actualKeys = Object.keys(actual);

    let wanted;

    if (actualKeys.length === 0) {
        wanted = example;
    } else if (!exampleKeys.every((key) => actualKeys.includes(key))) {
        wanted = {
            ...example,
            ...actual
        };
    }

    if (wanted !== undefined) {
        writeFileSync('.env', Object.keys(wanted).map((key) => `${key}=${wanted[key]}`).
            join('\n'));
    }
})();


