const axios = require('axios');

class API {
    constructor(baseURL = "https://beta-dev.instimatch.ch") {
        this.baseURL = baseURL;
    }

    async authenticateUser(username, password, location, captcha) {
        try {
            const response = await axios.post(`${this.baseURL}/authapi/auth/login`, {
                username,
                password,
                location,
                captcha,
            });

            // Assume the API response includes success and message properties
            const { success, message, data } = response.data;

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

module.exports = { API };

