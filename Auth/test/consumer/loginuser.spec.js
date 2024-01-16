const { Pact } = require('@pact-foundation/pact');
const { API } = require('../../consumer/loginuser');
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('API - Pact Test', () => {
    let provider;

    beforeAll(async () => {
        provider = new Pact({
            consumer: 'UserLogin',
            provider: 'UserLoginService',
            port: 8000,
            log: './logs/pact.log',
            dir: './pacts',
            logLevel: LOG_LEVEL,
            spec: 2,
        });

        await provider.setup();
    });

    afterAll(async () => {
        await provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    it('should authenticate a user successfully', async () => {
        const api = new API(provider.mockService.baseUrl);

        // Define expectations for the request and response
        await provider.addInteraction({
            state: 'a user exists with the given credentials',
            uponReceiving: 'a request to authenticate a user',
            withRequest: {
                method: 'POST',
                path: '/authapi/auth/login',
                body: {
                    username: 'gautham1',
                    password: 'V3BhZG1pbjEyMyM=',
                    location: 'application',
                    captcha: 'ST:RECAPTCHA_SIG:ya3cb46ju0geta9mj5bkte',
                },
            },
            willRespondWith: {
                status: 200,
                body: {
                    success: true,
                    message: 'Authentication successful',
                    data: {},
                },
            },
        });

        // Make a request to authenticate a user
        const result = await api.authenticateUser('gautham1', 'V3BhZG1pbjEyMyM=', 'application', 'ST:RECAPTCHA_SIG:ya3cb46ju0geta9mj5bkte');

        // Assertions
        expect(result).toEqual({
            success: true,
            message: 'Authentication successful',
            data: {},
        });
    });
});
