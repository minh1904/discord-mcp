import { z } from "zod";
import {
  ChannelType,
  type GuildChannel,
  type GuildChannelEditOptions,
  type NonThreadGuildBasedChannel,
} from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { channelTypeName } from "../../discord/format.js";
import { ToolError } from "../../lib/errors.js";
import { run } from "../../server/tool.js";
import { dryRunField, writeResult } from "./shared.js";

const CHANNEL_TYPES = {
  text: ChannelType.GuildText,
  voice: ChannelType.GuildVoice,
  stage: ChannelType.GuildStageVoice,
  forum: ChannelType.GuildForum,
  announcement: ChannelType.GuildAnnouncement,
} as const;

async function fetchChannel(
  guildId: string | undefined,
  channelId: string,
  config: AppConfig,
): Promise<NonThreadGuildBasedChannel> {
  const guild = await resolveGuild(guildId ?? config.defaultGuildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel) {
    throw new ToolError("channel_not_found", `Channel ${channelId} was not found in the guild.`);
  }
  if (channel.isThread()) {
    throw new ToolError(
      "unsupported_channel",
      `Channel ${channelId} is a thread and is not supported here.`,
    );
  }
  return channel;
}

function summarizeChannel(channel: GuildChannel): Record<string, unknown> {
  return {
    id: channel.id,
    name: channel.name,
    type: channelTypeName(channel.type),
    parentId: channel.parentId,
    position: channel.position,
  };
}

export function registerChannelTools(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "create_channel",
    {
      title: "Create channel",
      description:
        "Create a channel of a given type, optionally inside a category. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        name: z.string().describe("Channel name."),
        type: z.enum(["text", "voice", "stage", "forum", "announcement"]).describe("Channel type."),
        parentId: z.string().optional().describe("Category id to place the channel under."),
        topic: z.string().optional().describe("Topic (text/forum/announcement channels)."),
        nsfw: z.boolean().optional(),
        position: z.number().int().min(0).optional(),
        ...dryRunField,
      },
    },
    (args) =>
      run("create_channel", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);

        if (args.parentId) {
          const parent = await guild.channels.fetch(args.parentId);
          if (!parent || parent.type !== ChannelType.GuildCategory) {
            throw new ToolError("invalid_parent", `parentId ${args.parentId} is not a category.`);
          }
        }

        const planned = {
          name: args.name,
          type: args.type,
          parentId: args.parentId,
          topic: args.topic,
          nsfw: args.nsfw,
          position: args.position,
        };
        if (args.dryRun) {
          return writeResult({
            action: "create_channel",
            target: { guildId: guild.id },
            planned,
            dryRun: true,
          });
        }

        const channel = await guild.channels.create({
          name: args.name,
          type: CHANNEL_TYPES[args.type],
          parent: args.parentId,
          topic: args.topic,
          nsfw: args.nsfw,
          position: args.position,
        });
        return writeResult({
          action: "create_channel",
          target: { channelId: channel.id },
          after: summarizeChannel(channel),
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "edit_channel",
    {
      title: "Edit channel",
      description: "Edit channel properties. Only provided fields change. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        channelId: z.string().describe("Id of the channel to edit."),
        name: z.string().optional(),
        topic: z.string().optional(),
        nsfw: z.boolean().optional(),
        position: z.number().int().min(0).optional(),
        ...dryRunField,
      },
    },
    (args) =>
      run("edit_channel", async () => {
        const channel = await fetchChannel(args.guildId, args.channelId, config);

        const options: GuildChannelEditOptions = {};
        if (args.name !== undefined) options.name = args.name;
        if (args.topic !== undefined) options.topic = args.topic;
        if (args.nsfw !== undefined) options.nsfw = args.nsfw;
        if (args.position !== undefined) options.position = args.position;

        if (args.dryRun) {
          return writeResult({
            action: "edit_channel",
            target: { channelId: channel.id },
            planned: options as Record<string, unknown>,
            dryRun: true,
          });
        }
        const updated = await (channel as GuildChannel).edit(options);
        return writeResult({
          action: "edit_channel",
          target: { channelId: channel.id },
          after: summarizeChannel(updated),
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "move_channel",
    {
      title: "Move channel",
      description: "Change a channel's parent category and/or position. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        channelId: z.string().describe("Id of the channel to move."),
        parentId: z
          .string()
          .nullable()
          .optional()
          .describe("New category id, or null to remove from category."),
        position: z.number().int().min(0).optional(),
        ...dryRunField,
      },
    },
    (args) =>
      run("move_channel", async () => {
        const channel = await fetchChannel(args.guildId, args.channelId, config);

        if (typeof args.parentId === "string") {
          const parent = await channel.guild.channels.fetch(args.parentId);
          if (!parent || parent.type !== ChannelType.GuildCategory) {
            throw new ToolError("invalid_parent", `parentId ${args.parentId} is not a category.`);
          }
        }

        const options: GuildChannelEditOptions = {};
        if (args.parentId !== undefined) options.parent = args.parentId;
        if (args.position !== undefined) options.position = args.position;

        if (args.dryRun) {
          return writeResult({
            action: "move_channel",
            target: { channelId: channel.id },
            planned: { parentId: args.parentId, position: args.position },
            dryRun: true,
          });
        }
        const updated = await (channel as GuildChannel).edit(options);
        return writeResult({
          action: "move_channel",
          target: { channelId: channel.id },
          after: summarizeChannel(updated),
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "delete_channel",
    {
      title: "Delete channel",
      description:
        "Delete a channel or category. Deleting a category detaches its child channels. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        channelId: z.string().describe("Id of the channel or category to delete."),
        ...dryRunField,
      },
    },
    (args) =>
      run("delete_channel", async () => {
        const channel = await fetchChannel(args.guildId, args.channelId, config);

        const childIds =
          channel.type === ChannelType.GuildCategory
            ? [...channel.guild.channels.cache.values()]
                .filter((c) => c.parentId === channel.id)
                .map((c) => c.id)
            : [];

        const target = { channelId: channel.id, name: channel.name };
        const consequence = childIds.length > 0 ? { detachedChildren: childIds } : {};

        if (args.dryRun) {
          return writeResult({
            action: "delete_channel",
            target,
            planned: { deleted: true, ...consequence },
            dryRun: true,
          });
        }
        await channel.delete();
        return writeResult({
          action: "delete_channel",
          target,
          after: { deleted: true, ...consequence },
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "sync_channel_to_category",
    {
      title: "Sync channel permissions to category",
      description:
        "Make a channel inherit its parent category's permission overwrites. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        channelId: z.string().describe("Id of the channel to sync with its category."),
        ...dryRunField,
      },
    },
    (args) =>
      run("sync_channel_to_category", async () => {
        const channel = await fetchChannel(args.guildId, args.channelId, config);
        if (!channel.parentId) {
          throw new ToolError("no_parent", `Channel ${channel.id} is not inside a category.`);
        }

        const target = { channelId: channel.id, parentId: channel.parentId };
        if (args.dryRun) {
          return writeResult({
            action: "sync_channel_to_category",
            target,
            planned: { synced: true },
            dryRun: true,
          });
        }
        await (channel as GuildChannel).lockPermissions();
        return writeResult({
          action: "sync_channel_to_category",
          target,
          after: { synced: true },
          dryRun: false,
        });
      }),
  );
}
