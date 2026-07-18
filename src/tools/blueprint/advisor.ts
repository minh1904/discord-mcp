import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DISCOVERY_QUESTIONS } from "../../blueprints/discovery.js";
import { recommendBlueprints } from "../../blueprints/recommend.js";
import { ok, run } from "../../server/tool.js";

export function registerAdvisorTools(server: McpServer): void {
  server.registerTool(
    "get_discovery_questions",
    {
      title: "Get discovery questions",
      description:
        "Return the discovery questions to ask before building a server (purpose, size, groups, features). " +
        "No Discord connection needed.",
      inputSchema: {},
    },
    () =>
      run("get_discovery_questions", () => ok({ questions: DISCOVERY_QUESTIONS }), {
        requireReady: false,
      }),
  );

  server.registerTool(
    "recommend_blueprint",
    {
      title: "Recommend a server blueprint",
      description:
        "Recommend blueprint(s) from a stated purpose (plus optional size and member groups). Returns ranked " +
        "matches with rationale; if the purpose is ambiguous, returns follow-up questions. No Discord connection needed.",
      inputSchema: {
        purpose: z.string().describe("What the server is for, in the user's words."),
        size: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe("Expected member count (for scale guidance)."),
        groups: z
          .array(z.string())
          .optional()
          .describe("Distinct member groups the user mentioned."),
      },
    },
    (args) =>
      run(
        "recommend_blueprint",
        () => ok(recommendBlueprints(args.purpose, args.size, args.groups)),
        { requireReady: false },
      ),
  );
}
