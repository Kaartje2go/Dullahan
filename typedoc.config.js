module.exports = {
    excludeNotExported: true,
    excludeProtected: true,
    excludePrivate: true,
    excludeExternals: true,
    includeDeclarations: true,
    disableSources: true,
    hideGenerator: true,
    hideBreadcrumbs: true,
    hideSources: true,
    externalPattern: '**/node_modules/**',
    mode: 'modules',
    name: 'Dullahan',
    out: 'website/docs',
    theme: 'docusaurus',
    readme: 'README.md',
    toc: [],
    exclude: [
        '**/dist/**/*',
        '**/tests/**/*',
        '**/node_modules/**/*',
        '**/browser_context/**/*'
    ]
};
