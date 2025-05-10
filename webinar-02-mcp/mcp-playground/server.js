import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const log = (...args) => {
  if (process.env.CONFIG_LOG_LEVEL?.toUpperCase() == "VERBOSE") {
    console.error(...args);
  }
};

const server = new McpServer({
  name: 'GreetingServer',
  version: '1.0.0'
});

server.tool(
  'greet',
  // MCP uses standard ts runtime type check libraries: zod, ajv, ...
  {
    name: z.string().describe('Recipient name'),
    //....
  },
  // z.object({ name: z.string().describe('Recipient name') }),
  async ({ name }) => {
    log('[greet]', {name}); // stderr
    // console.log('[greet]', {name}); // stdout
    return {
      content: [{
        type: 'text',
        text: `Hello, ${name}! You are ${name.startsWith('A') ? 'awesome' : 'not awesome'}`
      }]
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
