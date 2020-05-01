/*
copy(Array.from(document.querySelectorAll('ul li a')).filter(({ href }) => /\/rules\//.test(href)).map(({ href }) => [
    `// ${href}`,
    `'import/${/\/rules\/(.+)\./.exec(href)[1]}': 'error',`,
    '',
].join('\n')).join('\n'));

copy(Array.from(document.querySelectorAll('table td:first-child a')).filter(({ href }) => /\/rules\//.test(href)).map(({ href }) => [
    `// ${href}`,
    `'jest/${/\/rules\/(.+)\./.exec(href)[1]}': 'error',`,
    '',
].join('\n')).join('\n'));

copy(Array.from(document.querySelectorAll('li:nth-child(5) ul a')).filter(({ href }) => /rules-.*$/.test(href)).map(({ href }) => [
    `// ${href}`,
    `'jsdoc/${/rules-(.+)$/.exec(href)[1]}': 'error',`,
    '',
].join('\n')).join('\n'));

copy(Array.from(document.querySelectorAll('table:first-of-type td:first-child a')).filter(({ href }) => /\/rules\//.test(href)).map(({ href }) => [
    `// ${href}`,
    `'@typescript-eslint/${/\/rules\/(.+)\.md/.exec(href)[1]}': 'error',`,
    '',
].join('\n')).join('\n'));

copy(Array.from(document.querySelectorAll('table tr td:nth-child(3) a')).filter(({ href }) => /\/rules\//.test(href)).map(({ href }) => [
    `// ${href}`,
    `'${/\/rules\/(.+)$/.exec(href)[1]}': 'error',`,
    '',
].join('\n')).join('\n'));
*/

module.exports = {
    reportUnusedDisableDirectives: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
            jsx: true
        }
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
        'eslint-plugin-import',
        'eslint-plugin-jest',
        'eslint-plugin-jsdoc',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        'eslint-plugin-jsx-a11y'
    ],
    env: {
        es2020: true,
        browser: true,
        node: true,
        jest: true,
        jasmine: true,
    },
    settings: {
        'import/internal-regex': '^@k2g/',
        'import/resolver': {
            typescript: {}
        },
        jsdoc: {
            mode: 'typescript',
            tagNamePreference: {
                returns: 'return'
            }
        }
    }
};
