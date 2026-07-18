import { z } from "zod";
import {
  ChannelType,
  PermissionFlagsBits,
  type Guild,
  type GuildMember,
  type Role,
} from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { channelTypeName } from "../../discord/format.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run } from "../../server/tool.js";

async function resolveSubject(guild: Guild, id: string): Promise<Role | GuildMember> {
  const role = await guild.roles.fetch(id).catch(() => null);
  if (role) return role;
  const member = await guild.members.fetch(id).catch(() => null);
  if (member) return member;
  throw new ToolError("subject_not_found", `No role or member with id ${id} in the guild.`);
}

export function registerViewAs(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "view_as",
    {
      title: "View channels as a role or member",
      description:
        "Read-only: list which channels a role or member can and cannot view (by effective ViewChannel permission).",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        subjectId: z.string().describe("Id of a role or a member to inspect."),
      },
    },
    (args) =>
      run("view_as", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        await guild.channels.fetch();
        const subject = await resolveSubject(guild, args.subjectId);

        const visible: Array<Record<string, unknown>> = [];
        const hidden: Array<Record<string, unknown>> = [];
        for (const channel of guild.channels.cache.values()) {
          if (channel.type === ChannelType.GuildCategory) continue;
          const perms = channel.permissionsFor(subject);
          const entry = { id: channel.id, name: channel.name, type: channelTypeName(channel.type) };
          if (perms?.has(PermissionFlagsBits.ViewChannel)) visible.push(entry);
          else hidden.push(entry);
        }

        return ok({
          guildId: guild.id,
          subject: { id: subject.id, kind: "user" in subject ? "member" : "role" },
          visibleCount: visible.length,
          hiddenCount: hidden.length,
          visible,
          hidden,
        });
      }),
  );
}
