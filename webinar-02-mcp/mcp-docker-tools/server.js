import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { fetchRepositoryTags, fetchRepositoryDetails } from './dockerhub-api.js';

const log = (...args) => {
  if (process.env.CONFIG_LOG_LEVEL?.toUpperCase() == "VERBOSE") {
    console.error(...args);
  }
};

const server = new McpServer({
  name: 'docker-tools',
  version: '1.0.0',
});

const dockerImageTagsPrompt = `
  When specifying Docker images anywhere in this project (for example in handlers, Compose files, or prompts), always use an explicit version tag rather than \`latest\`. This ensures reproducible builds and prevents unexpected upgrades.
`;

server.prompt(
  'docker-image-tags',
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
  },
  async (options) => ({
    role: "system",
    content: {
      type: "text",
      text: `When querying tags for ${options.repository}:
      - Exclude 'latest' tag
      - Prioritize semantic versioning
      - Flag deprecated tags`
    }
  })
);

server.tool(
  'greet',
  { name: z.string().describe('Recipient name') },
  async ({ name }) => {
    log('[greet]', {name});
    return {
      content: [{
        type: 'text',
        text: `Hello, ${name}! Current server time: ${new Date().toISOString()}`
      }]
    }
  }
);

server.tool(
  'docker-image-tags',
  `
  Fetches an auto-paginated list of tags (versions) for a specified Docker repository.
  Subsequent requests automatically use "next", "prev" or "count" response properties, when available.
  `,
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
    page: z.number().default(1).describe('Page number for pagination'),
    pageSize: z.number().default(100).describe('Number of results per page'),
    version: z.string().default('v2').describe('Docker Hub API version to use')
  },
  async (options) => {
    log('[docker-image-tags]', {options});
    let response = await fetchRepositoryTags(options);
    let tags = response.results.map(tag => tag.name);
    let tries = 2;
    while (response.next && tries > 0) {
      response = await fetchRepositoryTags({ ...options, page: options.page + 1 });
      tags = tags.concat(response.results.map(tag => tag.name));
      tries--;
    }
    return {
      content: [{ type: "text", text: JSON.stringify({
        tags,
        // next: response.next,
        // prev: response.previous,
        totalCount: response.count,
        fetchedCount: tags.length
      }) }],
      isError: false,
      // nextCursor: response.next
    }
  }
);

// Fetches detailed metadata for a Docker repository
server.tool(
  'docker-image-description',
  'Fetches detailed Docker repository description',
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
    version: z.string().default('v2').describe('Docker Hub API version to use')
  },
  async (options) => {
    log('[docker-image-description]', {options});
    const response = await fetchRepositoryDetails(options);
    return {
      content: [{ type: "text", text: response.full_description }],
      isError: false,
    }
  }
);

// Fetches detailed metadata for a Docker repository
server.tool(
  'docker-image-details',
  'Fetches detailed metadata for a specified Docker repository',
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
    version: z.string().default('v2').describe('Docker Hub API version to use')
  },
  async (options) => {
    log('[docker-image-details]', {options});
    const response = await fetchRepositoryDetails(options);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
      isError: false,
    }
  }
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
