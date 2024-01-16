const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { app, server } = require('../../provider/marketoverview');

describe('Pact Verification', () => {
    let pactVerifier;
    // const pactUrls = [path.resolve(process.cwd(), 'pacts', 'MarketOverviewAPI-MarketOverviewService.json')];

    beforeAll(() => {
        pactVerifier = new Verifier({
            provider: 'MarketOverviewService',
            providerBaseUrl: 'http://localhost:3003',
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
                            "CHF": {
                                "bid": "138.81.00311050100000000000050310051352undefined2234101013.3339999999999996450181001025599999999999100",
                                "offer": "1000000002411.001050"
                            }
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
