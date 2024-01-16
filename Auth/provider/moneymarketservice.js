const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3002;

app.use(bodyParser.json());

// Mock data
const data = [
    {
        "1 Month": {
            "valueDate": "2024-01-17T04:42:35.540Z",
            "maturityDate": "2024-02-10T00:00:00.000Z",
            "bids": [],
            "offers": []
        },
    }
];

// Endpoint to handle the specific interaction
app.get('/mmapi/match/get-money-market', (req, res) => {
    const { currency, __v, cached, valueDate } = req.query;

    // Modify the logic to find the item based on the provided query parameters
    const selectedItem = data.find(item =>
        item["1 Month"].valueDate === valueDate
    );

    if (selectedItem) {
        const response = {
            success: true,
            message: "Request successful",
            data: [
                {
                    "1 Month": {
                        valueDate: selectedItem["1 Month"].valueDate,
                        maturityDate: selectedItem["1 Month"].maturityDate,
                        bids: selectedItem["1 Month"].bids,
                        offers: selectedItem["1 Month"].offers,
                    }
                }
            ],
        };

        // Set Content-Type header to 'application/json'
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
    } else {
        res.status(404).json({
            success: false,
            message: 'Id not found',
            data: null,
        });
    }
});

// Start the Express server and return the server instance
const server = app.listen(port, () => {
    console.log(`Provider server is running at http://localhost:${port}`);
});

module.exports = { app, server };
