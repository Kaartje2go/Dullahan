const {setup} = require('jest-dev-server');

module.exports = async () => {
    try {
        console.log('\nLaunching static file server...');

        await setup([
            {
                command: 'yarn serve packages/dullahan/fixtures -l tcp://localhost:8080',
                debug: false,
                launchTimeout: 30000,
                host: 'localhost',
                protocol: 'http',
                port: 8080,
                usedPortAction: 'kill',
                waitOnScheme: {
                    delay: 0,
                    interval: 250,
                    log: false,
                    reverse: false,
                    timeout: 30000,
                    tcpTimeout: 300,
                    verbose: false,
                    window: 705
                }
            }
        ]);

        console.log('Launched static file server at', 'http://localhost:8080');
    } catch (error) {
        console.warn('Encountered an error while launching static file server:\n', error);
    }
};
