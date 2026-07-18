import { z } from "zod";
import { ChannelType } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { run } from "../../server/tool.js";
import { dryRunField, writeResult } from "./shared.js";

export function registerCategoryTools(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "create_category",
    {
      title: "Create category",
      description: "Create a channel category. Supports dryRun to preview without applying.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        name: z.string().describe("Category name."),
        position: z.number().int().min(0).optional().describe("Position among top-level items."),
        ...dryRunField,
      },
    },
    (args) =>
      run("create_category", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        const planned = { name: args.name, position: args.position };
        if (args.dryRun) {
          return writeResult({
            action: "create_category",
            target: { guildId: guild.id },
            planned,
            dryRun: true,
          });
        }
        const category = await guild.channels.create({
          name: args.name,
          type: ChannelType.GuildCategory,
          position: args.position,
        });
        return writeResult({
          action: "create_category",
          target: { categoryId: category.id },
          after: { id: category.id, name: category.name, position: category.position },
          dryRun: false,
        });
      }),
  );
}
