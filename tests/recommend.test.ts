import { test, expect } from "bun:test";
import { recommendBlueprints } from "../src/blueprints/recommend.js";

function top(purpose: string): string | undefined {
  const result = recommendBlueprints(purpose);
  return result.ambiguous ? undefined : result.matches[0]?.id;
}

test("recognizes each server type from a clear purpose", () => {
  expect(top("server chơi game valorant với bạn bè")).toBe("game");
  expect(top("lớp học ôn thi IELTS cho học viên")).toBe("education");
  expect(top("dự án NFT web3 với holder và governance")).toBe("crypto");
  expect(top("kênh youtube streamer twitch cho fan")).toBe("creator");
  expect(top("hỗ trợ khách hàng SaaS qua ticket")).toBe("business");
  expect(top("cộng đồng công khai lớn có forum")).toBe("community");
});

test("flags an ambiguous purpose and returns follow-up questions", () => {
  const result = recommendBlueprints("làm cho nó xịn");
  expect(result.ambiguous).toBe(true);
  expect((result.followUpQuestions ?? []).length).toBeGreaterThan(0);
});

test("adds scale guidance for large servers", () => {
  const result = recommendBlueprints("server chơi game", 5000);
  expect(result.notes.some((n) => n.includes("automation"))).toBe(true);
});
