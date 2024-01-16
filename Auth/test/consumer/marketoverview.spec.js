const { Pact } = require('@pact-foundation/pact');
const { MarketOverviewAPI } = require('../../consumer/marketoverview');

describe('MarketOverviewAPI Consumer Test', () => {
    let provider;
    let api;

    beforeAll(async () => {
        provider = new Pact({
            consumer: 'MarketOverviewAPI',
            provider: 'MarketOverviewService',
            port: 4242,
            log: './logs/pact.log',
            dir: './pacts',
            spec: 2,
        });

        await provider.setup();

        // Set up the API with the mock service URL
        api = new MarketOverviewAPI(provider.mockService.baseUrl);
    });

    afterAll(async () => {
        await provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe('getMarketOverview', () => {
        it('should successfully interact with the provider', async () => {
            const bid = "138.81.00311050100000000000050310051352undefined2234101013.3339999999999996450181001025599999999999100"
            const offer = "1000000002411.001050"

            const interaction = {
                state: 'A request for MarketOverview data',
                uponReceiving: 'A getMarketOverview request',
                withRequest: {
                    method: 'GET',
                    path: '/mmapi/match/get-market-overview',
                    query: {
                        cached: 'true',
                        bid,
                        offer,
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        success: true,
                        message: 'Request successful',
                        data: [
                            {
                                "CHF": {
                                    "bid": "138.81.00311050100000000000050310051352undefined2234101013.3339999999999996450181001025599999999999100",
                                    "offer": "1000000002411.001050"
                                },
                            }
                        ]
                    },
                },
            };

            await provider.addInteraction(interaction);
            const result = await api.getMarketOverview(
                "138.81.00311050100000000000050310051352undefined2234101013.3339999999999996450181001025599999999999100",
                "1000000002411.001050"
            );
            return result;
        });
    });
});

