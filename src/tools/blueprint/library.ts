import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getBlueprint, listBlueprints } from "../../blueprints/index.js";
import { ToolError } from "../../lib/errors.js";
import { ok, run } from "../../server/tool.js";

export function registerLibraryTools(server: McpServer): void {
  server.registerTool(
    "list_blueprints",
    {
      title: "List server blueprints",
      description:
        "List available server blueprints (id, server type, description). No Discord connection needed.",
      inputSchema: {},
    },
    () =>
      run(
        "list_blueprints",
        () =>
          ok({
            blueprints: listBlueprints().map((b) => ({
              id: b.id,
              serverType: b.serverType,
              description: b.description,
            })),
          }),
        { requireReady: false },
      ),
  );

  server.registerTool(
    "get_blueprint",
    {
      title: "Get a server blueprint",
      description: "Return the full contents of a blueprint by id. No Discord connection needed.",
      inputSchema: {
        id: z.string().describe("Blueprint id (e.g. 'game', 'education')."),
      },
    },
    (args) =>
      run(
        "get_blueprint",
        () => {
          const blueprint = getBlueprint(args.id);
          if (!blueprint) {
            throw new ToolError("blueprint_not_found", `No blueprint with id "${args.id}".`);
          }
          return ok(blueprint);
        },
        { requireReady: false },
      ),
  );
}
