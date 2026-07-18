import { Client, GatewayIntentBits, type Guild } from "discord.js";
import { ToolError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

/**
 * Single shared discord.js client for the process.
 *
 * The bot is created with the full set of intents P1 needs to inspect a guild
 * and its members. Privileged intents (Guild Members, Message Content) must be
 * enabled in the Discord Developer Portal or login will fail.
 */

let client: Client | undefined;
let ready = false;

const READY_TIMEOUT_MS = 30_000;

/** Return the initialized client, or throw if `connectDiscord` has not run. */
export function getClient(): Client {
  if (!client) {
    throw new ToolError("not_initialized", "Discord client has not been initialized");
  }
  return client;
}

/** Whether the client is connected and ready to serve requests. */
export function isReady(): boolean {
  return ready && client?.isReady() === true;
}

/**
 * Connect the bot to Discord and wait until it is ready.
 *
 * Idempotent: repeated calls return the existing client. Throws a `ToolError`
 * with a clear message when the token is invalid or intents are not enabled.
 */
export async function connectDiscord(token: string): Promise<Client> {
  if (client) return client;

  const c = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
  });
  client = c;

  c.once("ready", (readyClient) => {
    ready = true;
    logger.info("Discord client ready", {
      user: readyClient.user.tag,
      guilds: readyClient.guilds.cache.size,
    });
  });
  c.on("error", (error) => logger.error("Discord client error", { message: error.message }));

  try {
    await c.login(token);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ToolError(
      "discord_login_failed",
      `Failed to log in to Discord: ${message}. Check that DISCORD_TOKEN is valid and that the ` +
        `privileged intents (Server Members, Message Content) are enabled in the Discord Developer Portal.`,
    );
  }

  await waitForReady(c);
  return c;
}

function waitForReady(c: Client): Promise<void> {
  if (c.isReady()) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new ToolError(
          "discord_not_ready",
          `Discord client did not become ready within ${READY_TIMEOUT_MS}ms`,
        ),
      );
    }, READY_TIMEOUT_MS);

    c.once("ready", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/**
 * Resolve a guild the bot belongs to. Falls back to the configured default
 * guild id. Throws a structured error if no id is available or the bot is not
 * a member of the requested guild.
 */
export async function resolveGuild(guildId: string | undefined): Promise<Guild> {
  const c = getClient();
  if (!guildId) {
    throw new ToolError(
      "guild_required",
      "No guildId provided and no DISCORD_GUILD_ID configured. Pass a guildId argument.",
    );
  }

  try {
    return await c.guilds.fetch(guildId);
  } catch {
    throw new ToolError(
      "guild_not_found",
      `The bot is not in guild ${guildId} (or the id is invalid). Invite the bot to that server first.`,
    );
  }
}
