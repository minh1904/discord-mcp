import { z } from "zod";
import { OverwriteType } from "discord.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient } from "../../discord/client.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run } from "../../server/tool.js";

export function registerGetChannelPermissions(server: McpServer): void {
  server.registerTool(
    "get_channel_permissions",
    {
      title: "Get channel permissions",
      description:
        "Read-only list of the permission overwrites on a channel. Each overwrite states whether " +
        "it applies to a role or a member and its allowed/denied permissions.",
      inputSchema: {
        channelId: z.string().describe("The channel id to inspect."),
      },
    },
    (args) =>
      run("get_channel_permissions", async () => {
        const channel = await getClient().channels.fetch(args.channelId);
        if (!channel) {
          throw new ToolError("channel_not_found", `Channel ${args.channelId} was not found.`);
        }
        if (!("permissionOverwrites" in channel)) {
          throw new ToolError(
            "unsupported_channel",
            `Channel ${args.channelId} does not support permission overwrites.`,
          );
        }

        const overwrites = [...channel.permissionOverwrites.cache.values()].map((overwrite) => ({
          id: overwrite.id,
          appliesTo: overwrite.type === OverwriteType.Role ? "role" : "member",
          allow: overwrite.allow.toArray(),
          deny: overwrite.deny.toArray(),
        }));

        return ok({
          channelId: channel.id,
          name: "name" in channel ? channel.name : undefined,
          overwrites,
        });
      }),
  );
}
