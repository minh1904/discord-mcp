import { z } from "zod";
import { ok, type ToolResult } from "../../server/tool.js";

export { assertManageableRole } from "../../discord/structureOps.js";

/** Standard `dryRun` field shared by every write tool's input schema. */
export const dryRunField = {
  dryRun: z
    .boolean()
    .optional()
    .describe("Preview the change without applying it. Returns the planned action only."),
} as const;

/** Description of a write action, returned to the client for verification. */
interface WriteResultInput {
  action: string;
  target: Record<string, unknown>;
  /** State after the change (omit for dryRun / deletions). */
  after?: Record<string, unknown>;
  /** Planned change when dryRun is true. */
  planned?: Record<string, unknown>;
  dryRun: boolean;
}

/** Build a structured, uniform result for a write tool. */
export function writeResult(input: WriteResultInput): ToolResult {
  return ok({
    action: input.action,
    dryRun: input.dryRun,
    target: input.target,
    ...(input.after ? { after: input.after } : {}),
    ...(input.planned ? { planned: input.planned } : {}),
  });
}
