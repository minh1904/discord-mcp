/**
 * Error carrying a stable, machine-readable `code` alongside a human message.
 *
 * Tools throw `ToolError` to signal an expected failure (bad input, missing
 * guild, not connected, ...). The tool-execution wrapper turns it into a
 * structured error result instead of crashing the server.
 */
export class ToolError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ToolError";
    this.code = code;
  }
}
