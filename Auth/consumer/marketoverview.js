const axios = require('axios');

class MarketOverviewAPI {
    constructor(baseURL = "https://beta-dev.instimatch.ch/") {
        this.baseURL = baseURL;
    }

    async getMarketOverview(bid, offer) {
        try {
            const response = await axios.get(`${this.baseURL}/mmapi/match/get-market-overview?cached=true`, {
                params: { bid, offer }
            });

            // Check HTTP status code
            if (response.status === 200) {
                // Check if the response has the expected structure
                const { success, message, data } = response.data;

                if (success !== undefined && message !== undefined) {
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
            } else {
                // Handle non-200 HTTP status code
                throw new Error(`Unexpected HTTP status code: ${response.status}`);
            }
        } catch (error) {
            // Handle network or unexpected errors
            throw new Error(`Request failed: ${error.message || 'unknown error'}`);
        }
    }
}

module.exports = { MarketOverviewAPI };
