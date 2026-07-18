import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { registerEnableCommunity } from "./enableCommunity.js";
import { registerOnboardingTools } from "./onboarding.js";

/** Register Community + Onboarding tools. */
export function registerCommunityTools(server: McpServer, config: AppConfig): void {
  registerEnableCommunity(server, config);
  registerOnboardingTools(server, config);
}
