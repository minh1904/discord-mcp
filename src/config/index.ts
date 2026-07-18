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

  return {
    discordToken: data.DISCORD_TOKEN,
    defaultGuildId: guildId,
    logLevel: data.LOG_LEVEL,
  };
}

export type { AppConfig } from "./schema.js";
