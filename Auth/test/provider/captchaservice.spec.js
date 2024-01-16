const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const express = require('express');
const bodyParser = require('body-parser');
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

const app = express();
app.use(bodyParser.json());

app.post('/authapi/auth/captcha', (req, res) => {
    const { token } = req.body;

    // Check if the token is valid and return the appropriate response
    if (token === 'token') {
        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: {},
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
});

// Start the Express app
const server = app.listen(3000, () => {
    console.log('CaptchaService is running on port 3000');
});

// Pact verification
describe('Pact Verification', () => {
    afterAll((done) => {
        // Close the Express server after verification
        server.close(done);
    });

    it('should verify the interactions', async () => {
        const opts = {
            provider: 'CaptchaServiceDemo',
            logLevel: LOG_LEVEL,
            providerBaseUrl: 'http://localhost:3000',
            publishVerificationResult: true,
            providerVersion: '1.0.0',
            pactBrokerUrl: 'http://127.0.0.1:8000',
            pactBrokerUsername: 'pact_workshop',
            pactBrokerPassword: 'pact_workshop',
            publishVerificationResult: process.env.CI === 'true' || process.env.PACT_BROKER_PUBLISH_VERIFICATION_RESULTS === 'true',
            consumerVersionSelectors: [{
                latest: true,
            }],
            // pactUrls: [path.resolve(process.cwd(), 'pacts', 'Captcha -CaptchaServiceAPI.json')],
        };

        try {
            await new Verifier(opts).verifyProvider();
            console.log('Pact verification successful');
        } catch (error) {
            console.error('Pact verification failed:', error);
            throw error;
        }
    }, 10000); // Set the timeout value to 10 seconds (or adjust as needed)

});
