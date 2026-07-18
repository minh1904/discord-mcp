import {
  ChannelType,
  type ColorResolvable,
  type Guild,
  type GuildChannel,
  type GuildChannelEditOptions,
  type NonThreadGuildBasedChannel,
  type PermissionOverwriteOptions,
  type PermissionResolvable,
  type Role,
  type RoleResolvable,
  type UserResolvable,
} from "discord.js";
import { ToolError } from "../lib/errors.js";
import { channelTypeName } from "./format.js";

/**
 * Pure, reusable structure operations against a guild. Both the P2 write tools
 * and the P3 blueprint apply flow call these, so permission/hierarchy handling
 * lives in one place.
 *
 * `create*` always create. `ensure*` are idempotent: they reuse an existing
 * object matched by name, otherwise create it.
 */

export const CHANNEL_TYPE_MAP = {
  text: ChannelType.GuildText,
  voice: ChannelType.GuildVoice,
  stage: ChannelType.GuildStageVoice,
  forum: ChannelType.GuildForum,
  announcement: ChannelType.GuildAnnouncement,
} as const;

export type BlueprintChannelType = keyof typeof CHANNEL_TYPE_MAP;

// ---- Hierarchy guard -------------------------------------------------------

export function assertManageableRole(guild: Guild, role: Role): void {
  const me = guild.members.me;
  if (!me) {
    throw new ToolError("bot_member_missing", "Could not resolve the bot's own guild member.");
  }
  const botHighest = me.roles.highest.position;
  if (role.position >= botHighest) {
    throw new ToolError(
      "role_hierarchy",
      `Role "${role.name}" (position ${role.position}) is not below the bot's highest role ` +
        `(position ${botHighest}). Move the bot's role above it and try again.`,
    );
  }
}

export function botHighestPosition(guild: Guild): number {
  return guild.members.me?.roles.highest.position ?? 0;
}

// ---- Summaries -------------------------------------------------------------

export function summarizeRole(role: Role): Record<string, unknown> {
  return {
    id: role.id,
    name: role.name,
    color: role.hexColor,
    position: role.position,
    hoist: role.hoist,
    mentionable: role.mentionable,
    permissions: role.permissions.toArray(),
  };
}

export function summarizeChannel(channel: GuildChannel): Record<string, unknown> {
  return {
    id: channel.id,
    name: channel.name,
    type: channelTypeName(channel.type),
    parentId: channel.parentId,
    position: channel.position,
  };
}

// ---- Role operations -------------------------------------------------------

export interface RoleInput {
  name: string;
  color?: string | undefined;
  hoist?: boolean | undefined;
  mentionable?: boolean | undefined;
  permissions?: string[] | undefined;
}

export async function createRole(guild: Guild, input: RoleInput): Promise<Role> {
  return guild.roles.create({
    name: input.name,
    color: input.color as ColorResolvable | undefined,
    hoist: input.hoist,
    mentionable: input.mentionable,
    permissions: input.permissions as PermissionResolvable | undefined,
  });
}

export async function editRole(role: Role, input: Partial<RoleInput>): Promise<Role> {
  assertManageableRole(role.guild, role);
  return role.edit({
    name: input.name,
    color: input.color as ColorResolvable | undefined,
    hoist: input.hoist,
    mentionable: input.mentionable,
    permissions: input.permissions as PermissionResolvable | undefined,
  });
}

export async function deleteRole(role: Role): Promise<void> {
  assertManageableRole(role.guild, role);
  await role.delete();
}

/** Idempotent: reuse a role with the same name, else create it. */
export async function ensureRole(
  guild: Guild,
  input: RoleInput,
): Promise<{ role: Role; created: boolean }> {
  await guild.roles.fetch();
  const existing = guild.roles.cache.find((r) => r.name === input.name);
  if (existing) return { role: existing, created: false };
  return { role: await createRole(guild, input), created: true };
}

// ---- Channel / category operations -----------------------------------------

export interface ChannelInput {
  name: string;
  type: BlueprintChannelType;
  parentId?: string | undefined;
  topic?: string | undefined;
  nsfw?: boolean | undefined;
  position?: number | undefined;
}

export async function createCategory(
  guild: Guild,
  name: string,
  position?: number,
): Promise<NonThreadGuildBasedChannel> {
  return guild.channels.create({ name, type: ChannelType.GuildCategory, position });
}

export async function createChannel(
  guild: Guild,
  input: ChannelInput,
): Promise<NonThreadGuildBasedChannel> {
  return guild.channels.create({
    name: input.name,
    type: CHANNEL_TYPE_MAP[input.type],
    parent: input.parentId,
    topic: input.topic,
    nsfw: input.nsfw,
    position: input.position,
  });
}

export async function editChannel(
  channel: GuildChannel,
  options: GuildChannelEditOptions,
): Promise<GuildChannel> {
  return channel.edit(options);
}

/** Idempotent category by name. */
export async function ensureCategory(
  guild: Guild,
  name: string,
): Promise<{ channel: NonThreadGuildBasedChannel; created: boolean }> {
  await guild.channels.fetch();
  const existing = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === name,
  );
  if (existing) return { channel: existing as NonThreadGuildBasedChannel, created: false };
  return { channel: await createCategory(guild, name), created: true };
}

/** Idempotent channel by name within a parent category. */
export async function ensureChannel(
  guild: Guild,
  input: ChannelInput,
): Promise<{ channel: NonThreadGuildBasedChannel; created: boolean }> {
  await guild.channels.fetch();
  const existing = guild.channels.cache.find(
    (c) =>
      c.name === input.name &&
      c.type === CHANNEL_TYPE_MAP[input.type] &&
      (c.parentId ?? undefined) === input.parentId,
  );
  if (existing) return { channel: existing as NonThreadGuildBasedChannel, created: false };
  return { channel: await createChannel(guild, input), created: true };
}

// ---- Permission overwrites -------------------------------------------------

export async function resolveOverwriteTarget(
  guild: Guild,
  targetId: string,
  targetType: "role" | "member",
): Promise<RoleResolvable | UserResolvable> {
  if (targetType === "role") {
    const role = await guild.roles.fetch(targetId);
    if (!role) throw new ToolError("role_not_found", `Role ${targetId} not found.`);
    return role;
  }
  return guild.members.fetch(targetId);
}

export function buildOverwriteOptions(allow: string[], deny: string[]): PermissionOverwriteOptions {
  const options: PermissionOverwriteOptions = {};
  for (const permission of allow) options[permission as keyof PermissionOverwriteOptions] = true;
  for (const permission of deny) options[permission as keyof PermissionOverwriteOptions] = false;
  return options;
}

export async function applyChannelPermission(
  channel: GuildChannel,
  target: RoleResolvable | UserResolvable,
  options: PermissionOverwriteOptions,
): Promise<void> {
  await channel.permissionOverwrites.edit(target, options);
}
