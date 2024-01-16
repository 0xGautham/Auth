const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

app.use(bodyParser.json());

// Mock data
const data = [
    {
        "CHF": {
            "bid": "138.81.00311050100000000000050310051352undefined2234101013.3339999999999996450181001025599999999999100",
            "offer": "1000000002411.001050"
        },
    }
];

// Endpoint to handle the specific interaction
app.get('/mmapi/match/get-market-overview', (req, res) => {
    const { bid } = req.query;

    // Modify the logic to find the item based on the provided query parameters
    const selectedItem = data.find(item => item["CHF"].bid === bid);

    if (selectedItem) {
        const response = {
            success: true,
            message: "Request successful",
            data: [
                {
                    "CHF": {
                        bid: selectedItem["CHF"].bid,
                        offer: selectedItem["CHF"].offer,
                    }
                }
            ]
        };

        // Set Content-Type header to 'application/json'
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
    } else {
        res.status(404).json({
            success: false,
            message: 'Id not found',
            data: null
        });
    }
});

// Start the Express server and return the server instance
const server = app.listen(port, () => {
    console.log(`Provider server is running at http://localhost:${port}`);
});

module.exports = { app, server };
