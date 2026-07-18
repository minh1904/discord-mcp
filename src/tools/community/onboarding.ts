import { z } from "zod";
import { GuildFeature, PermissionFlagsBits, type GuildOnboardingPromptData } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../../config/index.js";
import { resolveGuild } from "../../discord/client.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run } from "../../server/tool.js";

const MIN_DEFAULT_CHANNELS = 7;
const MIN_EVERYONE_SENDABLE = 5;

export function registerOnboardingTools(server: McpServer, config: AppConfig): void {
  server.registerTool(
    "get_onboarding",
    {
      title: "Get onboarding configuration",
      description:
        "Read-only: return the current Community Onboarding config (enabled, default channels, prompts).",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
      },
    },
    (args) =>
      run("get_onboarding", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);
        const onboarding = await guild.fetchOnboarding();
        return ok({
          guildId: guild.id,
          enabled: onboarding.enabled,
          mode: onboarding.mode,
          defaultChannels: [...onboarding.defaultChannels.values()].map((c) => ({
            id: c.id,
            name: c.name,
          })),
          prompts: [...onboarding.prompts.values()].map((p) => ({
            id: p.id,
            title: p.title,
            options: [...p.options.values()].map((o) => ({
              title: o.title,
              roleIds: [...o.roles.keys()],
              channelIds: [...o.channels.keys()],
            })),
          })),
        });
      }),
  );

  server.registerTool(
    "configure_onboarding",
    {
      title: "Configure onboarding",
      description:
        "Configure Community Onboarding: default channels and prompts (each option grants roles/channels). " +
        "Checks Discord constraints first (Community enabled; >=7 default channels, >=5 lettable by @everyone). " +
        "Supports dryRun.",
      inputSchema: {
        guildId: z.string().optional().describe("Guild id. Omit to use DISCORD_GUILD_ID."),
        defaultChannelIds: z
          .array(z.string())
          .describe("Channels every new member sees (need >=7)."),
        enabled: z.boolean().optional().describe("Enable onboarding (default true)."),
        prompts: z
          .array(
            z.object({
              title: z.string(),
              singleSelect: z.boolean().optional(),
              required: z.boolean().optional(),
              options: z
                .array(
                  z.object({
                    title: z.string(),
                    description: z.string().optional(),
                    roleIds: z.array(z.string()).optional(),
                    channelIds: z.array(z.string()).optional(),
                  }),
                )
                .describe("Answer options; each grants roles and/or channels."),
            }),
          )
          .optional()
          .describe("Onboarding questions."),
        dryRun: z.boolean().optional(),
      },
    },
    (args) =>
      run("configure_onboarding", async () => {
        const guild = await resolveGuild(args.guildId ?? config.defaultGuildId);

        if (!guild.features.includes(GuildFeature.Community)) {
          throw new ToolError(
            "community_required",
            "Community is not enabled. Run enable_community first, then configure onboarding.",
          );
        }

        const willEnable = args.enabled ?? true;
        if (willEnable) {
          if (args.defaultChannelIds.length < MIN_DEFAULT_CHANNELS) {
            throw new ToolError(
              "onboarding_constraint",
              `Onboarding needs at least ${MIN_DEFAULT_CHANNELS} default channels; got ${args.defaultChannelIds.length}. ` +
                "Add more default channels, or configure onboarding manually in Server Settings.",
            );
          }
          await guild.channels.fetch();
          const everyone = guild.roles.everyone;
          let sendable = 0;
          for (const id of args.defaultChannelIds) {
            const channel = guild.channels.cache.get(id);
            if (channel && channel.permissionsFor(everyone)?.has(PermissionFlagsBits.SendMessages))
              sendable++;
          }
          if (sendable < MIN_EVERYONE_SENDABLE) {
            throw new ToolError(
              "onboarding_constraint",
              `At least ${MIN_EVERYONE_SENDABLE} default channels must let @everyone send messages; only ${sendable} do. ` +
                "Adjust channel permissions or configure onboarding manually.",
            );
          }
        }

        const plan = {
          enabled: willEnable,
          defaultChannelIds: args.defaultChannelIds,
          promptCount: args.prompts?.length ?? 0,
        };
        if (args.dryRun) {
          return ok({ dryRun: true, planned: plan });
        }

        const prompts: GuildOnboardingPromptData[] | undefined = args.prompts?.map((p) => ({
          title: p.title,
          singleSelect: p.singleSelect ?? true,
          required: p.required ?? false,
          inOnboarding: true,
          options: p.options.map((o) => ({
            title: o.title,
            ...(o.description ? { description: o.description } : {}),
            roles: o.roleIds ?? [],
            channels: o.channelIds ?? [],
          })),
        }));

        const updated = await guild.editOnboarding({
          enabled: willEnable,
          defaultChannels: args.defaultChannelIds,
          ...(prompts ? { prompts } : {}),
        });
        return ok({
          configured: true,
          enabled: updated.enabled,
          defaultChannelCount: updated.defaultChannels.size,
          promptCount: updated.prompts.size,
        });
      }),
  );
}
