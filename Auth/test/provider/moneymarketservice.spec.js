const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { app, server } = require('../../provider/moneymarketservice');

describe('Pact Verification', () => {
    let pactVerifier;
    // const pactUrls = [path.resolve(process.cwd(), 'pacts', 'MoneyMarketAPI-MoneyMarketService.json')];

    beforeAll(() => {
        pactVerifier = new Verifier({
            provider: 'MoneyMarketService',
            providerBaseUrl: 'http://localhost:3002',
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
                    const data = [
                        {
                            "1 Month": {
                                "valueDate": "2024-01-17T04:42:35.540Z",
                                "maturityDate": "2024-02-10T00:00:00.000Z",
                                "bids": [],
                                "offers": []
                            },
                        }
                    ];
                    await data();
                    return {
                        success: true,
                        message: "Request successful",
                    };
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
