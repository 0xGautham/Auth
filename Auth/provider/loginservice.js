const express = require('express');
const bodyParser = require('body-parser');

class AuthService {
    constructor() {
        this.dummyUserData = {
            username: 'gautham1',
            password: 'V3BhZG1pbjEyMyM=',
            location: 'application',
            captcha: 'ST:RECAPTCHA_SIG:ya3cb46ju0geta9mj5bkte',
        };
    }

    authenticateUser(req, res) {
        const { username, password, location, captcha } = req.body;

        if (
            username === this.dummyUserData.username &&
            password === this.dummyUserData.password &&
            location === this.dummyUserData.location &&
            captcha === this.dummyUserData.captcha
        ) {
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
    }
}

const app = express();
const authService = new AuthService();

app.use(bodyParser.json());

// Endpoint for user authentication
app.post('/authapi/auth/login', (req, res) => {
    authService.authenticateUser(req, res);
});

// Start the server
const PORT = process.env.PORT || 2525;
app.listen(PORT, () => {
    console.log(`LoginService is running on port ${PORT}`);
});

module.exports = { app, authService };
