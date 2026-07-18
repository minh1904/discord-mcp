import { isReady } from "../discord/client.js";
import { ToolError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

/** Shape of a tool result returned to the MCP client. */
export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  [key: string]: unknown;
}

/** Build a success result. Data is serialized as pretty JSON text. */
export function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

/** Build a structured error result (does not throw). */
export function fail(code: string, message: string): ToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify({ error: { code, message } }, null, 2) }],
    isError: true,
  };
}

interface RunOptions {
  /** Require the Discord client to be ready before running (default: true). */
  requireReady?: boolean;
}

/**
 * Execute a tool body with consistent guarding and error handling.
 *
 * - Optionally short-circuits with `not_ready` when Discord is still connecting.
 * - Converts a thrown {@link ToolError} into a structured error result.
 * - Converts any other thrown value into a generic `internal_error` result and
 *   logs it, so a single failing tool never crashes the server.
 */
export async function run(
  name: string,
  body: () => Promise<ToolResult> | ToolResult,
  options: RunOptions = {},
): Promise<ToolResult> {
  try {
    if (options.requireReady !== false && !isReady()) {
      return fail("not_ready", "Discord client is not connected yet. Try again in a moment.");
    }
    return await body();
  } catch (error) {
    if (error instanceof ToolError) {
      return fail(error.code, error.message);
    }
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Tool execution failed", { tool: name, message });
    return fail("internal_error", message);
  }
}
