const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Mock data
const data = [
    {
        "_id": "65968f0514c8d382d30578c3",
        "amount": 121,
        "currency": "CHF",
        "rate": 2,
        "term": "O/N"
    },
];

// Endpoint to handle the specific interaction
app.get('/mm-trade-lifecycle/trades/get-market-logs', (req, res) => {
    const { _id } = req.query;
    const selectedItem = data.find(item => item._id === _id);

    if (selectedItem) {
        const response = {
            success: true,
            message: 'Successful',
            data: selectedItem,
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

// Start the Express server
const server = app.listen(port, () => {
    console.log(`Provider server is running at http://localhost:${port}`);
});

module.exports = { app, server };
