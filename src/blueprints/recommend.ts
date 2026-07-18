import { listBlueprints, type Blueprint } from "./index.js";
import { DISCOVERY_QUESTIONS } from "./discovery.js";

export interface BlueprintMatch {
  id: string;
  serverType: string;
  description: string;
  score: number;
  matchedKeywords: string[];
}

export interface RecommendResult {
  ambiguous: boolean;
  matches: BlueprintMatch[];
  rationale: string;
  /** Present when ambiguous: questions to narrow things down. */
  followUpQuestions?: string[];
  /** Advisory notes, e.g. scale guidance. */
  notes: string[];
}

function scoreBlueprint(blueprint: Blueprint, purpose: string): BlueprintMatch {
  const haystack = purpose.toLowerCase();
  const matched = blueprint.matchKeywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );
  return {
    id: blueprint.id,
    serverType: blueprint.serverType,
    description: blueprint.description,
    score: matched.length,
    matchedKeywords: matched,
  };
}

function scaleNotes(size: number | undefined): string[] {
  if (size === undefined) return [];
  if (size >= 1000) {
    return [
      "Quy mô lớn (≥1.000): cần automation (moderation, onboarding, leveling) để không quá tải.",
    ];
  }
  if (size <= 100) {
    return ["Quy mô nhỏ (≤100): có thể tối giản — ít kênh, ít bot, bỏ qua automation nặng."];
  }
  return [];
}

/**
 * Recommend blueprints by keyword-matching the stated purpose. If nothing
 * matches clearly, mark the result ambiguous and return discovery questions.
 */
export function recommendBlueprints(
  purpose: string,
  size?: number,
  groups?: string[],
): RecommendResult {
  const matches = listBlueprints()
    .map((blueprint) => scoreBlueprint(blueprint, purpose))
    .sort((a, b) => b.score - a.score);

  const best = matches[0];
  const ambiguous = !best || best.score === 0;
  const notes = scaleNotes(size);
  if (groups && groups.length > 0) {
    notes.push(`Nhóm thành viên nêu ra: ${groups.join(", ")} — cân nhắc thêm role tương ứng.`);
  }

  if (ambiguous) {
    return {
      ambiguous: true,
      matches,
      rationale:
        "Mục đích chưa đủ rõ để chọn chắc một blueprint. Hãy hỏi thêm để xác định loại server và quy mô.",
      followUpQuestions: DISCOVERY_QUESTIONS.filter(
        (q) => q.group === "Mục đích & bản chất" || q.group === "Quy mô & tăng trưởng",
      ).map((q) => q.question),
      notes,
    };
  }

  return {
    ambiguous: false,
    matches,
    rationale: `Khớp blueprint "${best.id}" (loại ${best.serverType}) qua từ khóa: ${best.matchedKeywords.join(", ")}.`,
    notes,
  };
}
