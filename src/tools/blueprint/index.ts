import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { registerLibraryTools } from "./library.js";
import { registerAdvisorTools } from "./advisor.js";
import { registerApplyTools } from "./apply.js";

/** Register the blueprint / advisor ("brain") tools on the server. */
export function registerBlueprintTools(server: McpServer, config: AppConfig): void {
  registerLibraryTools(server);
  registerAdvisorTools(server);
  registerApplyTools(server, config);
}
