const { Pact } = require('@pact-foundation/pact');
const { MoneyMarketAPI } = require('../../consumer/moneymarket');

describe('MoneyMarketAPI Consumer Test', () => {
    let provider;
    let api;

    beforeAll(async () => {
        provider = new Pact({
            consumer: 'MoneyMarketAPI',
            provider: 'MoneyMarketService',
            port: 4141,
            log: './logs/pact.log',
            dir: './pacts',
            spec: 2,
        });

        await provider.setup();

        // Set up the API with the mock service URL
        api = new MoneyMarketAPI(provider.mockService.baseUrl);
    });

    afterAll(async () => {
        await provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe('getMoneyMarket', () => {
        it('should successfully interact with the provider', async () => {
            const valueDate = '2024-01-17T04:42:35.540Z';
            const maturityDate = '2024-02-10T00:00:00.000Z';
            const bids = [];
            const offers = [];

            const interaction = {
                state: 'A request for money market data',
                uponReceiving: 'A getMoneyMarket request',
                withRequest: {
                    method: 'GET',
                    path: '/mmapi/match/get-money-market',
                    query: {
                        currency: 'CHF',
                        __v: '1705309508877',
                        cached: 'true',
                        valueDate,
                        maturityDate,
                        bids,
                        offers,
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
                                "1 Month": {
                                    "valueDate": "2024-01-17T04:42:35.540Z",
                                    "maturityDate": "2024-02-10T00:00:00.000Z",
                                    "bids": [],
                                    "offers": []
                                },
                            }
                        ]
                    },
                },
            };


            await provider.addInteraction(interaction);

            const result = await api.getMoneyMarket(
                '2024-01-17T04:42:35.540Z',
                '2024-02-10T00:00:00.000Z',
                [],
                [],
                'CHF',
                '1705309508877',
                'true'
            );
            return result;
        });
    });
});

