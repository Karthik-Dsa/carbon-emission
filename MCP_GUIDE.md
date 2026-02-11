# Building an MCP Server from Scratch

## What is MCP (Model Context Protocol)?

The **Model Context Protocol (MCP)** is an open protocol developed by Anthropic that enables seamless integration between AI applications (like Claude) and external data sources and tools. It provides a standardized way for AI models to:

- Access data from various sources (databases, APIs, file systems)
- Execute tools and functions
- Interact with external systems in a secure, controlled manner

## Why Build an MCP Server?

MCP servers allow you to:
1. **Extend AI Capabilities**: Give AI models access to your specific data and tools
2. **Maintain Security**: Control what data and operations the AI can access
3. **Enable Real-time Data**: Provide up-to-date information instead of relying on training data
4. **Custom Integration**: Connect AI to your unique systems and workflows

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   MCP Client    │◄───────►│   MCP Server    │◄───────►│  Data Sources   │
│  (e.g., Claude) │         │  (Your Code)    │         │   & Tools       │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Key Components of an MCP Server

1. **Resources**: Data sources that can be read (files, database records, etc.)
2. **Tools**: Functions that can be executed (calculations, API calls, etc.)
3. **Prompts**: Pre-defined prompts or templates
4. **Transport Layer**: Communication mechanism (stdio, HTTP, SSE)

## Step-by-Step Guide to Building an MCP Server

### Step 1: Project Setup

```bash
# Create a new directory
mkdir carbon-emission-mcp
cd carbon-emission-mcp

# Initialize npm project
npm init -y

# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Install other dependencies
npm install zod  # For input validation
```

### Step 2: Create the Basic MCP Server Structure

Create a file `mcp-server.js`:

```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Create the server instance
const server = new Server(
  {
    name: 'carbon-emission-calculator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Your server logic will go here

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Carbon Emission MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

### Step 3: Define Your Tools

Tools are functions that the AI can call. Let's add a carbon calculator tool:

```javascript
// Add this before the main() function

// Tool definitions
const TOOLS = [
  {
    name: 'calculate_carbon_emissions',
    description: 'Calculate yearly carbon emissions based on lifestyle factors including electricity, transportation, flights, and diet',
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
];

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});
```

### Step 4: Implement Tool Execution Logic

```javascript
// Add this with your tool definitions

// Emission factors (kgCO2 per unit)
const EMISSION_FACTORS = {
  electricity: 0.42, // kgCO2/kWh (US average)
  transportation: 0.12, // kgCO2/km (car average)
  shortFlight: 390, // kgCO2 per flight (<1500km)
  mediumFlight: 666, // kgCO2 per flight (1500-3700km)
  longFlight: 2000, // kgCO2 per flight (>3700km)
  diet: {
    vegetarian: 1750, // kgCO2/year
    non_vegetarian: 2850, // kgCO2/year
  },
};

function calculateCarbonEmissions(params) {
  const {
    electricityUsageKwh,
    transportationKmPerMonth,
    shortFlights,
    mediumFlights,
    longFlights,
    dietType,
  } = params;

  // Calculate yearly emissions for each category
  const electricityEmissions = electricityUsageKwh * EMISSION_FACTORS.electricity * 12;
  const transportationEmissions = transportationKmPerMonth * EMISSION_FACTORS.transportation * 12;
  const shortFlightEmissions = shortFlights * EMISSION_FACTORS.shortFlight;
  const mediumFlightEmissions = mediumFlights * EMISSION_FACTORS.mediumFlight;
  const longFlightEmissions = longFlights * EMISSION_FACTORS.longFlight;
  const dietEmissions = EMISSION_FACTORS.diet[dietType] || 0;

  const totalFlightEmissions = shortFlightEmissions + mediumFlightEmissions + longFlightEmissions;
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
      },
      transportation: {
        value: Math.round(transportationEmissions * 100) / 100,
        unit: 'kgCO2/year',
      },
      flights: {
        value: Math.round(totalFlightEmissions * 100) / 100,
        unit: 'kgCO2/year',
        details: {
          short: Math.round(shortFlightEmissions * 100) / 100,
          medium: Math.round(mediumFlightEmissions * 100) / 100,
          long: Math.round(longFlightEmissions * 100) / 100,
        },
      },
      diet: {
        value: Math.round(dietEmissions * 100) / 100,
        unit: 'kgCO2/year',
      },
    },
  };
}

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});
```

### Step 5: Add Resources (Optional)

Resources allow the AI to read data. Here's an example:

```javascript
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Update server capabilities
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
  
  throw new Error(`Unknown resource: ${request.params.uri}`);
});
```

### Step 6: Update package.json

Add ES module support and make the server executable:

```json
{
  "name": "carbon-emission-mcp",
  "version": "1.0.0",
  "description": "MCP server for carbon emission calculations",
  "type": "module",
  "main": "mcp-server.js",
  "bin": {
    "carbon-emission-mcp": "./mcp-server.js"
  },
  "scripts": {
    "start": "node mcp-server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "zod": "^3.22.0"
  }
}
```

### Step 7: Make the Server Executable

```bash
chmod +x mcp-server.js
```

### Step 8: Test the MCP Server

Create a test client `test-client.js`:

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMCPServer() {
  // Create client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['mcp-server.js'],
  });

  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  // List available tools
  console.log('Listing tools...');
  const tools = await client.listTools();
  console.log('Available tools:', JSON.stringify(tools, null, 2));

  // Call the calculation tool
  console.log('\nCalling calculate_carbon_emissions...');
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

  console.log('Result:', JSON.stringify(result, null, 2));

  // Close connection
  await client.close();
}

testMCPServer().catch(console.error);
```

Run the test:

```bash
node test-client.js
```

## Advanced Features

### 1. Add Input Validation with Zod

```javascript
import { z } from 'zod';

const EmissionInputSchema = z.object({
  electricityUsageKwh: z.number().min(0),
  transportationKmPerMonth: z.number().min(0),
  shortFlights: z.number().int().min(0),
  mediumFlights: z.number().int().min(0),
  longFlights: z.number().int().min(0),
  dietType: z.enum(['vegetarian', 'non_vegetarian']),
});

// Use in tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'calculate_carbon_emissions') {
    // Validate input
    const validatedInput = EmissionInputSchema.parse(request.params.arguments);
    const result = calculateCarbonEmissions(validatedInput);
    // ... rest of the code
  }
});
```

### 2. Add Error Handling

```javascript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === 'calculate_carbon_emissions') {
      const validatedInput = EmissionInputSchema.parse(request.params.arguments);
      const result = calculateCarbonEmissions(validatedInput);
      
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
```

### 3. Add Logging

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// Enable debug logging
process.env.DEBUG = 'mcp:*';

// Add custom logging
function log(message, data = {}) {
  console.error(`[${new Date().toISOString()}] ${message}`, data);
}

// Use in handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  log('Tool call received', { tool: request.params.name });
  // ... rest of the code
});
```

## Integrating with Claude Desktop

To use your MCP server with Claude Desktop, add it to the configuration:

**On macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**On Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "carbon-emission": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server.js"]
    }
  }
}
```

Restart Claude Desktop, and the carbon emission calculator will be available as a tool!

## Best Practices

1. **Validate All Inputs**: Always validate input data before processing
2. **Handle Errors Gracefully**: Provide meaningful error messages
3. **Document Your Tools**: Write clear descriptions for each tool
4. **Use Appropriate Data Types**: Define precise input schemas
5. **Test Thoroughly**: Test with various input combinations
6. **Log Important Events**: Keep track of tool calls and errors
7. **Version Your Server**: Use semantic versioning for changes
8. **Secure Sensitive Data**: Don't expose credentials or sensitive information
9. **Rate Limit**: Consider adding rate limiting for expensive operations
10. **Cache When Possible**: Cache results for identical requests

## Complete File Structure

```
carbon-emission-mcp/
├── package.json
├── package-lock.json
├── mcp-server.js        # Main MCP server
├── test-client.js       # Test client
├── README.md            # Documentation
└── node_modules/        # Dependencies
```

## Resources

- **MCP Documentation**: https://modelcontextprotocol.io/
- **MCP SDK**: https://github.com/modelcontextprotocol/sdk
- **Example Servers**: https://github.com/modelcontextprotocol/servers
- **Specification**: https://spec.modelcontextprotocol.io/

## Conclusion

You now have a complete guide to building an MCP server from scratch! The key steps are:

1. Set up project with MCP SDK
2. Create server instance with capabilities
3. Define your tools with clear schemas
4. Implement tool execution logic
5. Add resources if needed
6. Test thoroughly
7. Configure for use with Claude or other MCP clients

With this foundation, you can extend the server to include more tools, connect to databases, integrate with APIs, and create powerful AI-driven applications!
