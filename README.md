# Carbon Emission Calculator

A basic REST API-based carbon emission calculator built with Node.js and Express.

## 📊 Analysis of Current Implementation

### What the Calculator Does

The carbon emission calculator estimates yearly carbon emissions based on:

1. **Electricity Usage** - Monthly electricity consumption in kWh
2. **Transportation** - Monthly transportation usage
3. **Air Travel** - Flights categorized as short, medium, and large
4. **Dietary Choices** - Vegetarian vs Non-vegetarian diet

### Architecture

- **Framework**: Express.js
- **API Endpoint**: `POST /calculate`
- **Port**: 8080
- **Input Format**: JSON
- **Output Format**: JSON with emissions breakdown

### Current Features

✅ Calculates yearly carbon emissions  
✅ Breaks down emissions by category  
✅ Returns results in kgCO2/year units  
✅ Supports dietary choice differentiation  

### Issues Identified

1. **❌ Missing Error Handling**: The catch block is empty (line 59-61)
2. **❌ Incorrect Factors**: All emission factors are set to 0.3978, which is not realistic
3. **❌ Global Variable**: `year` is declared without `const/let/var` (line 31)
4. **❌ No Input Validation**: No checks for missing or invalid input data
5. **❌ No CORS Support**: May cause issues with web clients
6. **❌ Typo**: Variable name `airTravelLargrFlight` should be `airTravelLargeFlight` (line 38)
7. **❌ No Documentation**: Missing README and API documentation
8. **❌ No Tests**: No test suite to ensure correctness

### Emission Factors - Actual Values

For reference, here are more realistic emission factors:

| Category | Factor | Unit |
|----------|--------|------|
| Electricity (US avg) | 0.42 | kgCO2/kWh |
| Electricity (World avg) | 0.475 | kgCO2/kWh |
| Car (Gasoline) | 0.24 | kgCO2/km |
| Public Transit | 0.04 | kgCO2/km |
| Short Flight (<1500km) | 0.26 | kgCO2/km |
| Medium Flight (1500-3700km) | 0.18 | kgCO2/km |
| Long Flight (>3700km) | 0.15 | kgCO2/km |
| Vegetarian Diet | 1500-2000 | kgCO2/year |
| Non-vegetarian Diet | 2500-3000 | kgCO2/year |

### Recommended Improvements

1. **Add proper error handling** with meaningful error messages
2. **Update emission factors** to realistic values
3. **Add input validation** middleware
4. **Add CORS support** for web clients
5. **Fix the global variable** declaration
6. **Add comprehensive tests** (unit and integration)
7. **Add logging** for debugging and monitoring
8. **Add Swagger/OpenAPI documentation** for the API
9. **Add environment configuration** (dotenv)
10. **Add health check endpoint**

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
node server.cjs
# or
npm start
```

The server will start on port 8080.

### Example Request

```bash
curl -X POST http://localhost:8080/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "electricityUsageKwh": 500,
    "transportationUsagePerMonth": 200,
    "shortFlight": 2,
    "mediumFlight": 1,
    "largeFlight": 0,
    "dietaryChoice": "vegetarian"
  }'
```

### Example Response

```json
{
  "totalYearlyEmissions": {
    "value": 3747.144,
    "unit": "kgCO2/year"
  },
  "totalElectricityUsage": {
    "value": 2386.8,
    "unit": "kgCO2/year"
  },
  "totalTransportationUsage": {
    "value": 954.72,
    "unit": "kgCO2/year"
  },
  "totalEmissionFlight": {
    "value": 5.624,
    "unit": "kgCO2/year"
  },
  "dietaryChoiceEmission": {
    "value": 400,
    "unit": "kgCO2/year"
  }
}
```

## 📝 API Documentation

### POST /calculate

Calculate yearly carbon emissions based on usage patterns.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| electricityUsageKwh | number | Yes | Monthly electricity usage in kWh |
| transportationUsagePerMonth | number | Yes | Monthly transportation distance |
| shortFlight | number | Yes | Number of short flights per year |
| mediumFlight | number | Yes | Number of medium flights per year |
| largeFlight | number | Yes | Number of large flights per year |
| dietaryChoice | string | Yes | Either "vegetarian" or "non_vegetarian" |

**Response:**

Returns a JSON object with emission breakdowns:
- `totalYearlyEmissions`: Total emissions for the year
- `totalElectricityUsage`: Yearly electricity emissions
- `totalTransportationUsage`: Yearly transportation emissions
- `totalEmissionFlight`: Yearly flight emissions
- `dietaryChoiceEmission`: Yearly dietary emissions

## 🔧 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Language**: JavaScript

## 📄 License

ISC

## 👤 Author

Karthik-Dsa
