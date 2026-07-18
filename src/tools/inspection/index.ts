import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { registerGetServerOverview } from "./getServerOverview.js";
import { registerListRoles } from "./listRoles.js";
import { registerListChannels } from "./listChannels.js";
import { registerGetChannelPermissions } from "./getChannelPermissions.js";
import { registerPing } from "./ping.js";

/** Register every read-only inspection tool on the server. */
export function registerInspectionTools(server: McpServer, config: AppConfig): void {
  registerGetServerOverview(server, config);
  registerListRoles(server, config);
  registerListChannels(server, config);
  registerGetChannelPermissions(server);
  registerPing(server);
}
