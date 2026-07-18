import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { registerAuditPermissions } from "./auditPermissions.js";
import { registerViewAs } from "./viewAs.js";

/** Register permission-audit tools. */
export function registerAuditTools(server: McpServer, config: AppConfig): void {
  registerAuditPermissions(server, config);
  registerViewAs(server, config);
}
