import { z } from "zod";

/** Schema for the raw process environment. Validated at startup. */
export const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
  DISCORD_GUILD_ID: z.string().trim().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
});

/** Normalized, application-facing configuration. */
export interface AppConfig {
  readonly discordToken: string;
  readonly defaultGuildId: string | undefined;
  readonly logLevel: "debug" | "info" | "warn" | "error" | undefined;
}
