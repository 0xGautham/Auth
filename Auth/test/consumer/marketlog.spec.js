const { Pact } = require('@pact-foundation/pact');
const { MarketLogAPI } = require('../../consumer/marketlog');
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('MarketlogAPI - Pact Test', () => {
    let provider;
    let api;

    beforeAll(async () => {
        provider = new Pact({
            consumer: 'Marketlog',
            provider: 'MarketlogService',
            port: 8000,
            log: './logs/pact.log',
            dir: './pacts',
            logLevel: LOG_LEVEL,
            spec: 2,
        });

        await provider.setup();

        // Set up the API with the mock service URL
        api = new MarketLogAPI(provider.mockService.baseUrl);
    });

    afterAll(async () => {
        await provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    it('should authenticate successfully', async () => {
        // Define expectations for the request and response
        await provider.addInteraction({
            state: 'Exists with the given credentials',
            uponReceiving: 'get market logs',
            withRequest: {
                method: 'get',
                path: '/mm-trade-lifecycle/trades/get-market-logs',
                query: { _id: '65968f0514c8d382d30578c3', amount: 121, currency: 'CHF', rate: 2, term: 'O/N' },
            },
            willRespondWith: {
                status: 200,
                body: {
                    success: true,
                    message: 'Successful',
                    data: {},
                },
            },
        });

        // Make a request to authenticate a user
        const result = await api.getMarketLogs('65968f0514c8d382d30578c3', 121, 'CHF', 2, 'O/N');

        // Assertions
        expect(result).toEqual({
            success: true,
            message: 'Successful',
            data: {},
        });
    });
});