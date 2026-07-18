import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { registerRoleTools } from "./roles.js";
import { registerCategoryTools } from "./categories.js";
import { registerChannelTools } from "./channels.js";
import { registerPermissionTools } from "./permissions.js";

/** Register every structure (write) tool on the server. */
export function registerStructureTools(server: McpServer, config: AppConfig): void {
  registerRoleTools(server, config);
  registerCategoryTools(server, config);
  registerChannelTools(server, config);
  registerPermissionTools(server, config);
}
