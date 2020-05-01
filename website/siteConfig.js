const cleanUrl = process.env.DULLAHAN_WEBSITE_TARGET !== 'local';
const url = cleanUrl ? 'https://dullahan.io' : 'http://localhost:5000';

module.exports = {
    url,
    cleanUrl,
    noIndex: true,
    baseUrl: '/',

    copyright: `Copyright © ${new Date().getFullYear()} Kaartje2go B.V.`,
    organizationName: 'Kaartje2go',
    projectName: 'Dullahan',
    tagline: 'Run acceptance tests anywhere at lightning speed',
    title: 'Dullahan',

    scripts: ['https://buttons.github.io/buttons.js'],
    customDocsPath: 'website/docs',
    docsSideNavCollapsible: false,
    enableUpdateBy: true,
    enableUpdateTime: true,
    onPageNav: 'separate',
    scrollToTop: true,

    favicon: 'img/favicon.ico',
    footerIcon: 'img/favicon.ico',
    headerIcon: 'img/favicon.ico',
    ogImage: 'img/undraw_online.svg',
    twitterImage: 'img/undraw_tweetstorm.svg',

    colors: {
        primaryColor: '#ff9b00',
        secondaryColor: '#02b8ff'
    },

    headerLinks: [{
        doc: 'index',
        label: 'API'
    }, {
        href: 'https://github.com/Kaartje2go/Dullahan',
        label: 'GitHub'
    }],

    highlight: {
        theme: 'default'
    },

    users: [{
        caption: 'Kaartje2go',
        image: 'img/logo_kaartje2go.png',
        infoLink: 'https://www.kaartje2go.nl',
        pinned: true
    }, {
        caption: 'Checkbuster',
        image: 'img/logo_checkbuster.png',
        infoLink: 'https://checkbuster.com/',
        pinned: true
    }]
};