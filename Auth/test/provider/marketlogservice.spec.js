const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { app, server } = require('../../provider/marketlogservice');

const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('Pact Verification', () => {
    let pactVerifier;
    // const pactUrls = [path.resolve(process.cwd(), 'pacts', 'Marketlog-MarketlogService.json')];

    beforeAll(() => {
        pactVerifier = new Verifier({
            provider: 'MarketlogService',
            logLevel: LOG_LEVEL,
            providerBaseUrl: 'http://localhost:3001',
            publishVerificationResult: true,
            providerVersion: '1.0.0',
            pactBrokerUrl: 'http://127.0.0.1:8000',
            pactBrokerUsername: 'pact_workshop',
            pactBrokerPassword: 'pact_workshop',
            publishVerificationResult: process.env.CI === 'true' || process.env.PACT_BROKER_PUBLISH_VERIFICATION_RESULTS === 'true',
            consumerVersionSelectors: [{
                latest: true,
            }],
            // pactUrls,
            stateHandlers: {
                'Exists with the given credentials': async () => {

                    const setupUser = () => {

                        const userData = {
                            _id: '65968f0514c8d382d30578c3',
                            amount: 121,
                            currency: 'CHF',
                            rate: 2,
                            term: 'O/N',
                        };

                        app.data = [userData];
                    };
                    await setupUser();
                },

            },
        });
    });

    afterAll(async () => {

        if (server) {
            server.close();
            console.log('Server closed');
        }
    });

    it('should verify the interactions', async () => {
        try {
            await pactVerifier.verifyProvider();
            console.log('Pact verification successful');
        } catch (error) {
            console.error('Pact verification failed:', error);
            throw error;
        }
    });
});
