import { z } from "zod";
import type { Guild, Role } from "discord.js";
import { ToolError } from "../../lib/errors.js";
import { ok, type ToolResult } from "../../server/tool.js";

/** Standard `dryRun` field shared by every write tool's input schema. */
export const dryRunField = {
  dryRun: z
    .boolean()
    .optional()
    .describe("Preview the change without applying it. Returns the planned action only."),
} as const;

/**
 * Ensure the bot's highest role sits strictly above the target role, so the
 * bot is allowed to modify/delete/assign it. Throws a structured error if not.
 */
export function assertManageableRole(guild: Guild, role: Role): void {
  const me = guild.members.me;
  if (!me) {
    throw new ToolError("bot_member_missing", "Could not resolve the bot's own guild member.");
  }
  const botHighest = me.roles.highest.position;
  if (role.position >= botHighest) {
    throw new ToolError(
      "role_hierarchy",
      `Role "${role.name}" (position ${role.position}) is not below the bot's highest role ` +
        `(position ${botHighest}). Move the bot's role above it and try again.`,
    );
  }
}

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
