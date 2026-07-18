import { z } from "zod";
import { GuildFeature, GuildVerificationLevel, type GuildEditOptions } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { ok, run } from "../../server/tool.js";

export function registerEnableCommunity(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "enable_community",
    {
      title: "Enable Community",
      description:
        "Enable the Community feature for a guild (required before Onboarding). Needs a rules channel and a " +
        "public-updates channel. Reports if already enabled. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        rulesChannelId: z.string().describe("Text channel to use as the rules channel."),
        publicUpdatesChannelId: z
          .string()
          .describe("Text channel to use as the public updates channel."),
        dryRun: z.boolean().optional().describe("Preview without applying."),
      },
    },
    (args) =>
      run("enable_community", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);

        if (guild.features.includes(GuildFeature.Community)) {
          return ok({ enabled: true, alreadyEnabled: true, features: guild.features });
        }
        if (args.dryRun) {
          return ok({
            dryRun: true,
            planned: {
              enableCommunity: true,
              rulesChannelId: args.rulesChannelId,
              publicUpdatesChannelId: args.publicUpdatesChannelId,
            },
          });
        }

        const editOptions: GuildEditOptions = {
          features: [...guild.features, GuildFeature.Community],
          rulesChannel: args.rulesChannelId,
          publicUpdatesChannel: args.publicUpdatesChannelId,
        };
        // Community requires at least Low verification.
        if (guild.verificationLevel === GuildVerificationLevel.None) {
          editOptions.verificationLevel = GuildVerificationLevel.Low;
        }

        const updated = await guild.edit(editOptions);
        return ok({
          enabled: updated.features.includes(GuildFeature.Community),
          features: updated.features,
        });
      }),
  );
}
