import { z } from "zod";
import { ChannelType, PermissionFlagsBits, type Guild } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { ok, run } from "../../server/tool.js";

type Severity = "high" | "medium" | "low" | "info";

interface Finding {
  code: string;
  severity: Severity;
  message: string;
  target: Record<string, unknown>;
}

const STAFF_KEYWORDS = ["mod", "staff", "admin", "internal", "nội bộ"];
const ANNOUNCE_KEYWORDS = ["announce", "thông báo", "thong bao"];

function auditGuild(guild: Guild): Finding[] {
  const findings: Finding[] = [];
  const everyone = guild.roles.everyone;

  // (a) Roles (other than @everyone) with Administrator.
  for (const role of guild.roles.cache.values()) {
    if (role.id === everyone.id) continue;
    if (role.permissions.has(PermissionFlagsBits.Administrator)) {
      findings.push({
        code: "role_administrator",
        severity: role.managed ? "medium" : "high",
        message: `Role "${role.name}" has Administrator${role.managed ? " (managed/bot role)" : ""}. Prefer least-privilege.`,
        target: { roleId: role.id, name: role.name, managed: role.managed },
      });
    }
  }

  // Channel-based checks.
  for (const channel of guild.channels.cache.values()) {
    if (channel.type === ChannelType.GuildCategory) continue;
    const lowered = channel.name.toLowerCase();
    const everyonePerms = channel.permissionsFor(everyone);
    if (!everyonePerms) continue;

    // (b) Staff-named channels visible to @everyone.
    if (
      STAFF_KEYWORDS.some((k) => lowered.includes(k)) &&
      everyonePerms.has(PermissionFlagsBits.ViewChannel)
    ) {
      findings.push({
        code: "staff_channel_public",
        severity: "medium",
        message: `Channel "${channel.name}" looks internal but @everyone can view it. Deny ViewChannel for @everyone.`,
        target: { channelId: channel.id, name: channel.name },
      });
    }

    // (c) Announcement-named channels where @everyone can send.
    if (
      ANNOUNCE_KEYWORDS.some((k) => lowered.includes(k)) &&
      everyonePerms.has(PermissionFlagsBits.SendMessages)
    ) {
      findings.push({
        code: "announcement_open",
        severity: "low",
        message: `Announcement channel "${channel.name}" lets @everyone send messages. Restrict Send Messages to staff.`,
        target: { channelId: channel.id, name: channel.name },
      });
    }
  }

  // (d) Bot role not near the top of the hierarchy.
  const me = guild.members.me;
  if (me) {
    const botHighest = me.roles.highest;
    const higher = guild.roles.cache.filter(
      (r) => r.position > botHighest.position && !r.managed,
    ).size;
    if (higher > 0) {
      findings.push({
        code: "bot_role_low",
        severity: "info",
        message: `The bot's highest role is below ${higher} other role(s); it cannot manage those. Move the bot role up if needed.`,
        target: { botHighestPosition: botHighest.position, rolesAbove: higher },
      });
    }
  }

  return findings;
}

export function registerAuditPermissions(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "audit_permissions",
    {
      title: "Audit permissions",
      description:
        "Read-only scan for permission risks: Administrator roles, staff channels visible to @everyone, " +
        "open announcement channels, and a low bot role. Returns findings with severity.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
      },
    },
    (args) =>
      run("audit_permissions", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        await guild.roles.fetch();
        await guild.channels.fetch();
        const findings = auditGuild(guild);
        return ok({ guildId: guild.id, count: findings.length, findings });
      }),
  );
}
