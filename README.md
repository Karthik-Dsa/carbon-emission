# Carbon Emission Calculator 🌱

A web-based carbon footprint calculator that helps users estimate their annual carbon emissions based on various lifestyle factors including electricity usage, transportation, air travel, and dietary choices.

## 🌍 Overview

This application provides an intuitive interface for calculating and visualizing personal carbon emissions. Users can input their monthly electricity usage, transportation habits, flight frequency, and dietary preferences to get a comprehensive breakdown of their annual carbon footprint.

## ✨ Features

- **Real-time Calculations**: Instant carbon footprint calculations with debounced input (500ms)
- **Interactive Visualization**: Dynamic line charts showing emissions breakdown by category
- **Comprehensive Metrics**: Track emissions from:
  - Electricity consumption
  - Transportation (monthly kilometers)
  - Air travel (short, medium, and large/long-haul flights)
  - Dietary choices (vegetarian vs. non-vegetarian)
- **RESTful API**: Backend API for carbon calculations
- **MCP Integration**: Model Context Protocol server for AI-powered interactions
- **Nature-themed UI**: Beautiful green color scheme with gradient backgrounds

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

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
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## 📖 Usage

### Web Application

1. Open the application in your web browser
2. Enter your monthly electricity usage in kWh
3. Input your monthly transportation distance in kilometers
4. Specify the number of flights taken annually (short, medium, and large/long-haul)
5. Select your dietary preference (vegetarian or non-vegetarian)
6. View your annual carbon footprint calculations in real-time
7. Analyze the breakdown chart to see which activities contribute most to your emissions

### API Endpoint

**POST** `/calculate`

Calculate carbon emissions based on provided data.

**Request Body:**
```json
{
  "electricityUsageKwh": 300,
  "transportationUsagePerMonth": 200,
  "shortFlight": 2,
  "mediumFlight": 1,
  "largeFlight": 0,
  "dietaryChoice": "vegetarian"
}
```

**Response:**
```json
{
  "totalYearlyEmissions": {
    "value": 24040.88,
    "unit": "kgCO2/year"
  },
  "totalElectricityUsage": {
    "value": 1432.08,
    "unit": "kgCO2/year"
  },
  "totalTransportationUsage": {
    "value": 21808.8,
    "unit": "kgCO2/year"
  },
  "totalEmissionFlight": {
    "value": 400,
    "unit": "kgCO2/year"
  },
  "dietaryChoiceEmission": {
    "value": 400,
    "unit": "kgCO2/year"
  }
}
```

### MCP Server

The project includes a Model Context Protocol (MCP) server for AI-powered interactions:

```bash
node mcp.js
```

The MCP server provides a `calculate_emissions` tool that can be used by AI assistants to calculate carbon footprints.

## 📁 Project Structure

```
carbon-emission/
├── server.js                 # Express.js server
├── cec-logic.js             # Carbon emission calculation logic
├── mcp.js                   # MCP server implementation
├── package.json             # Node.js dependencies and scripts
├── frontend/                # Frontend assets
│   ├── index.html          # Main HTML page
│   ├── app.js              # Frontend JavaScript logic
│   └── chart.js            # Custom chart library (SimpleChart)
└── README.md               # This file
```

## 🛠️ Technologies Used

- **Backend**: 
  - Node.js
  - Express.js v5.2.1
  - ES Modules
  
- **Frontend**:
  - Vanilla JavaScript
  - Custom SimpleChart library (lightweight charting)
  - CSS3 with custom properties
  - Responsive design

- **Additional Tools**:
  - @modelcontextprotocol/sdk v1.26.0
  - Zod v4.3.6 (schema validation)

## 🌳 Emission Factors

The calculator uses the following emission factors:

- **Electricity**: 0.3978 kg CO₂/kWh
- **Transportation**: 9.087 kg CO₂/km
- **Flights**:
  - Short-haul: 100 kg CO₂ per flight
  - Medium-haul: 200 kg CO₂ per flight
  - Large/Long-haul: 300 kg CO₂ per flight
- **Dietary Choices**:
  - Vegetarian: 400 kg CO₂/year
  - Non-vegetarian: 800 kg CO₂/year

## 🎨 UI Design

The application features a nature-themed color palette:
- Forest Green (#2d5016)
- Leaf Green (#4a7c2c)
- Grass Green (#7cb342)
- Sage Green (#9caf88)

## 📝 License

ISC

## 👤 Author

Karthik-Dsa

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Karthik-Dsa/carbon-emission/issues).

## 📊 Future Enhancements

- Add more emission categories (waste, water usage)
- Support for different regions and emission factors
- User accounts and historical tracking
- Comparison with regional/global averages
- Recommendations for reducing carbon footprint
- Export reports as PDF

---

**Note**: The emission factors used are approximations. For more accurate carbon footprint calculations, consider consulting professional carbon accounting services.
