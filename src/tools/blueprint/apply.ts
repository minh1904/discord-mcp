import { z } from "zod";
import { ChannelType, type Guild, type GuildChannel } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { getBlueprint, type Blueprint } from "../../blueprints/index.js";
import { resolveGuild } from "../../discord/client.js";
import {
  applyChannelPermission,
  buildOverwriteOptions,
  CHANNEL_TYPE_MAP,
  ensureCategory,
  ensureChannel,
  ensureRole,
} from "../../discord/structureOps.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run, type ToolResult } from "../../server/tool.js";

interface PlannedChannel {
  category: string;
  name: string;
  type: string;
  announcementOnly: boolean;
  private: boolean;
}

interface Plan {
  blueprintId: string;
  rolesToCreate: string[];
  categoriesToCreate: string[];
  channelsToCreate: PlannedChannel[];
}

async function computePlan(guild: Guild, blueprint: Blueprint): Promise<Plan> {
  await guild.roles.fetch();
  await guild.channels.fetch();

  const existingRoleNames = new Set(guild.roles.cache.map((r) => r.name));
  const rolesToCreate = blueprint.roles
    .map((r) => r.name)
    .filter((name) => !existingRoleNames.has(name));

  const categoryNames = new Set(
    [...guild.channels.cache.values()]
      .filter((c) => c.type === ChannelType.GuildCategory)
      .map((c) => c.name),
  );
  const categoriesToCreate = blueprint.categories
    .map((c) => c.name)
    .filter((name) => !categoryNames.has(name));

  const channelsToCreate: PlannedChannel[] = [];
  for (const category of blueprint.categories) {
    for (const channel of category.channels) {
      const exists = [...guild.channels.cache.values()].some(
        (c) =>
          c.name === channel.name &&
          c.type === CHANNEL_TYPE_MAP[channel.type] &&
          c.parent?.name === category.name,
      );
      if (!exists) {
        channelsToCreate.push({
          category: category.name,
          name: channel.name,
          type: channel.type,
          announcementOnly: Boolean(channel.announcementOnly),
          private: Boolean(channel.private),
        });
      }
    }
  }

  return { blueprintId: blueprint.id, rolesToCreate, categoriesToCreate, channelsToCreate };
}

function requireBlueprint(id: string): Blueprint {
  const blueprint = getBlueprint(id);
  if (!blueprint) {
    throw new ToolError("blueprint_not_found", `No blueprint with id "${id}".`);
  }
  return blueprint;
}

async function applyBlueprint(guild: Guild, blueprint: Blueprint): Promise<ToolResult> {
  const created = {
    categories: [] as string[],
    channels: [] as string[],
    roles: [] as string[],
    overwrites: [] as string[],
  };
  const everyone = guild.roles.everyone;

  try {
    const categoryByName = new Map<string, GuildChannel>();
    for (const category of blueprint.categories) {
      const { channel, created: isNew } = await ensureCategory(guild, category.name);
      categoryByName.set(category.name, channel as GuildChannel);
      if (isNew) created.categories.push(category.name);
    }

    for (const category of blueprint.categories) {
      const parent = categoryByName.get(category.name);
      for (const channel of category.channels) {
        const { channel: made, created: isNew } = await ensureChannel(guild, {
          name: channel.name,
          type: channel.type,
          parentId: parent?.id,
        });
        if (isNew) created.channels.push(`${category.name}/${channel.name}`);

        const deny: string[] = [];
        if (channel.private) deny.push("ViewChannel");
        if (channel.announcementOnly) deny.push("SendMessages");
        if (deny.length > 0) {
          await applyChannelPermission(
            made as GuildChannel,
            everyone,
            buildOverwriteOptions([], deny),
          );
          created.overwrites.push(`${category.name}/${channel.name}: deny ${deny.join(", ")}`);
        }
      }
    }

    for (const role of blueprint.roles) {
      const { created: isNew } = await ensureRole(guild, {
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        permissions: role.permissions,
      });
      if (isNew) created.roles.push(role.name);
    }

    const nothingCreated =
      created.categories.length +
        created.channels.length +
        created.roles.length +
        created.overwrites.length ===
      0;
    return ok({ applied: true, dryRun: false, blueprintId: blueprint.id, created, nothingCreated });
  } catch (error) {
    const code = error instanceof ToolError ? error.code : "apply_failed";
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              applied: false,
              blueprintId: blueprint.id,
              error: { code, message },
              createdBeforeError: created,
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
}

export function registerApplyTools(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "propose_changes",
    {
      title: "Propose blueprint changes",
      description:
        "Compare a blueprint against the current guild and return the plan (roles/categories/channels to create). " +
        "Read-only — makes no changes.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        blueprintId: z.string().describe("Blueprint id to compare (e.g. 'game', 'education')."),
      },
    },
    (args) =>
      run("propose_changes", async () => {
        const blueprint = requireBlueprint(args.blueprintId);
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        const plan = await computePlan(guild, blueprint);
        return ok({ guildId: guild.id, ...plan });
      }),
  );

  server.registerTool(
    "apply_blueprint",
    {
      title: "Apply a blueprint",
      description:
        "Create the missing parts of a blueprint (categories → channels → roles → overwrites), idempotently. " +
        "Use dryRun to preview the plan without applying.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        blueprintId: z.string().describe("Blueprint id to apply (e.g. 'game', 'education')."),
        dryRun: z.boolean().optional().describe("Preview the plan without applying."),
      },
    },
    (args) =>
      run("apply_blueprint", async () => {
        const blueprint = requireBlueprint(args.blueprintId);
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);

        if (args.dryRun) {
          const plan = await computePlan(guild, blueprint);
          return ok({ dryRun: true, guildId: guild.id, ...plan });
        }
        return applyBlueprint(guild, blueprint);
      }),
  );
}
