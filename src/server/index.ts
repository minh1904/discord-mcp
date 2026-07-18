import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../config/index.js";
import { registerInspectionTools } from "../tools/inspection/index.js";
import { registerStructureTools } from "../tools/structure/index.js";
import { registerBlueprintTools } from "../tools/blueprint/index.js";
import { registerCommunityTools } from "../tools/community/index.js";
import { registerAuditTools } from "../tools/audit/index.js";
import { registerHandoffTools } from "../tools/handoff/index.js";

/** Create the MCP server and register all available tools. */
export function createServer(config: AppConfig): McpServer {
  const server = new McpServer({
    name: "discord-mcp",
    version: "0.1.0",
  });

  registerInspectionTools(server, config);
  registerStructureTools(server, config);
  registerBlueprintTools(server, config);
  registerCommunityTools(server, config);
  registerAuditTools(server, config);
  registerHandoffTools(server, config);

  return server;
}
