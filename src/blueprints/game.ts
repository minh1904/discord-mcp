import type { Blueprint } from "./schema.js";

/** Game / guild community blueprint (see docs/02). */
export const gameBlueprint: Blueprint = {
  id: "game",
  serverType: "game",
  description:
    "Cộng đồng game/guild: tụ tập chơi cùng, tìm đồng đội (LFG), khoe clip, phân role theo game/rank.",
  matchKeywords: [
    "game",
    "gaming",
    "chơi game",
    "guild",
    "clan",
    "esports",
    "lfg",
    "valorant",
    "minecraft",
    "league",
    "fps",
    "moba",
  ],
  roles: [
    {
      name: "Admin",
      color: "#E74C3C",
      hoist: true,
      permissions: ["Administrator"],
      note: "Quản trị tối cao",
    },
    {
      name: "Moderator",
      color: "#E67E22",
      hoist: true,
      permissions: ["ManageMessages", "KickMembers", "MuteMembers"],
      note: "Kiểm duyệt cộng đồng",
    },
    { name: "Event Host", color: "#9B59B6", note: "Tổ chức game night / giải đấu" },
    { name: "Member", color: "#3498DB", note: "Thành viên đã xác minh" },
  ],
  categories: [
    {
      name: "THÔNG TIN",
      channels: [
        { name: "welcome", type: "text", topic: "Chào mừng thành viên mới" },
        { name: "rules", type: "text", announcementOnly: true, topic: "Nội quy cộng đồng" },
        { name: "announcements", type: "text", announcementOnly: true },
        { name: "patch-notes", type: "text", announcementOnly: true },
      ],
    },
    {
      name: "CHUNG",
      channels: [
        { name: "general", type: "text" },
        { name: "off-topic", type: "text" },
        { name: "clips-screenshots", type: "text", topic: "Khoe clip & ảnh chụp màn hình" },
      ],
    },
    {
      name: "TÌM ĐỘI (LFG)",
      channels: [
        { name: "lfg-general", type: "text", topic: "Tìm đồng đội chơi cùng" },
        { name: "looking-for-group", type: "forum", topic: "Đăng bài tìm team theo game" },
      ],
    },
    {
      name: "VOICE",
      channels: [
        { name: "Team Room 1", type: "voice" },
        { name: "Team Room 2", type: "voice" },
        { name: "Team Room 3", type: "voice" },
        { name: "AFK", type: "voice" },
      ],
    },
    {
      name: "STAFF",
      channels: [
        { name: "mod-chat", type: "text", private: true },
        { name: "mod-log", type: "text", private: true },
      ],
    },
  ],
  recommendedBots: [
    { name: "MEE6", purpose: "Leveling/XP → role tự động; moderation" },
    { name: "Carl-bot", purpose: "Reaction role (chọn game), logging" },
    { name: "Apollo/Sesh", purpose: "Lên lịch game night & giải đấu" },
  ],
  securityNotes: [
    "Không cấp Administrator cho bot bên thứ ba",
    "Kênh mod (mod-chat, mod-log) chỉ staff thấy",
    "Bật verification trước khi mở công khai",
  ],
  onboardingHint: "Câu hỏi onboarding: 'Bạn chơi game nào?' → gán role game tương ứng.",
};
