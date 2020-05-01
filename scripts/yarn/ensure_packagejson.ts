import {writeFileSync} from 'fs';
import {resolve} from 'path';

import {sync} from 'glob';

sync('packages/*/', {
    cwd: resolve(__dirname, '../../'),
    absolute: true
}).map((dir: string) => ({
    filepath: `${dir}/package.json`,
    dirname: dir.substring(dir.lastIndexOf('/') + 1),
    contents: require(`${dir}/package.json`)
})).forEach(({filepath, dirname, contents}) => {
    writeFileSync(filepath, `${JSON.stringify({
        ...contents,
        version: '0.0.0',
        name: `@k2g/${dirname}`,
        license: 'GPL-3.0',
        main: 'dist/index.js',
        files: ['/dist'],
        repository: 'https://github.com/Kaartje2go/Dullahan',
        scripts: {
            ...contents.scripts,
            'clean-code': [
                'rimraf \'./dist\'',
                'rimraf \'./src/**/*.d.ts\'',
                'rimraf \'./src/**/*.js\'',
                'rimraf \'./src/**/*.js.map\''
            ].join('; '),
            'compile-code': 'tsc -p ./tsconfig.build.json'
        }
    }, null, 2)}\n`);
});
