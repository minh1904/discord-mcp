import { test, expect } from "bun:test";
import { loadConfig } from "../src/config/index.js";

test("throws when DISCORD_TOKEN is missing", () => {
  expect(() => loadConfig({})).toThrow(/environment configuration/i);
});

test("defaults to stdio transport", () => {
  const config = loadConfig({ DISCORD_TOKEN: "x" });
  expect(config.transport).toBe("stdio");
  expect(config.httpPort).toBeUndefined();
  expect(config.defaultGuildId).toBeUndefined();
});

test("normalizes an empty guild id to undefined", () => {
  const config = loadConfig({ DISCORD_TOKEN: "x", DISCORD_GUILD_ID: "" });
  expect(config.defaultGuildId).toBeUndefined();
});

test("http transport requires a valid port", () => {
  expect(() => loadConfig({ DISCORD_TOKEN: "x", MCP_TRANSPORT: "http" })).toThrow(/MCP_HTTP_PORT/);
  expect(() =>
    loadConfig({ DISCORD_TOKEN: "x", MCP_TRANSPORT: "http", MCP_HTTP_PORT: "abc" }),
  ).toThrow(/MCP_HTTP_PORT/);
});

test("http transport parses a valid port", () => {
  const config = loadConfig({ DISCORD_TOKEN: "x", MCP_TRANSPORT: "http", MCP_HTTP_PORT: "3000" });
  expect(config.transport).toBe("http");
  expect(config.httpPort).toBe(3000);
});
