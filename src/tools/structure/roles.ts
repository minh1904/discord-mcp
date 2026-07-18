import { z } from "zod";
import type { Role } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import {
  assertManageableRole,
  botHighestPosition,
  createRole,
  deleteRole,
  editRole,
  summarizeRole,
} from "../../discord/structureOps.js";
import { ToolError } from "../../lib/errors.js";
import { run } from "../../server/tool.js";
import { dryRunField, writeResult } from "./shared.js";

async function fetchRole(
  guildId: string | undefined,
  roleId: string,
  config: AppConfig,
): Promise<Role> {
  const guild = await resolveGuild(guildId ?? config.defaultGuildId);
  const role = await guild.roles.fetch(roleId);
  if (!role) {
    throw new ToolError("role_not_found", `Role ${roleId} was not found in the guild.`);
  }
  return role;
}

export function registerRoleTools(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "create_role",
    {
      title: "Create role",
      description: "Create a new role. Supports dryRun to preview without applying.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        name: z.string().describe("Role name."),
        color: z.string().optional().describe("Color as hex (e.g. #5865F2) or a named color."),
        hoist: z.boolean().optional().describe("Display members with this role separately."),
        mentionable: z.boolean().optional().describe("Allow anyone to @mention this role."),
        permissions: z
          .array(z.string())
          .optional()
          .describe("Permission names (e.g. ManageMessages). Discord permission flag keys."),
        ...dryRunField,
      },
    },
    (args) =>
      run("create_role", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        const input = {
          name: args.name,
          color: args.color,
          hoist: args.hoist,
          mentionable: args.mentionable,
          permissions: args.permissions,
        };
        if (args.dryRun) {
          return writeResult({
            action: "create_role",
            target: { guildId: guild.id },
            planned: input,
            dryRun: true,
          });
        }
        const role = await createRole(guild, input);
        return writeResult({
          action: "create_role",
          target: { roleId: role.id },
          after: summarizeRole(role),
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "edit_role",
    {
      title: "Edit role",
      description: "Edit an existing role. Only provided fields change. Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        roleId: z.string().describe("Id of the role to edit."),
        name: z.string().optional(),
        color: z.string().optional().describe("Color as hex or named color."),
        hoist: z.boolean().optional(),
        mentionable: z.boolean().optional(),
        permissions: z
          .array(z.string())
          .optional()
          .describe("Replace the role's permissions with these flag keys."),
        ...dryRunField,
      },
    },
    (args) =>
      run("edit_role", async () => {
        const role = await fetchRole(args.guildId, args.roleId, config);
        assertManageableRole(role.guild, role);

        const changes = {
          name: args.name,
          color: args.color,
          hoist: args.hoist,
          mentionable: args.mentionable,
          permissions: args.permissions,
        };
        if (args.dryRun) {
          return writeResult({
            action: "edit_role",
            target: { roleId: role.id },
            planned: changes,
            dryRun: true,
          });
        }
        const updated = await editRole(role, changes);
        return writeResult({
          action: "edit_role",
          target: { roleId: role.id },
          after: summarizeRole(updated),
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "delete_role",
    {
      title: "Delete role",
      description: "Delete a role (must be below the bot's highest role). Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        roleId: z.string().describe("Id of the role to delete."),
        ...dryRunField,
      },
    },
    (args) =>
      run("delete_role", async () => {
        const role = await fetchRole(args.guildId, args.roleId, config);
        assertManageableRole(role.guild, role);

        const target = { roleId: role.id, name: role.name };
        if (args.dryRun) {
          return writeResult({
            action: "delete_role",
            target,
            planned: { deleted: true },
            dryRun: true,
          });
        }
        await deleteRole(role);
        return writeResult({
          action: "delete_role",
          target,
          after: { deleted: true },
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "reorder_role",
    {
      title: "Reorder role",
      description:
        "Set a role's position in the hierarchy (cannot exceed the bot's highest role). Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        roleId: z.string().describe("Id of the role to move."),
        position: z
          .number()
          .int()
          .min(1)
          .describe("Target position (higher = higher in the hierarchy)."),
        ...dryRunField,
      },
    },
    (args) =>
      run("reorder_role", async () => {
        const role = await fetchRole(args.guildId, args.roleId, config);
        assertManageableRole(role.guild, role);

        const botHighest = botHighestPosition(role.guild);
        if (args.position >= botHighest) {
          throw new ToolError(
            "role_hierarchy",
            `Target position ${args.position} is not below the bot's highest role (position ${botHighest}).`,
          );
        }

        const target = { roleId: role.id, name: role.name };
        if (args.dryRun) {
          return writeResult({
            action: "reorder_role",
            target,
            planned: { position: args.position },
            dryRun: true,
          });
        }
        const updated = await role.setPosition(args.position);
        return writeResult({
          action: "reorder_role",
          target,
          after: { position: updated.position },
          dryRun: false,
        });
      }),
  );

  const memberRoleSchema = {
    guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
    userId: z.string().describe("Id of the member."),
    roleId: z.string().describe("Id of the role."),
    ...dryRunField,
  };

  server.registerTool(
    "assign_role",
    {
      title: "Assign role to member",
      description:
        "Give a role to a member (role must be below the bot's highest role). Supports dryRun.",
      inputSchema: memberRoleSchema,
    },
    (args) =>
      run("assign_role", async () => {
        const role = await fetchRole(args.guildId, args.roleId, config);
        assertManageableRole(role.guild, role);
        const member = await role.guild.members.fetch(args.userId);

        const target = { userId: member.id, roleId: role.id, roleName: role.name };
        if (args.dryRun) {
          return writeResult({
            action: "assign_role",
            target,
            planned: { added: true },
            dryRun: true,
          });
        }
        await member.roles.add(role);
        return writeResult({
          action: "assign_role",
          target,
          after: { added: true },
          dryRun: false,
        });
      }),
  );

  server.registerTool(
    "remove_role",
    {
      title: "Remove role from member",
      description:
        "Remove a role from a member (role must be below the bot's highest role). Supports dryRun.",
      inputSchema: memberRoleSchema,
    },
    (args) =>
      run("remove_role", async () => {
        const role = await fetchRole(args.guildId, args.roleId, config);
        assertManageableRole(role.guild, role);
        const member = await role.guild.members.fetch(args.userId);

        const target = { userId: member.id, roleId: role.id, roleName: role.name };
        if (args.dryRun) {
          return writeResult({
            action: "remove_role",
            target,
            planned: { removed: true },
            dryRun: true,
          });
        }
        await member.roles.remove(role);
        return writeResult({
          action: "remove_role",
          target,
          after: { removed: true },
          dryRun: false,
        });
      }),
  );
}
