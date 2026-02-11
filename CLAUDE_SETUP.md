# Claude Desktop Configuration Guide

This guide shows you how to integrate the Carbon Emission Calculator MCP server with Claude Desktop.

## Prerequisites

1. **Claude Desktop** installed on your system
2. **Node.js** (version 16 or higher)
3. **MCP server dependencies** installed

## Installation Steps

### 1. Install Dependencies

First, navigate to the project directory and install the required dependencies:

```bash
cd /path/to/carbon-emission
npm install
```

This will install:
- `express` - For the REST API server
- `@modelcontextprotocol/sdk` - For the MCP server

### 2. Test the MCP Server (Optional but Recommended)

Before integrating with Claude, test that the MCP server works:

```bash
npm run test-mcp
```

You should see output showing successful tool calls and resource access.

### 3. Locate Claude Desktop Configuration File

The configuration file location depends on your operating system:

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### 4. Edit Configuration File

Open the configuration file in a text editor. If the file doesn't exist, create it.

Add the carbon emission calculator MCP server configuration:

```json
{
  "mcpServers": {
    "carbon-emission": {
      "command": "node",
      "args": [
        "/absolute/path/to/carbon-emission/mcp-server.js"
      ]
    }
  }
}
```

**Important:** Replace `/absolute/path/to/carbon-emission/` with the actual absolute path to your project directory.

#### Example Configurations

**macOS/Linux Example:**
```json
{
  "mcpServers": {
    "carbon-emission": {
      "command": "node",
      "args": [
        "/Users/yourname/projects/carbon-emission/mcp-server.js"
      ]
    }
  }
}
```

**Windows Example:**
```json
{
  "mcpServers": {
    "carbon-emission": {
      "command": "node",
      "args": [
        "C:\\Users\\YourName\\projects\\carbon-emission\\mcp-server.js"
      ]
    }
  }
}
```

### 5. If You Have Multiple MCP Servers

If you already have other MCP servers configured, add the carbon emission server to the existing list:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/files"
      ]
    },
    "carbon-emission": {
      "command": "node",
      "args": [
        "/absolute/path/to/carbon-emission/mcp-server.js"
      ]
    }
  }
}
```

### 6. Restart Claude Desktop

Close Claude Desktop completely and restart it. The MCP server should now be available.

## Using the Carbon Emission Calculator in Claude

Once configured, you can use the calculator in your conversations with Claude. Here are some example queries:

### Basic Calculation

```
Calculate my yearly carbon emissions with these details:
- Electricity usage: 500 kWh per month
- Transportation: 200 km per month
- Flights: 2 short flights, 1 medium flight per year
- Diet: vegetarian
```

### Scenario Comparison

```
Compare the carbon emissions between:
1. My current lifestyle with 600 kWh electricity, 300 km driving per month, 4 flights per year, and non-vegetarian diet
2. A more sustainable lifestyle with 300 kWh electricity, 150 km driving per month, 1 flight per year, and vegetarian diet
```

### Get Emission Factors

```
Show me the emission factors used in carbon calculations
```

### Get Reduction Tips

```
What are some tips for reducing my carbon emissions?
```

## Available Tools

The MCP server provides these tools to Claude:

1. **calculate_carbon_emissions** - Calculate yearly emissions based on lifestyle factors
2. **compare_emission_scenarios** - Compare two different lifestyle scenarios

## Available Resources

The MCP server provides these resources:

1. **emission://factors** - Standard emission factors used in calculations
2. **emission://guide** - Tips for reducing carbon emissions

## Troubleshooting

### Claude doesn't show the MCP server

1. **Check the configuration file path** - Make sure you edited the correct file
2. **Verify absolute paths** - Use complete paths, not relative paths
3. **Check JSON syntax** - Ensure your JSON is valid (use a JSON validator)
4. **Restart Claude completely** - Make sure Claude is fully closed before restarting

### "Module not found" errors

Run `npm install` in the carbon-emission directory to install dependencies:

```bash
cd /path/to/carbon-emission
npm install
```

### Server doesn't start

1. **Check Node.js version** - Ensure you have Node.js 16 or higher:
   ```bash
   node --version
   ```

2. **Test the server manually**:
   ```bash
   node mcp-server.js
   ```
   
   Press Ctrl+C to stop it after confirming it starts without errors.

3. **Check file permissions** - Make sure the mcp-server.js file is executable:
   ```bash
   chmod +x mcp-server.js
   ```

### View Server Logs

To see what's happening with the MCP server:

1. **macOS/Linux:**
   ```bash
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

2. **Windows:**
   Check the Claude logs directory in `%APPDATA%\Claude\Logs\`

## Advanced Configuration

### Environment Variables

You can pass environment variables to the MCP server:

```json
{
  "mcpServers": {
    "carbon-emission": {
      "command": "node",
      "args": [
        "/absolute/path/to/carbon-emission/mcp-server.js"
      ],
      "env": {
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

### Custom Emission Factors

If you want to use custom emission factors, you can modify the `EMISSION_FACTORS` object in `mcp-server.js`:

```javascript
const EMISSION_FACTORS = {
  electricity: 0.42,  // Adjust this value
  transportation: 0.12,  // Adjust this value
  // ... etc
};
```

## Verification

To verify everything is working:

1. Start Claude Desktop
2. Look for the 🔌 icon or "MCP" indicator showing connected servers
3. Try asking Claude: "What MCP servers are connected?"
4. Ask Claude to calculate carbon emissions with sample data

## Support

If you encounter issues:

1. Check the [MCP Documentation](https://modelcontextprotocol.io/)
2. Review the [MCP SDK Repository](https://github.com/modelcontextprotocol/sdk)
3. Ensure all dependencies are installed: `npm install`
4. Test the server independently: `npm run test-mcp`

## Next Steps

Once configured, you can:

- Use Claude to analyze your carbon footprint
- Compare different lifestyle scenarios
- Get personalized recommendations for reducing emissions
- Track changes over time by saving conversation history

Enjoy using the Carbon Emission Calculator with Claude! 🌍💚
