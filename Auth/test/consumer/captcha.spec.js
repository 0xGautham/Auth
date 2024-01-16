const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const { CaptchaAPI } = require('../../consumer/captcha');
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('Captcha API - Pact Test', () => {
    let provider;

    beforeAll(async () => {
        provider = new Pact({
            consumer: 'Captcha_API ',
            provider: 'Captcha_Service',
            port: 2000,
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

    it('should return a valid token', async () => {
        const captchaAPI = new CaptchaAPI(provider.mockService.baseUrl);

        await provider.addInteraction({
            state: 'a valid token state',
            uponReceiving: 'a valid token request',
            withRequest: {
                method: 'POST',
                path: '/authapi/auth/captcha',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    token: 'token',
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

        // Define the provider API
        const result = await captchaAPI.captcha('token');

        expect(result).toEqual({
            success: true,
            message: 'Authentication successful',
            data: {},
        });
    });
});

