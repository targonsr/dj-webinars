# MCP debugging

### Cursor IDE

CURSOR menu: view > output > "Cursor MCP"

### testing: inspector/UI

```
"scripts": {
    "start": "node server.js",
    "start:log:verbose": "CONFIG_LOG_LEVEL=VERBOSE node server.js",
    "test": "npx @modelcontextprotocol/inspector node server.js",
    "test:cli": "npx @modelcontextprotocol/inspector --cli node server.js --method tools/list"
},
```

### testing: inspector/CLI

- docs: https://github.com/modelcontextprotocol/inspector?tab=readme-ov-file#cli-mode

run a MCP server method via CLI:

`npx @modelcontextprotocol/inspector --cli node index.js --method tools/list`

# MCP + @smithery/cli setup

## `@smithery/cli`

- docs: https://www.npmjs.com/package/@smithery/cli

Install the Docker MCP server and configures it to work with Cursor's MCP client:

```
npx @smithery/cli install docker-mcp --client cursor
# npx @smithery/cli list servers --client cursor
```

Install the MCP server in Cursor IDE:

```
npx -y @smithery/cli@latest run docker-mcp # this also goes to cursor/settings/MCP
```

Make sure you have uv and python installed before:

```
brew install uv
brew install python # might take a while
```
