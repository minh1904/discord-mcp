import { test, expect } from "bun:test";
import { ChannelType } from "discord.js";
import { channelTypeName } from "../src/discord/format.js";

test("maps channel types to readable names", () => {
  expect(channelTypeName(ChannelType.GuildText)).toBe("text");
  expect(channelTypeName(ChannelType.GuildVoice)).toBe("voice");
  expect(channelTypeName(ChannelType.GuildCategory)).toBe("category");
  expect(channelTypeName(ChannelType.GuildAnnouncement)).toBe("announcement");
  expect(channelTypeName(ChannelType.GuildStageVoice)).toBe("stage");
  expect(channelTypeName(ChannelType.GuildForum)).toBe("forum");
  expect(channelTypeName(ChannelType.GuildMedia)).toBe("media");
});
