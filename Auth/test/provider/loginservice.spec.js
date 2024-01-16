const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { app, authService } = require('../../provider/loginservice');

const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('UserLoginService - Pact Verification', () => {
    let server;
    let port;

    beforeAll((done) => {
        // Start Express app on an available port
        server = app.listen(0, () => {
            port = server.address().port;
            console.log(`LoginService is running for Pact Verification on port ${port}`);
            done();
        });
    });

    afterAll((done) => {
        // Close your Express server and then call the done() callback
        server.close(() => {
            console.log('Server closed');
            done();
        });
    });

    it('should verify the interactions', async () => {
        const timeout = 10000;
        jest.setTimeout(timeout);

        const opts = {
            provider: 'UserLoginService',
            logLevel: LOG_LEVEL,
            providerBaseUrl: `http://localhost:${port}`,
            publishVerificationResult: true,
            providerVersion: '1.0.0',
            pactBrokerUrl: 'http://127.0.0.1:8000',
            pactBrokerUsername: 'pact_workshop',
            pactBrokerPassword: 'pact_workshop',
            publishVerificationResult: process.env.CI === 'true' || process.env.PACT_BROKER_PUBLISH_VERIFICATION_RESULTS === 'true',
            consumerVersionSelectors: [{
                latest: true,
            }],
            // pactUrls: [path.resolve(process.cwd(), 'pacts', 'UserLogin-UserLoginService.json')],
            stateHandlers: {
                'Given user with specific data exists': async () => {
                    const userData = {
                        username: 'gautham1',
                        password: 'V3BhZG1pbjEyMyM=',
                        location: 'application',
                        captcha: 'ST:RECAPTCHA_SIG:ya3cb46ju0geta9mj5bkte',
                    };

                    const existingUser = app.getUserByData(userData);

                    if (existingUser) {
                        return 'User already exists';
                    } else {
                        throw new Error('User with specific data does not exist');
                    }
                },
            },
        };

        try {
            await new Verifier(opts).verifyProvider();
            console.log('Pact verification successful');
        } catch (error) {
            console.error('Pact verification failed:', error);
            throw error;
        }
    });
});
