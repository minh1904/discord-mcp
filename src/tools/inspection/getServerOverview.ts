import { z } from "zod";
import { ChannelType } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { verificationLevelName } from "../../discord/format.js";
import { ok, run } from "../../server/tool.js";

export function registerGetServerOverview(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "get_server_overview",
    {
      title: "Get server overview",
      description:
        "Read-only summary of a Discord guild: name, member count, features, verification " +
        "level, and counts of roles, categories, and channels.",
      inputSchema: {
        guildId: z
          .string()
          .optional()
          .describe("Guild (server) id. Omit to use the configured DISCORD_GUILD_ID."),
      },
    },
    (args) =>
      run("get_server_overview", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        await guild.channels.fetch();
        await guild.roles.fetch();

        const channels = guild.channels.cache;
        const categoryCount = channels.filter(
          (channel) => channel.type === ChannelType.GuildCategory,
        ).size;

        return ok({
          id: guild.id,
          name: guild.name,
          memberCount: guild.memberCount,
          features: guild.features,
          verificationLevel: verificationLevelName(guild.verificationLevel),
          counts: {
            roles: guild.roles.cache.size,
            categories: categoryCount,
            channels: channels.size - categoryCount,
          },
        });
      }),
  );
}
