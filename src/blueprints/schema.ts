import type { BlueprintChannelType } from "../discord/structureOps.js";

/** A role a blueprint wants to exist. */
export interface BlueprintRole {
  name: string;
  color?: string;
  hoist?: boolean;
  /** Discord permission flag keys (e.g. "ManageMessages"). */
  permissions?: string[];
  /** Why this role exists — surfaced to the consultant/user. */
  note?: string;
}

/** A channel a blueprint wants to exist within a category. */
export interface BlueprintChannel {
  name: string;
  type: BlueprintChannelType;
  topic?: string;
  /** Deny SendMessages to @everyone (e.g. announcements). */
  announcementOnly?: boolean;
  /** Deny ViewChannel to @everyone (e.g. staff-only). */
  private?: boolean;
}

/** A category grouping channels. */
export interface BlueprintCategory {
  name: string;
  channels: BlueprintChannel[];
}

/** A recommended third-party bot (installed by the user via OAuth, not by MCP). */
export interface BlueprintBot {
  name: string;
  purpose: string;
}

/** A full server blueprint. */
export interface Blueprint {
  /** Unique kebab-case id. */
  id: string;
  /** Server type this blueprint targets (e.g. "game", "education"). */
  serverType: string;
  /** Short human description. */
  description: string;
  /** Keywords used to match a user's stated purpose to this blueprint. */
  matchKeywords: string[];
  roles: BlueprintRole[];
  categories: BlueprintCategory[];
  recommendedBots: BlueprintBot[];
  securityNotes: string[];
  /** Hint for configuring Community Onboarding later (P4). */
  onboardingHint?: string;
}

/** Basic structural validation; throws on an obviously malformed blueprint. */
export function assertValidBlueprint(blueprint: Blueprint): void {
  if (!blueprint.id) throw new Error("Blueprint is missing an id");
  if (!blueprint.serverType) throw new Error(`Blueprint ${blueprint.id} is missing serverType`);
  if (blueprint.roles.length === 0) throw new Error(`Blueprint ${blueprint.id} has no roles`);
  if (blueprint.categories.length === 0)
    throw new Error(`Blueprint ${blueprint.id} has no categories`);
}
