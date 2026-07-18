import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../config/index.js";
import { registerInspectionTools } from "../tools/inspection/index.js";

/** Create the MCP server and register all available tools. */
export function createServer(config: AppConfig): McpServer {
  const server = new McpServer({
    name: "discord-mcp",
    version: "0.1.0",
  });

  registerInspectionTools(server, config);

  return server;
}
