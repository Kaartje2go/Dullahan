const {teardown} = require('jest-dev-server');
const kill = require('kill-port');

module.exports = async () => {
    console.warn('\nShutting down static file server, this may take a while.\nDon\'t close this process!\n');

    await kill(8080, 'tcp');
    await teardown();
};
