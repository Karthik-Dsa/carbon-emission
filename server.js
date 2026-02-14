import express from 'express';
import { calculateCarbonStats } from './cec-logic.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Serve static files from frontend directory
app.use(express.static('frontend'));

app.post('/calculate', (req, res) => {
    try {
        // Validate request body exists
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const result = calculateCarbonStats(req.body);
        res.json(result);
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(400).json({ error: 'Failed to calculate emissions. Please check your input values.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});