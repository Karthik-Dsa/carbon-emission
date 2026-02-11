#!/usr/bin/env node

/**
 * Test Client for Carbon Emission MCP Server
 * 
 * This client demonstrates how to connect to and use the MCP server.
 * Run with: node test-mcp-client.js
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMCPServer() {
  console.log('🧪 Testing Carbon Emission MCP Server\n');
  console.log('='.repeat(60));

  try {
    // Create transport
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['mcp-server.js'],
    });

    // Create client
    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    console.log('📡 Connecting to MCP server...');
    await client.connect(transport);
    console.log('✅ Connected successfully!\n');

    // Test 1: List available tools
    console.log('='.repeat(60));
    console.log('📋 TEST 1: Listing available tools');
    console.log('='.repeat(60));
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tool(s):`);
    tools.tools.forEach((tool, index) => {
      console.log(`\n${index + 1}. ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
    });

    // Test 2: Calculate carbon emissions
    console.log('\n' + '='.repeat(60));
    console.log('🧮 TEST 2: Calculate carbon emissions');
    console.log('='.repeat(60));
    console.log('Input parameters:');
    const testParams = {
      electricityUsageKwh: 500,
      transportationKmPerMonth: 200,
      shortFlights: 2,
      mediumFlights: 1,
      longFlights: 0,
      dietType: 'vegetarian',
    };
    console.log(JSON.stringify(testParams, null, 2));

    const calculationResult = await client.callTool({
      name: 'calculate_carbon_emissions',
      arguments: testParams,
    });

    console.log('\n📊 Result:');
    const parsedResult = JSON.parse(calculationResult.content[0].text);
    console.log(JSON.stringify(parsedResult, null, 2));

    // Test 3: Compare two scenarios
    console.log('\n' + '='.repeat(60));
    console.log('⚖️  TEST 3: Compare emission scenarios');
    console.log('='.repeat(60));
    
    const comparisonParams = {
      scenario1: {
        name: 'Current Lifestyle',
        electricityUsageKwh: 500,
        transportationKmPerMonth: 300,
        shortFlights: 4,
        mediumFlights: 2,
        longFlights: 1,
        dietType: 'non_vegetarian',
      },
      scenario2: {
        name: 'Eco-Friendly Lifestyle',
        electricityUsageKwh: 300,
        transportationKmPerMonth: 150,
        shortFlights: 1,
        mediumFlights: 0,
        longFlights: 0,
        dietType: 'vegetarian',
      },
    };

    console.log('Comparing scenarios:');
    console.log('Scenario 1:', comparisonParams.scenario1.name);
    console.log('Scenario 2:', comparisonParams.scenario2.name);

    const comparisonResult = await client.callTool({
      name: 'compare_emission_scenarios',
      arguments: comparisonParams,
    });

    console.log('\n📊 Comparison Result:');
    const parsedComparison = JSON.parse(comparisonResult.content[0].text);
    console.log(JSON.stringify(parsedComparison, null, 2));

    // Test 4: List available resources
    console.log('\n' + '='.repeat(60));
    console.log('📚 TEST 4: Listing available resources');
    console.log('='.repeat(60));
    const resources = await client.listResources();
    console.log(`Found ${resources.resources.length} resource(s):`);
    resources.resources.forEach((resource, index) => {
      console.log(`\n${index + 1}. ${resource.name}`);
      console.log(`   URI: ${resource.uri}`);
      console.log(`   Description: ${resource.description}`);
    });

    // Test 5: Read emission factors resource
    console.log('\n' + '='.repeat(60));
    console.log('📖 TEST 5: Reading emission factors resource');
    console.log('='.repeat(60));
    const factorsResource = await client.readResource({
      uri: 'emission://factors',
    });
    console.log('Emission Factors:');
    console.log(factorsResource.contents[0].text);

    // Test 6: Read reduction guide resource
    console.log('\n' + '='.repeat(60));
    console.log('📖 TEST 6: Reading carbon reduction guide');
    console.log('='.repeat(60));
    const guideResource = await client.readResource({
      uri: 'emission://guide',
    });
    console.log(guideResource.contents[0].text);

    // Close connection
    console.log('\n' + '='.repeat(60));
    console.log('🔌 Closing connection...');
    await client.close();
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testMCPServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
