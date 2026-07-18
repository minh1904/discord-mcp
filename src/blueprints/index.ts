import { assertValidBlueprint, type Blueprint } from "./schema.js";
import { gameBlueprint } from "./game.js";
import { educationBlueprint } from "./education.js";

const ALL: Blueprint[] = [gameBlueprint, educationBlueprint];
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
