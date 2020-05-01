import {readFileSync} from 'fs';

import {parse} from 'dotenv';

Object.keys(parse(Buffer.from(readFileSync('.env.example')))).forEach((key) => {
    delete process.env[key];
});

jest.setTimeout(15000);
