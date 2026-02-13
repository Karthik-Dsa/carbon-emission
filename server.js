const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const port = 8080;

// Enable CORS for development
app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    try {
        const {
            electricityUsageKwh,
            transportationUsagePerMonth,
            shortFlight,
            mediumFlight,
            largeFlight,
            dietaryChoice

        } = req.body

        const electricityFactor = 0.3978;
        const transportationFactor = 9.087;
        const shortFlightFactor = 100;
        const mediumFlightFactor = 200;
        const largeFlightFactor = 300;
        const dietaryChoiceFactor = {
            vegetarian : 400,
            non_vegetarian : 800
        }
        
        const year = 12;

        const electricityEmission = electricityUsageKwh * electricityFactor;
        const transportationEmission = transportationUsagePerMonth * transportationFactor;

        const airTravelShortFlight = shortFlight * shortFlightFactor;
        const airTravelMediumFlight = mediumFlight * mediumFlightFactor;
        const airTravelLargrFlight = largeFlight * largeFlightFactor;

        const dietaryChoiceEmission = dietaryChoiceFactor[dietaryChoice] || 0;

        const totalEmissionFlight = airTravelShortFlight + airTravelMediumFlight + airTravelLargrFlight;
        
        const totalElectricityUsage = electricityEmission * year;
        const totalTransportationUsage = transportationEmission * year;

        const totalYearlyEmissions = dietaryChoiceEmission + totalEmissionFlight + totalElectricityUsage + totalTransportationUsage;

        const result = {
            totalYearlyEmissions : {value: totalYearlyEmissions, unit: 'kgCO2/year'},
            totalElectricityUsage : {value: totalElectricityUsage, unit: 'kgCO2/year'},
            totalTransportationUsage : {value: totalTransportationUsage, unit: 'kgCO2/year'},
            totalEmissionFlight : {value: totalEmissionFlight, unit: 'kgCO2/year'},
            dietaryChoiceEmission : {value: dietaryChoiceEmission, unit: 'kgCO2/year'}
        }

        res.json(result);

    } catch (error) {
        
    }
})

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`server is started on ${port}`);
});