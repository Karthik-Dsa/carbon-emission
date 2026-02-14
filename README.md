# Carbon Emission Calculator 🌍

A web-based application to calculate your yearly carbon footprint based on electricity usage, transportation, air travel, and dietary choices.

## Features

- 📊 Real-time carbon emission calculations
- 📈 Interactive charts showing emission history
- 🌿 Nature-themed, responsive UI
- 🔄 Auto-updating results with debounced inputs
- 🎯 Breakdown by category (electricity, transport, flights, diet)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Karthik-Dsa/carbon-emission.git
cd carbon-emission
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

1. Enter your monthly electricity usage in kWh
2. Enter your monthly transportation distance in kilometers
3. Enter the number of flights you take per year (short/medium/long)
4. Select your dietary choice
5. Click "Calculate My Impact" or wait for auto-calculation

The app will display:
- Your total yearly carbon emissions in kgCO2
- Breakdown by category
- Historical chart showing changes over time

## Project Structure

```
carbon-emission/
├── server.js           # Express server
├── cec-logic.js        # Carbon calculation logic
├── mcp.js              # MCP server for AI integration
├── frontend/           # Frontend files
│   ├── index.html      # Main HTML page
│   ├── app.js          # Frontend JavaScript
│   └── chart-simple.js # Custom chart library
├── package.json        # Dependencies
└── README.md          # This file
```

## API

### POST /calculate

Calculate carbon emissions based on input data.

**Request Body:**
```json
{
  "electricityUsageKwh": 300,
  "transportationUsagePerMonth": 500,
  "shortFlight": 2,
  "mediumFlight": 1,
  "largeFlight": 0,
  "dietaryChoice": "vegetarian"
}
```

**Response:**
```json
{
  "totalYearlyEmissions": { "value": 15234.56, "unit": "kgCO2/year" },
  "totalElectricityUsage": { "value": 1432.08, "unit": "kgCO2/year" },
  "totalTransportationUsage": { "value": 54522.00, "unit": "kgCO2/year" },
  "totalEmissionFlight": { "value": 400.00, "unit": "kgCO2/year" },
  "dietaryChoiceEmission": { "value": 400.00, "unit": "kgCO2/year" }
}
```

## Emission Factors

- **Electricity**: 0.3978 kg CO2 per kWh (US grid average)
- **Transportation**: 9.087 kg CO2 per km
- **Short Flight**: 100 kg CO2 per flight
- **Medium Flight**: 200 kg CO2 per flight  
- **Long Flight**: 300 kg CO2 per flight
- **Vegetarian Diet**: 400 kg CO2 per year
- **Non-Vegetarian Diet**: 800 kg CO2 per year

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Chart Library**: Custom lightweight chart implementation
- **Validation**: Zod
- **AI Integration**: Model Context Protocol (MCP)

## Development

### Running in Development Mode

For development with auto-reload:
```bash
npm install -g nodemon
nodemon server.js
```

### Environment Variables

- `PORT`: Server port (default: 8080)

## Known Issues

See [ANALYSIS.md](ANALYSIS.md) for a comprehensive list of bugs and improvement suggestions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Karthik-Dsa
