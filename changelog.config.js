module.exports = {
    disableEmoji: true,
    list: [
        'fix',
        'feat',
        'chore'
    ],
    maxMessageLength: 64,
    minMessageLength: 3,
    questions: [
        'type',
        'subject',
        'body',
        'breaking',
        'issues'
    ],
    scopes: [],
    types: {
        fix: {
            description: 'A bug fix has been made',
            value: 'fix'
        },
        feat: {
            description: 'A new feature has been added',
            value: 'feat'
        },
        chore: {
            description: 'For everything else',
            value: 'chore'
        }
    }
};