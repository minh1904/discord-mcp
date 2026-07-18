import type { Blueprint } from "./schema.js";

/** Crypto / NFT / Web3 / DAO blueprint (see docs/02). */
export const cryptoBlueprint: Blueprint = {
  id: "crypto",
  serverType: "crypto",
  description:
    "Cộng đồng crypto/NFT/Web3: phân tầng theo mức nắm giữ, token-gating, governance, cảnh báo giá.",
  matchKeywords: [
    "crypto",
    "nft",
    "web3",
    "token",
    "holder",
    "dao",
    "defi",
    "blockchain",
    "wallet",
    "ví",
    "governance",
  ],
  roles: [
    {
      name: "Core",
      color: "#E74C3C",
      hoist: true,
      permissions: ["ManageChannels", "ManageMessages"],
      note: "Core/team",
    },
    {
      name: "Moderator",
      color: "#E67E22",
      hoist: true,
      permissions: ["ManageMessages", "ModerateMembers"],
      note: "Kiểm duyệt",
    },
    { name: "Holder", color: "#F1C40F", hoist: true, note: "Đã verify ví, nắm giữ token/NFT" },
    { name: "Contributor", color: "#9B59B6", note: "Đóng góp cho dự án" },
    { name: "Verified", color: "#2ECC71", note: "Đã nối ví" },
  ],
  categories: [
    {
      name: "PUBLIC",
      channels: [
        { name: "welcome", type: "text" },
        { name: "rules", type: "text", announcementOnly: true },
        { name: "verify-wallet", type: "text", topic: "Nối ví để nhận role holder (Collab.Land)" },
        { name: "announcements", type: "text", announcementOnly: true },
        { name: "general", type: "text" },
      ],
    },
    {
      name: "HOLDER",
      channels: [
        { name: "holders-lounge", type: "text", private: true },
        { name: "alpha", type: "text", private: true },
        { name: "trading", type: "text", private: true },
      ],
    },
    {
      name: "GOVERNANCE",
      channels: [
        { name: "proposals", type: "text", announcementOnly: true },
        { name: "voting-discussion", type: "text" },
      ],
    },
    {
      name: "DỮ LIỆU",
      channels: [
        { name: "price-alerts", type: "text", announcementOnly: true },
        { name: "floor-tracking", type: "text", announcementOnly: true },
      ],
    },
    {
      name: "CORE",
      channels: [{ name: "core-chat", type: "text", private: true }],
    },
  ],
  recommendedBots: [
    { name: "Collab.Land", purpose: "Xác minh ví & gán role theo holdings (token-gating)" },
    { name: "Price bot", purpose: "Cảnh báo giá / floor" },
    { name: "Carl-bot / Dyno", purpose: "Moderation, chống scam/impersonation" },
  ],
  securityNotes: [
    "Cảnh giác scam/impersonation cực cao; đánh dấu kênh chính thức rõ",
    "KHÔNG bao giờ để bot có Administrator",
    "Kênh core & holder tách riêng, gated theo verify ví",
  ],
  onboardingHint:
    "Onboarding: hướng người mới tới verify-wallet; role holder gán tự động sau khi nối ví.",
};
