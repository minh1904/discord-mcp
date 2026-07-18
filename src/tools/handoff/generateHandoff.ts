import { z } from "zod";
import { ChannelType, type Guild, type NonThreadGuildBasedChannel } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { getBlueprint } from "../../blueprints/index.js";
import { resolveGuild } from "../../discord/client.js";
import { channelTypeName } from "../../discord/format.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run } from "../../server/tool.js";

function renderRoles(guild: Guild): string {
  const roles = [...guild.roles.cache.values()]
    .filter((r) => r.id !== guild.roles.everyone.id)
    .sort((a, b) => b.position - a.position);
  const lines = roles.map((r) => {
    const perms = r.permissions.toArray();
    const key = perms.includes("Administrator")
      ? "Administrator"
      : perms.slice(0, 4).join(", ") || "(no key permissions)";
    return `- **${r.name}** (position ${r.position})${r.hoist ? " · hoisted" : ""} — ${key}`;
  });
  return lines.length > 0 ? lines.join("\n") : "_No roles._";
}

function renderChannels(guild: Guild): string {
  const all = [...guild.channels.cache.values()].filter(
    (c): c is NonThreadGuildBasedChannel => !c.isThread(),
  );
  const categories = all
    .filter((c) => c.type === ChannelType.GuildCategory)
    .sort((a, b) => a.position - b.position);

  const renderChannel = (c: NonThreadGuildBasedChannel): string =>
    `  - ${c.name} \`(${channelTypeName(c.type)})\``;

  const sections: string[] = [];
  for (const category of categories) {
    const children = all
      .filter((c) => c.parentId === category.id)
      .sort((a, b) => a.position - b.position)
      .map(renderChannel);
    sections.push(`- **${category.name}**\n${children.join("\n") || "  - _(empty)_"}`);
  }

  const uncategorized = all
    .filter((c) => c.type !== ChannelType.GuildCategory && c.parentId === null)
    .sort((a, b) => a.position - b.position)
    .map(renderChannel);
  if (uncategorized.length > 0) {
    sections.push(`- **(no category)**\n${uncategorized.join("\n")}`);
  }

  return sections.length > 0 ? sections.join("\n") : "_No channels._";
}

export function registerGenerateHandoff(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "generate_handoff",
    {
      title: "Generate handoff document",
      description:
        "Read-only: produce a Markdown handoff document (role tree + channel map) for a guild. " +
        "Pass a blueprintId to also include recommended bots and security notes.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        blueprintId: z
          .string()
          .optional()
          .describe("Optional blueprint id to append bots + security notes."),
      },
    },
    (args) =>
      run("generate_handoff", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        await guild.roles.fetch();
        await guild.channels.fetch();

        let blueprintSection = "";
        if (args.blueprintId) {
          const blueprint = getBlueprint(args.blueprintId);
          if (!blueprint) {
            throw new ToolError(
              "blueprint_not_found",
              `No blueprint with id "${args.blueprintId}".`,
            );
          }
          const bots = blueprint.recommendedBots
            .map((b) => `- **${b.name}** — ${b.purpose}`)
            .join("\n");
          const notes = blueprint.securityNotes.map((n) => `- ${n}`).join("\n");
          blueprintSection = `\n## Bot đề xuất (blueprint: ${blueprint.id})\n\n${bots}\n\n## Ghi chú bảo mật\n\n${notes}\n`;
        }

        const markdown =
          `# Bàn giao server: ${guild.name}\n\n` +
          `- Guild id: \`${guild.id}\`\n` +
          `- Thành viên: ${guild.memberCount}\n\n` +
          `## Cây role (cao → thấp)\n\n${renderRoles(guild)}\n\n` +
          `## Sơ đồ kênh\n\n${renderChannels(guild)}\n` +
          blueprintSection;

        return ok({ guildId: guild.id, markdown });
      }),
  );
}
