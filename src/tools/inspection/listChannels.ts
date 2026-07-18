import { z } from "zod";
import { ChannelType, type NonThreadGuildBasedChannel } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { channelTypeName } from "../../discord/format.js";
import { ok, run } from "../../server/tool.js";

function mapChannel(channel: NonThreadGuildBasedChannel) {
  return {
    id: channel.id,
    name: channel.name,
    type: channelTypeName(channel.type),
    position: channel.position,
  };
}

function byPosition(a: NonThreadGuildBasedChannel, b: NonThreadGuildBasedChannel): number {
  return a.position - b.position;
}

export function registerListChannels(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "list_channels",
    {
      title: "List channels",
      description:
        "Read-only list of a guild's categories and channels, preserving the parent/child " +
        "relationship and each channel's type (text, voice, stage, forum, announcement, media).",
      inputSchema: {
        guildId: z
          .string()
          .optional()
          .describe("Guild (server) id. Omit to use the configured DISCORD_GUILD_ID."),
      },
    },
    (args) =>
      run("list_channels", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        await guild.channels.fetch();

        const all = [...guild.channels.cache.values()].filter(
          (channel): channel is NonThreadGuildBasedChannel => channel !== null,
        );

        const categories = all
          .filter((channel) => channel.type === ChannelType.GuildCategory)
          .sort(byPosition)
          .map((category) => ({
            id: category.id,
            name: category.name,
            channels: all
              .filter((channel) => channel.parentId === category.id)
              .sort(byPosition)
              .map(mapChannel),
          }));

        const uncategorized = all
          .filter(
            (channel) => channel.type !== ChannelType.GuildCategory && channel.parentId === null,
          )
          .sort(byPosition)
          .map(mapChannel);

        return ok({ guildId: guild.id, categories, uncategorized });
      }),
  );
}
