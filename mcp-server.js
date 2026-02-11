#!/usr/bin/env node

/**
 * Carbon Emission Calculator MCP Server
 * 
 * This is a Model Context Protocol (MCP) server that provides carbon emission
 * calculation tools to AI assistants like Claude.
 * 
 * To use with Claude Desktop, add this to your claude_desktop_config.json:
 * {
 *   "mcpServers": {
 *     "carbon-emission": {
 *       "command": "node",
 *       "args": ["/absolute/path/to/mcp-server.js"]
 *     }
 *   }
 * }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Emission factors (based on scientific data)
const EMISSION_FACTORS = {
  electricity: 0.42, // kgCO2/kWh (US average)
  transportation: 0.12, // kgCO2/km (average car)
  shortFlight: 390, // kgCO2 per flight (<1500km)
  mediumFlight: 666, // kgCO2 per flight (1500-3700km)
  longFlight: 2000, // kgCO2 per flight (>3700km)
  diet: {
    vegetarian: 1750, // kgCO2/year
    non_vegetarian: 2850, // kgCO2/year
  },
};

// Tool definitions
const TOOLS = [
  {
    name: 'calculate_carbon_emissions',
    description:
      'Calculate yearly carbon emissions based on lifestyle factors including electricity usage, transportation, flights, and diet. Returns a detailed breakdown of emissions by category.',
    inputSchema: {
      type: 'object',
      properties: {
        electricityUsageKwh: {
          type: 'number',
          description: 'Monthly electricity usage in kilowatt-hours (kWh)',
        },
        transportationKmPerMonth: {
          type: 'number',
          description: 'Monthly transportation distance in kilometers',
        },
        shortFlights: {
          type: 'number',
          description: 'Number of short-haul flights (<1500 km) per year',
        },
        mediumFlights: {
          type: 'number',
          description: 'Number of medium-haul flights (1500-3700 km) per year',
        },
        longFlights: {
          type: 'number',
          description: 'Number of long-haul flights (>3700 km) per year',
        },
        dietType: {
          type: 'string',
          enum: ['vegetarian', 'non_vegetarian'],
          description: 'Dietary preference: vegetarian or non_vegetarian',
        },
      },
      required: [
        'electricityUsageKwh',
        'transportationKmPerMonth',
        'shortFlights',
        'mediumFlights',
        'longFlights',
        'dietType',
      ],
    },
  },
  {
    name: 'compare_emission_scenarios',
    description:
      'Compare carbon emissions between two different lifestyle scenarios to see the environmental impact of lifestyle changes.',
    inputSchema: {
      type: 'object',
      properties: {
        scenario1: {
          type: 'object',
          description: 'First lifestyle scenario',
          properties: {
            name: { type: 'string' },
            electricityUsageKwh: { type: 'number' },
            transportationKmPerMonth: { type: 'number' },
            shortFlights: { type: 'number' },
            mediumFlights: { type: 'number' },
            longFlights: { type: 'number' },
            dietType: { type: 'string', enum: ['vegetarian', 'non_vegetarian'] },
          },
        },
        scenario2: {
          type: 'object',
          description: 'Second lifestyle scenario',
          properties: {
            name: { type: 'string' },
            electricityUsageKwh: { type: 'number' },
            transportationKmPerMonth: { type: 'number' },
            shortFlights: { type: 'number' },
            mediumFlights: { type: 'number' },
            longFlights: { type: 'number' },
            dietType: { type: 'string', enum: ['vegetarian', 'non_vegetarian'] },
          },
        },
      },
      required: ['scenario1', 'scenario2'],
    },
  },
];

/**
 * Calculate carbon emissions for given parameters
 */
function calculateCarbonEmissions(params) {
  const {
    electricityUsageKwh,
    transportationKmPerMonth,
    shortFlights,
    mediumFlights,
    longFlights,
    dietType,
  } = params;

  // Validate inputs
  if (electricityUsageKwh < 0 || transportationKmPerMonth < 0) {
    throw new Error('Usage values must be non-negative');
  }

  if (shortFlights < 0 || mediumFlights < 0 || longFlights < 0) {
    throw new Error('Flight counts must be non-negative');
  }

  // Calculate yearly emissions for each category
  const electricityEmissions = electricityUsageKwh * EMISSION_FACTORS.electricity * 12;
  const transportationEmissions =
    transportationKmPerMonth * EMISSION_FACTORS.transportation * 12;
  const shortFlightEmissions = shortFlights * EMISSION_FACTORS.shortFlight;
  const mediumFlightEmissions = mediumFlights * EMISSION_FACTORS.mediumFlight;
  const longFlightEmissions = longFlights * EMISSION_FACTORS.longFlight;
  const dietEmissions = EMISSION_FACTORS.diet[dietType] || 0;

  const totalFlightEmissions =
    shortFlightEmissions + mediumFlightEmissions + longFlightEmissions;
  const totalYearlyEmissions =
    electricityEmissions +
    transportationEmissions +
    totalFlightEmissions +
    dietEmissions;

  return {
    totalYearlyEmissions: {
      value: Math.round(totalYearlyEmissions * 100) / 100,
      unit: 'kgCO2/year',
    },
    breakdown: {
      electricity: {
        value: Math.round(electricityEmissions * 100) / 100,
        unit: 'kgCO2/year',
        percentage: Math.round((electricityEmissions / totalYearlyEmissions) * 10000) / 100,
      },
      transportation: {
        value: Math.round(transportationEmissions * 100) / 100,
        unit: 'kgCO2/year',
        percentage: Math.round((transportationEmissions / totalYearlyEmissions) * 10000) / 100,
      },
      flights: {
        value: Math.round(totalFlightEmissions * 100) / 100,
        unit: 'kgCO2/year',
        percentage: Math.round((totalFlightEmissions / totalYearlyEmissions) * 10000) / 100,
        details: {
          short: Math.round(shortFlightEmissions * 100) / 100,
          medium: Math.round(mediumFlightEmissions * 100) / 100,
          long: Math.round(longFlightEmissions * 100) / 100,
        },
      },
      diet: {
        value: Math.round(dietEmissions * 100) / 100,
        unit: 'kgCO2/year',
        percentage: Math.round((dietEmissions / totalYearlyEmissions) * 10000) / 100,
      },
    },
  };
}

/**
 * Compare two emission scenarios
 */
function compareScenarios(scenario1, scenario2) {
  const result1 = calculateCarbonEmissions(scenario1);
  const result2 = calculateCarbonEmissions(scenario2);

  const difference = result2.totalYearlyEmissions.value - result1.totalYearlyEmissions.value;
  const percentageChange =
    ((difference / result1.totalYearlyEmissions.value) * 100).toFixed(2);

  return {
    scenario1: {
      name: scenario1.name || 'Scenario 1',
      emissions: result1,
    },
    scenario2: {
      name: scenario2.name || 'Scenario 2',
      emissions: result2,
    },
    comparison: {
      difference: {
        value: Math.round(Math.abs(difference) * 100) / 100,
        unit: 'kgCO2/year',
      },
      percentageChange: percentageChange + '%',
      impact:
        difference < 0
          ? `Scenario 2 reduces emissions by ${Math.abs(Math.round(difference * 100) / 100)} kgCO2/year`
          : difference > 0
          ? `Scenario 2 increases emissions by ${Math.round(difference * 100) / 100} kgCO2/year`
          : 'Both scenarios have the same emissions',
    },
  };
}

// Create the MCP server
const server = new Server(
  {
    name: 'carbon-emission-calculator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === 'calculate_carbon_emissions') {
      const result = calculateCarbonEmissions(request.params.arguments);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (request.params.name === 'compare_emission_scenarios') {
      const { scenario1, scenario2 } = request.params.arguments;
      const result = compareScenarios(scenario1, scenario2);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'emission://factors',
        name: 'Emission Factors',
        description: 'Standard carbon emission factors used in calculations',
        mimeType: 'application/json',
      },
      {
        uri: 'emission://guide',
        name: 'Carbon Reduction Guide',
        description: 'Tips and guidelines for reducing carbon emissions',
        mimeType: 'text/plain',
      },
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'emission://factors') {
    return {
      contents: [
        {
          uri: 'emission://factors',
          mimeType: 'application/json',
          text: JSON.stringify(EMISSION_FACTORS, null, 2),
        },
      ],
    };
  }

  if (request.params.uri === 'emission://guide') {
    const guide = `Carbon Emission Reduction Guide

1. ELECTRICITY
   - Switch to renewable energy providers
   - Use energy-efficient appliances (LED bulbs, Energy Star rated)
   - Improve home insulation
   - Install smart thermostats
   - Use solar panels if possible

2. TRANSPORTATION
   - Use public transportation, cycling, or walking
   - Carpool when driving is necessary
   - Consider electric or hybrid vehicles
   - Maintain vehicle properly for better fuel efficiency
   - Combine errands to reduce trips

3. AIR TRAVEL
   - Fly less frequently
   - Choose direct flights (takeoff/landing use most fuel)
   - Fly economy class (uses less space per passenger)
   - Consider train or bus for shorter distances
   - Purchase carbon offsets

4. DIET
   - Eat more plant-based meals
   - Reduce meat consumption, especially beef and lamb
   - Buy local and seasonal produce
   - Reduce food waste
   - Grow your own food if possible

5. OTHER ACTIONS
   - Reduce, reuse, recycle
   - Buy second-hand when possible
   - Support companies with sustainable practices
   - Offset remaining emissions through verified programs
`;

    return {
      contents: [
        {
          uri: 'emission://guide',
          mimeType: 'text/plain',
          text: guide,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${request.params.uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Carbon Emission MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
