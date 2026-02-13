import express from 'express';
import { calculateCarbonStats } from './cec-logic.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(express.json());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

app.post('/calculate', (req, res) => {
    try {
        const result = calculateCarbonStats(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
    console.log(`WEBSITE is running on http://localhost:${port}`);
});