import { ChannelType, GuildVerificationLevel } from "discord.js";

/** Human-readable name for a Discord channel type. */
export function channelTypeName(type: ChannelType): string {
  switch (type) {
    case ChannelType.GuildText:
      return "text";
    case ChannelType.GuildVoice:
      return "voice";
    case ChannelType.GuildCategory:
      return "category";
    case ChannelType.GuildAnnouncement:
      return "announcement";
    case ChannelType.GuildStageVoice:
      return "stage";
    case ChannelType.GuildForum:
      return "forum";
    case ChannelType.GuildMedia:
      return "media";
    default:
      return `other(${type})`;
  }
}

/** Human-readable name for a guild verification level. */
export function verificationLevelName(level: GuildVerificationLevel): string {
  return GuildVerificationLevel[level] ?? `unknown(${level})`;
}
