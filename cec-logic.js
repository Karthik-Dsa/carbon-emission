// Emission factors (kg CO2)
const ELECTRICITY_EMISSION_FACTOR = 0.3978; // kg CO2 per kWh (US average grid mix)
const TRANSPORTATION_EMISSION_FACTOR = 9.087; // kg CO2 per km
const SHORT_FLIGHT_FACTOR = 100; // kg CO2 per short flight
const MEDIUM_FLIGHT_FACTOR = 200; // kg CO2 per medium flight  
const LARGE_FLIGHT_FACTOR = 300; // kg CO2 per long flight
const DIETARY_EMISSION_FACTORS = {
    vegetarian: 400, // kg CO2 per year
    non_vegetarian: 800 // kg CO2 per year
};
const MONTHS_PER_YEAR = 12;

// Main Logic to calculate Carbon emissions
export function calculateCarbonStats(data) {
    // Validate and extract inputs with defaults
    const electricityUsageKwh = parseFloat(data.electricityUsageKwh) || 0;
    const transportationUsagePerMonth = parseFloat(data.transportationUsagePerMonth) || 0;
    const shortFlight = parseInt(data.shortFlight) || 0;
    const mediumFlight = parseInt(data.mediumFlight) || 0;
    const largeFlight = parseInt(data.largeFlight) || 0;
    const dietaryChoice = (data.dietaryChoice || '').toLowerCase();

    // Validate non-negative values
    if (electricityUsageKwh < 0 || transportationUsagePerMonth < 0 || 
        shortFlight < 0 || mediumFlight < 0 || largeFlight < 0) {
        throw new Error('Values cannot be negative');
    }

    // Calculate monthly emissions
    const electricityEmission = electricityUsageKwh * ELECTRICITY_EMISSION_FACTOR;
    const transportationEmission = transportationUsagePerMonth * TRANSPORTATION_EMISSION_FACTOR;

    // Calculate flight emissions (yearly)
    const airTravelShortFlight = shortFlight * SHORT_FLIGHT_FACTOR;
    const airTravelMediumFlight = mediumFlight * MEDIUM_FLIGHT_FACTOR;
    const airTravelLargeFlight = largeFlight * LARGE_FLIGHT_FACTOR;
    const totalEmissionFlight = airTravelShortFlight + airTravelMediumFlight + airTravelLargeFlight;

    // Get dietary emissions (yearly)
    const dietaryChoiceEmission = DIETARY_EMISSION_FACTORS[dietaryChoice] || 0;

    // Calculate yearly totals
    const totalElectricityUsage = electricityEmission * MONTHS_PER_YEAR;
    const totalTransportationUsage = transportationEmission * MONTHS_PER_YEAR;

    const totalYearlyEmissions = dietaryChoiceEmission + totalEmissionFlight + 
                                  totalElectricityUsage + totalTransportationUsage;

    return {
        totalYearlyEmissions: { value: Math.round(totalYearlyEmissions * 100) / 100, unit: 'kgCO2/year' },
        totalElectricityUsage: { value: Math.round(totalElectricityUsage * 100) / 100, unit: 'kgCO2/year' },
        totalTransportationUsage: { value: Math.round(totalTransportationUsage * 100) / 100, unit: 'kgCO2/year' },
        totalEmissionFlight: { value: Math.round(totalEmissionFlight * 100) / 100, unit: 'kgCO2/year' },
        dietaryChoiceEmission: { value: dietaryChoiceEmission, unit: 'kgCO2/year' }
    };
}