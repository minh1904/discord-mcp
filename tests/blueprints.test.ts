import { test, expect } from "bun:test";
import { listBlueprints, getBlueprint } from "../src/blueprints/index.js";
import { assertValidBlueprint } from "../src/blueprints/schema.js";

const EXPECTED_IDS = ["game", "education", "community", "crypto", "creator", "business"];

test("library contains all six server types", () => {
  const ids = listBlueprints()
    .map((b) => b.id)
    .sort();
  expect(ids).toEqual([...EXPECTED_IDS].sort());
});

test("every blueprint is structurally valid", () => {
  for (const blueprint of listBlueprints()) {
    expect(() => assertValidBlueprint(blueprint)).not.toThrow();
  }
});

test("every blueprint has matchKeywords and at least one channel", () => {
  for (const blueprint of listBlueprints()) {
    expect(blueprint.matchKeywords.length).toBeGreaterThan(0);
    const channelCount = blueprint.categories.reduce((n, c) => n + c.channels.length, 0);
    expect(channelCount).toBeGreaterThan(0);
  }
});

test("getBlueprint returns undefined for unknown id", () => {
  expect(getBlueprint("nope")).toBeUndefined();
  expect(getBlueprint("crypto")?.id).toBe("crypto");
});
