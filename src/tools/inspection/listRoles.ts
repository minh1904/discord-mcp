import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { ok, run } from "../../server/tool.js";

export function registerListRoles(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "list_roles",
    {
      title: "List roles",
      description:
        "Read-only list of every role in a guild with name, color, position, hoist flag, and " +
        "permissions, ordered from highest to lowest in the role hierarchy.",
      inputSchema: {
        guildId: z
          .string()
          .optional()
          .describe("Guild (server) id. Omit to use the configured DISCORD_GUILD_ID."),
      },
    },
    (args) =>
      run("list_roles", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        await guild.roles.fetch();

        const roles = [...guild.roles.cache.values()]
          .sort((a, b) => b.position - a.position)
          .map((role) => ({
            id: role.id,
            name: role.name,
            color: role.hexColor,
            position: role.position,
            hoist: role.hoist,
            managed: role.managed,
            permissions: role.permissions.toArray(),
          }));

        return ok({ guildId: guild.id, count: roles.length, roles });
      }),
  );
}
