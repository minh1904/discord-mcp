#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config/index.js";
import { connectDiscord } from "./discord/client.js";
import { createServer } from "./server/index.js";
import { startHttpServer } from "./server/httpTransport.js";
import { logger } from "./lib/logger.js";

async function main(): Promise<void> {
  const config = loadConfig();

  // Connect to Discord in the background. A failure here (bad token, missing
  // intents) is logged; tools report `not_ready` until the connection is up.
  connectDiscord(config.discordToken).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Discord connection failed", { message });
  });

  if (config.transport === "http") {
    startHttpServer(config);
    return;
  }

  // stdio (default): start the MCP protocol so the client can connect immediately.
  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Discord MCP server started (stdio transport)");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logger.error("Fatal startup error", { message });
  process.exit(1);
});
