import type { Blueprint } from "./schema.js";

/** Large public community / brand blueprint (see docs/02). */
export const communityBlueprint: Blueprint = {
  id: "community",
  serverType: "community",
  description:
    "Cộng đồng công khai lớn / thương hiệu: không gian chủ đề rõ ràng, kiểm duyệt mạnh, chống spam.",
  matchKeywords: [
    "community",
    "cộng đồng",
    "public",
    "công khai",
    "brand",
    "thương hiệu",
    "forum",
    "hangout",
    "fandom",
  ],
  roles: [
    {
      name: "Admin",
      color: "#E74C3C",
      hoist: true,
      permissions: ["Administrator"],
      note: "Quản trị",
    },
    {
      name: "Moderator",
      color: "#E67E22",
      hoist: true,
      permissions: ["ManageMessages", "KickMembers", "BanMembers", "ModerateMembers"],
      note: "Kiểm duyệt",
    },
    { name: "Trusted", color: "#1ABC9C", note: "Thành viên tích cực, đáng tin" },
    { name: "Member", color: "#3498DB", note: "Đã xác minh" },
    { name: "Unverified", color: "#95A5A6", note: "Chưa qua verification" },
  ],
  categories: [
    {
      name: "CỔNG VÀO",
      channels: [
        { name: "welcome", type: "text" },
        { name: "rules", type: "text", announcementOnly: true },
        { name: "verify", type: "text", topic: "Xác minh để mở khóa server" },
        { name: "announcements", type: "text", announcementOnly: true },
        { name: "server-guide", type: "text", announcementOnly: true },
      ],
    },
    {
      name: "CHUNG",
      channels: [
        { name: "general", type: "text" },
        { name: "introductions", type: "text" },
        { name: "off-topic", type: "text" },
      ],
    },
    {
      name: "CHỦ ĐỀ",
      channels: [
        { name: "discussion", type: "forum", topic: "Thảo luận dài theo chủ đề" },
        { name: "media", type: "text" },
      ],
    },
    {
      name: "SỰ KIỆN",
      channels: [
        { name: "events", type: "text", announcementOnly: true },
        { name: "Town Hall", type: "stage" },
      ],
    },
    {
      name: "STAFF",
      channels: [
        { name: "mod-chat", type: "text", private: true },
        { name: "mod-log", type: "text", private: true },
        { name: "reports", type: "text", private: true },
      ],
    },
  ],
  recommendedBots: [
    { name: "Dyno / Carl-bot", purpose: "Moderation, automod, logging" },
    { name: "Carl-bot", purpose: "Reaction role cho sở thích" },
    { name: "Ticket Tool", purpose: "Nhận báo cáo qua ticket" },
  ],
  securityNotes: [
    "Bật verification gate + Raid Protection",
    "Least-privilege nghiêm ngặt; tách bạch kênh staff",
    "Chuẩn bị automation vì quy mô lớn",
  ],
  onboardingHint: "Onboarding: chọn sở thích → gán role & mở kênh chủ đề tương ứng.",
};
