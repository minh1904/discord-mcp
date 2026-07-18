import {
  createServer as createHttpServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { AppConfig } from "../config/index.js";
import { logger } from "../lib/logger.js";
import { createServer } from "./index.js";

const MCP_PATH = "/mcp";

/**
 * Start the MCP server over HTTP (streamable). Stateless: each request gets a
 * fresh McpServer + transport, so there is no cross-request session state.
 */
export function startHttpServer(config: AppConfig): void {
  const port = config.httpPort;
  if (port === undefined) {
    throw new Error("startHttpServer called without a configured httpPort");
  }

  const httpServer = createHttpServer((req: IncomingMessage, res: ServerResponse) => {
    void handleRequest(req, res, config);
  });

  httpServer.listen(port, () => {
    logger.info("Discord MCP server started (http transport)", { port, path: MCP_PATH });
  });
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  config: AppConfig,
): Promise<void> {
  const url = req.url ?? "";
  if (!url.startsWith(MCP_PATH)) {
    res.writeHead(404).end("Not found");
    return;
  }
  if (req.method !== "POST") {
    // Stateless streamable HTTP only accepts POST for MCP messages.
    res.writeHead(405, { Allow: "POST" }).end("Method not allowed");
    return;
  }

  const server = createServer(config);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  res.on("close", () => {
    void transport.close();
    void server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("HTTP request handling failed", { message });
    if (!res.headersSent) {
      res.writeHead(500).end("Internal server error");
    }
  }
}
