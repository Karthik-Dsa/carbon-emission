# Quick Start Guide

Get started with the Carbon Emission Calculator in minutes!

## 🚀 Quick Installation

```bash
# Clone the repository
git clone https://github.com/Karthik-Dsa/carbon-emission.git
cd carbon-emission

# Install dependencies
npm install

# Test both servers
npm start              # Start REST API server (in one terminal)
npm run test-mcp      # Test MCP server (in another terminal)
```

## 📖 What's Included

This repository contains:

1. **REST API Server** (`server.cjs`) - A simple Express.js API for carbon emission calculations
2. **MCP Server** (`mcp-server.js`) - A Model Context Protocol server for AI integration
3. **Documentation** - Comprehensive guides on building MCP servers from scratch

## 🎯 Quick Examples

### Using the REST API

Start the server:
```bash
npm start
```

Make a request:
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

### Using the MCP Server with Claude

1. Install dependencies: `npm install`
2. Follow the setup guide in [CLAUDE_SETUP.md](CLAUDE_SETUP.md)
3. Restart Claude Desktop
4. Ask Claude: "Calculate my carbon emissions for 500 kWh electricity per month, 200 km driving, 2 short flights, vegetarian diet"

## 📚 Documentation

- **[README.md](README.md)** - Complete analysis of the calculator, API documentation, and issues found
- **[MCP_GUIDE.md](MCP_GUIDE.md)** - Step-by-step guide to building MCP servers from scratch
- **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** - How to integrate with Claude Desktop

## 🔧 Available Commands

```bash
npm start        # Start REST API server on port 8080
npm run mcp      # Start MCP server (for testing with stdio)
npm run test-mcp # Run MCP server tests
```

## 🌟 Key Features

### REST API
- Calculate yearly carbon emissions
- Breakdown by category (electricity, transportation, flights, diet)
- JSON input and output
- Express.js based

### MCP Server
- Two tools:
  - `calculate_carbon_emissions` - Calculate emissions
  - `compare_emission_scenarios` - Compare two lifestyle scenarios
- Two resources:
  - `emission://factors` - View emission factors
  - `emission://guide` - Get reduction tips
- Full Claude Desktop integration

## 🎓 Learning Resources

### Want to Build Your Own MCP Server?

Check out [MCP_GUIDE.md](MCP_GUIDE.md) for:
- Understanding MCP architecture
- Setting up an MCP project
- Defining tools and resources
- Testing your server
- Integration with Claude Desktop
- Best practices and advanced features

### Example Use Cases

**In Claude:**
- "Calculate my carbon footprint"
- "Compare my current lifestyle with an eco-friendly one"
- "Show me the emission factors you use"
- "Give me tips for reducing emissions"

## 📊 Sample Output

```json
{
  "totalYearlyEmissions": {
    "value": 6004,
    "unit": "kgCO2/year"
  },
  "breakdown": {
    "electricity": {
      "value": 2520,
      "unit": "kgCO2/year",
      "percentage": 41.97
    },
    "transportation": {
      "value": 288,
      "unit": "kgCO2/year",
      "percentage": 4.8
    },
    "flights": {
      "value": 1446,
      "unit": "kgCO2/year",
      "percentage": 24.08
    },
    "diet": {
      "value": 1750,
      "unit": "kgCO2/year",
      "percentage": 29.15
    }
  }
}
```

## 🔍 Issues & Improvements

The original calculator has been analyzed and documented. See [README.md](README.md) for:
- Issues found in the current implementation
- Recommended improvements
- Realistic emission factors
- Best practices

## 🤝 Contributing

Found an issue or want to improve the calculator? Feel free to:
1. Fork the repository
2. Make your changes
3. Submit a pull request

## 📝 License

ISC

## 👤 Author

Karthik-Dsa

---

**Ready to get started?** Pick a path:
- **API User**: Start with `npm start` and use the REST API
- **AI Integration**: Follow [CLAUDE_SETUP.md](CLAUDE_SETUP.md) to use with Claude
- **MCP Developer**: Read [MCP_GUIDE.md](MCP_GUIDE.md) to build your own MCP server

Happy calculating! 🌍💚
