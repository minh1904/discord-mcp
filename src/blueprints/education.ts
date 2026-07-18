import type { Blueprint } from "./schema.js";

/** Education / study community blueprint (see docs/02). */
export const educationBlueprint: Blueprint = {
  id: "education",
  serverType: "education",
  description:
    "Server học tập/lớp/nhóm học: môi trường có tổ chức, học nhóm, accountability, nhắc lịch, nộp bài.",
  matchKeywords: [
    "học",
    "study",
    "education",
    "lớp",
    "class",
    "khóa học",
    "course",
    "school",
    "teacher",
    "mentor",
    "ielts",
    "toán",
    "ôn thi",
    "tutor",
  ],
  roles: [
    {
      name: "Teacher",
      color: "#E67E22",
      hoist: true,
      permissions: ["ManageChannels", "ManageMessages", "KickMembers"],
      note: "Giáo viên/quản trị",
    },
    {
      name: "Mentor",
      color: "#3498DB",
      hoist: true,
      permissions: ["ManageMessages"],
      note: "Trợ giảng/mentor",
    },
    { name: "Student", color: "#2ECC71", note: "Học viên" },
    { name: "Beginner", color: "#95A5A6", note: "Cấp độ nhập môn" },
    { name: "Advanced", color: "#1ABC9C", note: "Cấp độ nâng cao" },
  ],
  categories: [
    {
      name: "THÔNG TIN",
      channels: [
        { name: "welcome", type: "text", topic: "Chào mừng học viên mới" },
        { name: "rules", type: "text", announcementOnly: true, topic: "Nội quy lớp học" },
        { name: "announcements", type: "text", announcementOnly: true },
        { name: "lich-hoc", type: "text", announcementOnly: true, topic: "Lịch học & deadline" },
      ],
    },
    {
      name: "HỌC TẬP",
      channels: [
        { name: "hoi-dap", type: "text", topic: "Hỏi & đáp bài tập" },
        { name: "tai-lieu", type: "text", topic: "Tài liệu & nguồn học" },
        { name: "nop-bai", type: "text", topic: "Nộp bài tập" },
        { name: "thao-luan", type: "forum", topic: "Thảo luận theo chủ đề/môn" },
      ],
    },
    {
      name: "ĐỒNG HÀNH",
      channels: [
        { name: "accountability", type: "text", topic: "Check-in mục tiêu học tập" },
        { name: "study-log", type: "text" },
      ],
    },
    {
      name: "CO-WORKING",
      channels: [
        { name: "Study Room", type: "voice" },
        { name: "Silent Focus", type: "voice" },
      ],
    },
    {
      name: "STAFF",
      channels: [{ name: "teacher-room", type: "text", private: true }],
    },
  ],
  recommendedBots: [
    { name: "Sesh/Apollo", purpose: "Nhắc lịch học & RSVP sự kiện" },
    { name: "Carl-bot", purpose: "Reaction role (chọn môn/cấp độ), logging" },
    { name: "Pomodoro bot", purpose: "Hỗ trợ tập trung khi co-working" },
  ],
  securityNotes: [
    "Kiểm duyệt phù hợp lứa tuổi nếu có học viên vị thành niên",
    "Kênh teacher-room chỉ giáo viên/mentor thấy",
    "Cân nhắc quyền riêng tư khi nộp bài",
  ],
  onboardingHint: "Câu hỏi onboarding: 'Bạn học môn nào? Cấp độ?' → gán role môn & cấp độ.",
};
