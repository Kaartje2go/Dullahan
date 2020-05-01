import {readFileSync, writeFileSync} from 'fs';
import {resolve} from 'path';

import {sync} from 'glob';

const license = readFileSync(resolve(__dirname, '../../LICENSE')).toString();

sync('packages/*/', {
    cwd: resolve(__dirname, '../../'),
    absolute: true
}).forEach((dir) => {
    writeFileSync(`${dir}/LICENSE`, license);
});
