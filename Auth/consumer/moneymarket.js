const axios = require('axios');

class MoneyMarketAPI {
    constructor(baseURL = "https://beta-dev.instimatch.ch/") {
        this.baseURL = baseURL;
    }

    async getMoneyMarket(valueDate, maturityDate, bids, offers) {
        try {
            const response = await axios.get(`${this.baseURL}/mmapi/match/get-money-market?currency=CHF&__v=1705309508877&cached=true`, {
                params: { valueDate, maturityDate, bids, offers }
            });

            // Check if the response has the expected structure
            if (response.data && response.data.success !== undefined && response.data.message !== undefined) {
                const { success, message, data } = response.data;

                if (success) {
                    // Request successful
                    return { success, message, data };
                } else {
                    // Request failed
                    throw new Error(`Request failed: ${message}`);
                }
            } else {
                // Unexpected response structure
                throw new Error(`Unexpected response structure: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            // Handle network or unexpected errors
            throw new Error(`Request failed: ${error.message || 'unknown error'}`);
        }
    }
}

module.exports = { MoneyMarketAPI };


