import { assertValidBlueprint, type Blueprint } from "./schema.js";
import { gameBlueprint } from "./game.js";
import { educationBlueprint } from "./education.js";
import { communityBlueprint } from "./community.js";
import { cryptoBlueprint } from "./crypto.js";
import { creatorBlueprint } from "./creator.js";
import { businessBlueprint } from "./business.js";

const ALL: Blueprint[] = [
  gameBlueprint,
  educationBlueprint,
  communityBlueprint,
  cryptoBlueprint,
  creatorBlueprint,
  businessBlueprint,
];
for (const blueprint of ALL) assertValidBlueprint(blueprint);

const REGISTRY = new Map<string, Blueprint>(ALL.map((b) => [b.id, b]));

/** List all available blueprints. */
export function listBlueprints(): Blueprint[] {
  return [...REGISTRY.values()];
}

/** Get a blueprint by id, or undefined if not found. */
export function getBlueprint(id: string): Blueprint | undefined {
  return REGISTRY.get(id);
}

export type { Blueprint } from "./schema.js";
