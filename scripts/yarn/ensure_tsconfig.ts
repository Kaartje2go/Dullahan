import {writeFileSync} from 'fs';
import {resolve} from 'path';

import {sync} from 'glob';

sync('packages/*/', {
    cwd: resolve(__dirname, '../../'),
    absolute: true
}).forEach((dir) => {
    writeFileSync(`${dir}/tsconfig.build.json`, `${JSON.stringify({
        extends: '../../tsconfig.build.json',
        include: ['src/**/*'],
        compilerOptions: {
            outDir: './dist'
        }
    }, null, 4)}\n`);
});
