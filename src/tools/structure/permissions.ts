import { z } from "zod";
import type { GuildChannel } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import {
  applyChannelPermission,
  buildOverwriteOptions,
  resolveOverwriteTarget,
} from "../../discord/structureOps.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run } from "../../server/tool.js";
import { dryRunField, writeResult } from "./shared.js";

async function fetchManageableChannel(
  guildId: string | undefined,
  channelId: string,
  config: AppConfig,
): Promise<GuildChannel> {
  const guild = await resolveGuild(guildId ?? config.defaultGuildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel) {
    throw new ToolError("channel_not_found", `Channel ${channelId} was not found in the guild.`);
  }
  if (!("permissionOverwrites" in channel)) {
    throw new ToolError(
      "unsupported_channel",
      `Channel ${channelId} does not support permission overwrites.`,
    );
  }
  return channel as GuildChannel;
}

export function registerPermissionTools(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "set_channel_permission",
    {
      title: "Set channel permission overwrite",
      description:
        "Create or update (upsert) a permission overwrite for a role or member on a channel. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        channelId: z.string().describe("Channel to apply the overwrite on."),
        targetId: z.string().describe("Id of the role or member."),
        targetType: z.enum(["role", "member"]).describe("Whether targetId is a role or a member."),
        allow: z.array(z.string()).optional().describe("Permission flag keys to explicitly allow."),
        deny: z.array(z.string()).optional().describe("Permission flag keys to explicitly deny."),
        ...dryRunField,
      },
    },
    (args) =>
      run("set_channel_permission", async () => {
        const channel = await fetchManageableChannel(args.guildId, args.channelId, config);
        const target = await resolveOverwriteTarget(channel.guild, args.targetId, args.targetType);
        const options = buildOverwriteOptions(args.allow ?? [], args.deny ?? []);

        const summary = {
          channelId: channel.id,
          targetId: args.targetId,
          targetType: args.targetType,
          allow: args.allow ?? [],
          deny: args.deny ?? [],
        };
        if (args.dryRun) {
          return writeResult({
            action: "set_channel_permission",
            target: summary,
            planned: options as Record<string, unknown>,
            dryRun: true,
          });
        }
        await applyChannelPermission(channel, target, options);
        return writeResult({
          action: "set_channel_permission",
          target: summary,
          after: options,
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "remove_channel_permission",
    {
      title: "Remove channel permission overwrite",
      description:
        "Remove a permission overwrite for a role or member on a channel. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        channelId: z.string().describe("Channel to remove the overwrite from."),
        targetId: z.string().describe("Id of the role or member whose overwrite to remove."),
        ...dryRunField,
      },
    },
    (args) =>
      run("remove_channel_permission", async () => {
        const channel = await fetchManageableChannel(args.guildId, args.channelId, config);
        const exists = channel.permissionOverwrites.cache.has(args.targetId);
        const target = { channelId: channel.id, targetId: args.targetId };

        if (!exists) {
          return ok({
            action: "remove_channel_permission",
            target,
            note: "No overwrite existed for this target; nothing to remove.",
            dryRun: Boolean(args.dryRun),
          });
        }
        if (args.dryRun) {
          return writeResult({
            action: "remove_channel_permission",
            target,
            planned: { removed: true },
            dryRun: true,
          });
        }
        await channel.permissionOverwrites.delete(args.targetId);
        return writeResult({
          action: "remove_channel_permission",
          target,
          after: { removed: true },
          dryRun: false,
        });
      }),
  );
}
