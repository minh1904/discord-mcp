/**
 * Structured logger that writes to **stderr only**.
 *
 * The MCP stdio transport reserves stdout for the JSON-RPC protocol, so any log
 * written to stdout would corrupt the message stream. All logs therefore go to
 * stderr, where the MCP client surfaces them as diagnostics.
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 } as const;

export type LogLevel = keyof typeof LEVELS;

function resolveThreshold(): number {
  const configured = process.env.LOG_LEVEL as LogLevel | undefined;
  if (configured && configured in LEVELS) return LEVELS[configured];
  return LEVELS.info;
}

const threshold = resolveThreshold();

function write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (LEVELS[level] < threshold) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  };
  process.stderr.write(`${JSON.stringify(entry)}\n`);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void =>
    write("debug", message, context),
  info: (message: string, context?: Record<string, unknown>): void =>
    write("info", message, context),
  warn: (message: string, context?: Record<string, unknown>): void =>
    write("warn", message, context),
  error: (message: string, context?: Record<string, unknown>): void =>
    write("error", message, context),
};
