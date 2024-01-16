const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { app, captchaService } = require('../path/to/your/app');

describe('CaptchaService - Jest Test', () => {
    let server;
    const PORT = process.env.PORT || 3000;
    const baseApiUrl = `http://localhost:${PORT}`;

    beforeAll(() => {
        server = app.listen(PORT);
        console.log(`CaptchaService is running on port ${PORT}`);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should authenticate a user successfully', async () => {
        const dummyUserData = {
            username: 'gautham1',
            password: 'V3BhZG1pbjEyMyM=',
            location: 'application',
            captcha: 'ST:RECAPTCHA_SIG:ya3cb46ju0geta9mj5bkte',
        };

        // Mocking the authentication request
        const responseMock = {
            status: 200,
            data: {
                success: true,
                message: 'Authentication successful',
                data: {},
            },
        };

        jest.spyOn(axios, 'post').mockResolvedValue(responseMock);

        const result = await captchaService.authenticateUser({
            body: dummyUserData,
        }, {
            json: jest.fn(),
            status: jest.fn(),
        });

        // Assertions
        expect(result.status).toHaveBeenCalledWith(200);
        expect(result.json).toHaveBeenCalledWith(responseMock.data);
    });

    it('should handle authentication failure', async () => {
        const dummyUserData = {
            username: 'invalidUsername',
            password: 'invalidPassword',
            location: 'invalidLocation',
            captcha: 'invalidCaptcha',
        };

        // Mocking the authentication request
        const responseMock = {
            status: 401,
            data: {
                success: false,
                message: 'Authentication failed',
            },
        };

        jest.spyOn(axios, 'post').mockResolvedValue(responseMock);

        const result = await captchaService.authenticateUser({
            body: dummyUserData,
        }, {
            json: jest.fn(),
            status: jest.fn(),
        });

        // Assertions
        expect(result.status).toHaveBeenCalledWith(401);
        expect(result.json).toHaveBeenCalledWith(responseMock.data);
    });
});

