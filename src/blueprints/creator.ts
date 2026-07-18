import type { Blueprint } from "./schema.js";

/** Creator / streamer / KOL blueprint (see docs/02). */
export const creatorBlueprint: Blueprint = {
  id: "creator",
  serverType: "creator",
  description:
    "Server của creator/streamer/KOL: kết nối fan, thông báo nội dung/lên sóng, quyền lợi theo tier.",
  matchKeywords: [
    "creator",
    "streamer",
    "youtube",
    "youtuber",
    "twitch",
    "kol",
    "fan",
    "subscriber",
    "content",
    "patreon",
    "influencer",
  ],
  roles: [
    {
      name: "Admin",
      color: "#E74C3C",
      hoist: true,
      permissions: ["Administrator"],
      note: "Chủ kênh/quản trị",
    },
    {
      name: "Moderator",
      color: "#E67E22",
      hoist: true,
      permissions: ["ManageMessages", "ModerateMembers"],
      note: "Kiểm duyệt",
    },
    { name: "VIP / OG", color: "#F1C40F", hoist: true, note: "Fan lâu năm / đặc biệt" },
    { name: "Subscriber", color: "#9B59B6", note: "Subscriber/Member theo tier" },
    { name: "Member", color: "#3498DB", note: "Thành viên" },
  ],
  categories: [
    {
      name: "THÔNG TIN",
      channels: [
        { name: "welcome", type: "text" },
        { name: "rules", type: "text", announcementOnly: true },
        { name: "announcements", type: "text", announcementOnly: true },
        {
          name: "new-content",
          type: "text",
          announcementOnly: true,
          topic: "Tự động thông báo video/stream mới",
        },
      ],
    },
    {
      name: "CỘNG ĐỒNG",
      channels: [
        { name: "general", type: "text" },
        { name: "fan-art", type: "text" },
        { name: "clips", type: "text" },
      ],
    },
    {
      name: "ĐỘC QUYỀN",
      channels: [
        { name: "subscribers-only", type: "text", private: true },
        { name: "behind-the-scenes", type: "text", private: true },
      ],
    },
    {
      name: "VOICE",
      channels: [
        { name: "Watch Party", type: "voice" },
        { name: "Hangout", type: "voice" },
      ],
    },
    {
      name: "STAFF",
      channels: [{ name: "mod-chat", type: "text", private: true }],
    },
  ],
  recommendedBots: [
    { name: "Twitch/YouTube notifier", purpose: "Tự thông báo khi lên sóng / đăng video" },
    { name: "Subscriber role bot", purpose: "Gán role theo tier (YouTube/Twitch/Patreon)" },
    { name: "MEE6", purpose: "Leveling để thưởng fan tích cực" },
  ],
  securityNotes: [
    "Quyền lợi độc quyền theo tier phải rõ ràng",
    "Đừng gate quá tay ở kênh chung (dễ tham gia)",
    "Kênh staff tách riêng",
  ],
  onboardingHint: "Onboarding: gán role theo nền tảng subscriber; kênh độc quyền mở theo tier.",
};
