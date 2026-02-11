const express = require('express');

const app = express();

const port = 8080;

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
        const transportationFactor = 0.3978;
        const shortFlightFactor = 0.3978;
        const mediumFlightFactor = 0.3978;
        const largeFlightFactor = 0.3978;
        const dietaryChoiceFactor = {
            vegetarian : 400,
            non_vegetarian : 800
        }
        
        year = 12;

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

app.listen(port, () => {
    console.log(`server is started on ${port}`);
});