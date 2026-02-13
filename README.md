# 🌍 Carbon Emission Calculator

A full-stack web application to calculate your yearly carbon footprint based on various factors like electricity usage, transportation, air travel, and dietary choices.

## Features

- 📊 **Interactive Form**: Easy-to-use form to input your consumption data
- 🎨 **Modern UI**: Beautiful, responsive design with gradient effects
- 📈 **Detailed Results**: Breakdown of emissions by category
- 💡 **Tips**: Helpful suggestions to reduce your carbon footprint
- ⚡ **Fast**: Built with React for optimal performance

## Screenshots

### Empty Form
![Carbon Calculator Form](https://github.com/user-attachments/assets/e963b688-343a-4416-a45f-51f3375c7e54)

### Results Display
![Carbon Calculator Results](https://github.com/user-attachments/assets/dc1786d0-c797-4e8d-a30b-9da9817cabf5)

## Tech Stack

**Frontend:**
- React 19
- CSS3 with custom styling
- Fetch API for backend communication

**Backend:**
- Node.js
- Express 5
- CORS enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Karthik-Dsa/carbon-emission.git
cd carbon-emission
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

## Usage

### Development Mode

Run the React development server:
```bash
npm run dev
```

In another terminal, start the backend server:
```bash
npm start
```

The React app will be available at `http://localhost:3000` and will proxy API requests to the backend at `http://localhost:8080`.

### Production Mode

1. Build the React frontend:
```bash
npm run build
```

2. Start the server (serves both frontend and backend):
```bash
npm start
```

The application will be available at `http://localhost:8080`.

## API Endpoints

### POST /calculate

Calculate carbon emissions based on user input.

**Request Body:**
```json
{
  "electricityUsageKwh": 350,
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
  "totalYearlyEmissions": {
    "value": 57292.76,
    "unit": "kgCO2/year"
  },
  "totalElectricityUsage": {
    "value": 1670.76,
    "unit": "kgCO2/year"
  },
  "totalTransportationUsage": {
    "value": 54522.00,
    "unit": "kgCO2/year"
  },
  "totalEmissionFlight": {
    "value": 700.00,
    "unit": "kgCO2/year"
  },
  "dietaryChoiceEmission": {
    "value": 400.00,
    "unit": "kgCO2/year"
  }
}
```

## Emission Factors

The calculator uses the following emission factors:

- **Electricity**: 0.3978 kgCO2/kWh
- **Transportation**: 9.087 kgCO2/km
- **Short Flight** (<1500 km): 100 kgCO2/flight
- **Medium Flight** (1500-4000 km): 200 kgCO2/flight
- **Long Flight** (>4000 km): 300 kgCO2/flight
- **Vegetarian Diet**: 400 kgCO2/year
- **Non-Vegetarian Diet**: 800 kgCO2/year

## Project Structure

```
carbon-emission/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── CarbonCalculator.js   # Main calculator component
│   │   ├── CarbonCalculator.css  # Calculator styles
│   │   ├── App.js         # Root component
│   │   └── ...
│   └── package.json       # Frontend dependencies
├── server.js              # Express backend server
├── package.json           # Backend dependencies
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
