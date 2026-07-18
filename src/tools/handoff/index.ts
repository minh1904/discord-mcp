import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { registerGenerateHandoff } from "./generateHandoff.js";

/** Register handoff-document tools. */
export function registerHandoffTools(server: McpServer, config: AppConfig): void {
  registerGenerateHandoff(server, config);
}
