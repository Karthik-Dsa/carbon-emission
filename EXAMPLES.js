// Example: Using the Carbon Emission Calculator MCP Server
//
// This file demonstrates various ways to interact with the MCP server
// both programmatically and through Claude Desktop

/**
 * EXAMPLE 1: Basic Carbon Calculation
 * 
 * Ask Claude:
 * "Calculate my yearly carbon emissions with:
 *  - 500 kWh electricity per month
 *  - 200 km transportation per month
 *  - 2 short flights per year
 *  - 1 medium flight per year
 *  - Vegetarian diet"
 * 
 * Expected Output:
 * Claude will use the calculate_carbon_emissions tool and return something like:
 * 
 * "Based on your inputs, your yearly carbon emissions are approximately 6,004 kg CO2.
 * 
 * Here's the breakdown:
 * - Electricity: 2,520 kg CO2/year (41.97%)
 * - Transportation: 288 kg CO2/year (4.8%)
 * - Flights: 1,446 kg CO2/year (24.08%)
 *   - Short flights: 780 kg CO2
 *   - Medium flights: 666 kg CO2
 * - Diet: 1,750 kg CO2/year (29.15%)"
 */

/**
 * EXAMPLE 2: Comparing Scenarios
 * 
 * Ask Claude:
 * "Compare two scenarios for me:
 * 
 * Scenario 1 - Current:
 * - 600 kWh electricity per month
 * - 300 km driving per month
 * - 4 short, 2 medium, 1 long flight per year
 * - Non-vegetarian diet
 * 
 * Scenario 2 - Eco-friendly:
 * - 300 kWh electricity per month
 * - 150 km driving per month
 * - 1 short flight per year
 * - Vegetarian diet"
 * 
 * Expected Output:
 * Claude will use the compare_emission_scenarios tool and provide a detailed comparison
 * showing the reduction in emissions when switching to the eco-friendly lifestyle.
 */

/**
 * EXAMPLE 3: Understanding Emission Factors
 * 
 * Ask Claude:
 * "What emission factors do you use for calculations?"
 * 
 * Expected Output:
 * Claude will access the emission://factors resource and explain:
 * - Electricity: 0.42 kgCO2/kWh
 * - Transportation: 0.12 kgCO2/km
 * - Short flights: 390 kgCO2 per flight
 * - Medium flights: 666 kgCO2 per flight
 * - Long flights: 2000 kgCO2 per flight
 * - Vegetarian diet: 1750 kgCO2/year
 * - Non-vegetarian diet: 2850 kgCO2/year
 */

/**
 * EXAMPLE 4: Getting Reduction Tips
 * 
 * Ask Claude:
 * "How can I reduce my carbon emissions?"
 * 
 * Expected Output:
 * Claude will access the emission://guide resource and provide personalized tips
 * for reducing emissions in each category.
 */

/**
 * EXAMPLE 5: Complex Analysis
 * 
 * Ask Claude:
 * "I currently use 700 kWh of electricity per month, drive 400 km per month,
 * take 6 short flights and 3 medium flights per year, and eat a non-vegetarian diet.
 * Calculate my carbon footprint, tell me which area has the biggest impact,
 * and suggest the most effective way to reduce my emissions by at least 30%."
 * 
 * Expected Output:
 * Claude will:
 * 1. Use calculate_carbon_emissions to get your current footprint
 * 2. Analyze which category contributes most
 * 3. Create multiple scenarios using compare_emission_scenarios
 * 4. Recommend specific changes to achieve the 30% reduction target
 * 5. Use the emission guide to provide practical tips
 */

/**
 * EXAMPLE 6: Programmatic Usage (for developers building MCP clients)
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function calculateEmissions() {
  // Create transport to connect to the MCP server
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['mcp-server.js'],
  });

  // Create client
  const client = new Client(
    {
      name: 'my-carbon-app',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // Connect
  await client.connect(transport);

  // Call the calculation tool
  const result = await client.callTool({
    name: 'calculate_carbon_emissions',
    arguments: {
      electricityUsageKwh: 500,
      transportationKmPerMonth: 200,
      shortFlights: 2,
      mediumFlights: 1,
      longFlights: 0,
      dietType: 'vegetarian',
    },
  });

  // Parse and use the result
  const emissions = JSON.parse(result.content[0].text);
  console.log('Total yearly emissions:', emissions.totalYearlyEmissions.value, 'kgCO2');
  console.log('Electricity contributes:', emissions.breakdown.electricity.percentage, '%');

  // Compare two scenarios
  const comparison = await client.callTool({
    name: 'compare_emission_scenarios',
    arguments: {
      scenario1: {
        name: 'Current',
        electricityUsageKwh: 500,
        transportationKmPerMonth: 300,
        shortFlights: 4,
        mediumFlights: 2,
        longFlights: 1,
        dietType: 'non_vegetarian',
      },
      scenario2: {
        name: 'Improved',
        electricityUsageKwh: 350,
        transportationKmPerMonth: 200,
        shortFlights: 2,
        mediumFlights: 1,
        longFlights: 0,
        dietType: 'vegetarian',
      },
    },
  });

  const comparisonResult = JSON.parse(comparison.content[0].text);
  console.log('Impact:', comparisonResult.comparison.impact);

  // Read resources
  const factors = await client.readResource({
    uri: 'emission://factors',
  });
  console.log('Emission factors:', factors.contents[0].text);

  // Close connection
  await client.close();
}

// Uncomment to run:
// calculateEmissions().catch(console.error);

/**
 * EXAMPLE 7: Web Application Integration
 * 
 * If you're building a web app, you could create an Express.js middleware
 * that uses the MCP server:
 */

/*
import express from 'express';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const app = express();
app.use(express.json());

// Create a persistent MCP client
let mcpClient;

async function initMCPClient() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['mcp-server.js'],
  });
  
  mcpClient = new Client({
    name: 'web-app',
    version: '1.0.0',
  }, {
    capabilities: {},
  });
  
  await mcpClient.connect(transport);
}

app.post('/api/calculate', async (req, res) => {
  try {
    const result = await mcpClient.callTool({
      name: 'calculate_carbon_emissions',
      arguments: req.body,
    });
    
    const emissions = JSON.parse(result.content[0].text);
    res.json(emissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/compare', async (req, res) => {
  try {
    const result = await mcpClient.callTool({
      name: 'compare_emission_scenarios',
      arguments: req.body,
    });
    
    const comparison = JSON.parse(result.content[0].text);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize MCP client on startup
initMCPClient().then(() => {
  app.listen(3000, () => {
    console.log('Web app running on port 3000');
  });
});
*/

/**
 * BEST PRACTICES
 * 
 * 1. Always validate inputs before passing to the MCP server
 * 2. Handle errors gracefully
 * 3. Close connections when done
 * 4. Use async/await for cleaner code
 * 5. Parse JSON responses carefully
 * 6. Consider caching results for identical requests
 * 7. Monitor the MCP server logs for debugging
 */

export { calculateEmissions };
