import { z } from "zod";

/** Schema for the raw process environment. Validated at startup. */
export const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
  DISCORD_GUILD_ID: z.string().trim().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
  MCP_TRANSPORT: z.enum(["stdio", "http"]).optional(),
  MCP_HTTP_PORT: z.string().trim().optional(),
});

export type TransportKind = "stdio" | "http";

/** Normalized, application-facing configuration. */
export interface AppConfig {
  readonly discordToken: string;
  readonly defaultGuildId: string | undefined;
  readonly logLevel: "debug" | "info" | "warn" | "error" | undefined;
  readonly transport: TransportKind;
  readonly httpPort: number | undefined;
}
