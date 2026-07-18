#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config/index.js";
import { connectDiscord } from "./discord/client.js";
import { createServer } from "./server/index.js";
import { logger } from "./lib/logger.js";

async function main(): Promise<void> {
  const config = loadConfig();

  // Start the MCP protocol first so the client can connect immediately; tools
  // that need Discord report `not_ready` until the connection is established.
  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Discord MCP server started (stdio transport)");

  // Connect to Discord in the background. A failure here (bad token, missing
  // intents) is logged; the server keeps running so `ping` can report status.
  connectDiscord(config.discordToken).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Discord connection failed", { message });
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logger.error("Fatal startup error", { message });
  process.exit(1);
});
