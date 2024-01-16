const axios = require('axios');

class MarketLogAPI {
    constructor(baseURL = "https://beta-dev.instimatch.ch") {
        this.baseURL = baseURL;
    }

    async getMarketLogs(_id, amount, currency, rate, term) {
        try {
            const response = await axios.get(`${this.baseURL}/mm-trade-lifecycle/trades/get-market-logs`, {
                params: { _id, amount, currency, rate, term }
            });

            // Check if the response has the expected structure
            if (response.data && response.data.success !== undefined && response.data.message !== undefined) {
                const { success, message, data } = response.data;

                if (success) {
                    // Authentication successful
                    return { success, message, data };
                } else {
                    // Authentication failed
                    throw new Error(`Failed to authenticate: ${message}`);
                }
            } else {
                // Unexpected response structure
                throw new Error(`Failed to authenticate: Unexpected response structure: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            // Handle network or unexpected errors
            throw new Error(`Failed to authenticate: ${error.message || 'unknown error'}`);
        }
    }
}

module.exports = { MarketLogAPI };
