const axios = require('axios');

class CaptchaAPI {
    constructor(baseURL = "https://beta-dev.instimatch.ch") {
        this.baseURL = baseURL;
    }

    async captcha(token) {
        try {
            const response = await axios.post(`${this.baseURL}/authapi/auth/captcha`, { token });
            // Assume the API response includes success and message properties
            const { success, message, data } = response.data; // Fix typo here

            if (success) {
                // Authentication successful
                return { success, message, data };
            } else {
                // Authentication failed
                throw new Error(`Failed to authenticate user: ${message}`);
            }
        } catch (error) {
            // Handle network or unexpected errors
            throw new Error(`Failed to authenticate user: ${error.message}`);
        }
    }
}

module.exports = { CaptchaAPI };
