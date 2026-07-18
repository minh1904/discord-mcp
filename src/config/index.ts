import { envSchema, type AppConfig } from "./schema.js";

/**
 * Load and validate configuration from the environment.
 *
 * Throws a descriptive error (listing only field names and messages, never the
 * secret values) if required configuration is missing or malformed.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  const data = parsed.data;
  const guildId =
    data.DISCORD_GUILD_ID && data.DISCORD_GUILD_ID.length > 0 ? data.DISCORD_GUILD_ID : undefined;
  const transport = data.MCP_TRANSPORT ?? "stdio";

  let httpPort: number | undefined;
  if (transport === "http") {
    const port = Number(data.MCP_HTTP_PORT);
    if (!data.MCP_HTTP_PORT || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(
        `MCP_TRANSPORT=http requires a valid MCP_HTTP_PORT (1-65535); got "${data.MCP_HTTP_PORT ?? ""}".`,
      );
    }
    httpPort = port;
  }

  return {
    discordToken: data.DISCORD_TOKEN,
    defaultGuildId: guildId,
    logLevel: data.LOG_LEVEL,
    transport,
    httpPort,
  };
}

export type { AppConfig } from "./schema.js";
