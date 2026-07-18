import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, isReady } from "../../discord/client.js";
import { ok, run } from "../../server/tool.js";

export function registerPing(server: McpServer): void {
  server.registerTool(
    "ping",
    {
      title: "Ping / health",
      description: "Report whether the Discord client is connected and ready, plus basic bot info.",
      inputSchema: {},
    },
    () =>
      run(
        "ping",
        () => {
          const ready = isReady();
          let user: string | undefined;
          let guildCount: number | undefined;
          if (ready) {
            const client = getClient();
            user = client.user?.tag;
            guildCount = client.guilds.cache.size;
          }
          return ok({ ready, user, guildCount });
        },
        { requireReady: false },
      ),
  );
}
