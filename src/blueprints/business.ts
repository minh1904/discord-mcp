import type { Blueprint } from "./schema.js";

/** Business / SaaS / support blueprint (see docs/02). */
export const businessBlueprint: Blueprint = {
  id: "business",
  serverType: "business",
  description:
    "Server doanh nghiệp/SaaS: hỗ trợ khách qua ticket, thông báo sản phẩm, cộng đồng người dùng, tách nội bộ.",
  matchKeywords: [
    "business",
    "saas",
    "support",
    "hỗ trợ",
    "khách hàng",
    "customer",
    "product",
    "sản phẩm",
    "ticket",
    "b2b",
    "startup",
  ],
  roles: [
    {
      name: "Team",
      color: "#E74C3C",
      hoist: true,
      permissions: ["ManageChannels", "ManageMessages"],
      note: "Nội bộ công ty",
    },
    {
      name: "Support Staff",
      color: "#E67E22",
      hoist: true,
      permissions: ["ManageMessages"],
      note: "Nhân viên hỗ trợ",
    },
    { name: "Partner", color: "#9B59B6", note: "Đối tác" },
    { name: "Customer", color: "#2ECC71", note: "Khách hàng" },
    { name: "Trial", color: "#95A5A6", note: "Dùng thử" },
  ],
  categories: [
    {
      name: "THÔNG TIN",
      channels: [
        { name: "welcome", type: "text" },
        { name: "rules", type: "text", announcementOnly: true },
        { name: "announcements", type: "text", announcementOnly: true },
        { name: "changelog", type: "text", announcementOnly: true },
      ],
    },
    {
      name: "HỖ TRỢ",
      channels: [
        { name: "open-a-ticket", type: "text", topic: "Tạo ticket để được hỗ trợ" },
        { name: "faq", type: "text", announcementOnly: true },
        { name: "status", type: "text", announcementOnly: true },
      ],
    },
    {
      name: "CỘNG ĐỒNG",
      channels: [
        { name: "general", type: "text" },
        { name: "feature-requests", type: "forum" },
        { name: "bug-reports", type: "text" },
        { name: "showcase", type: "text" },
      ],
    },
    {
      name: "NỘI BỘ",
      channels: [
        { name: "team", type: "text", private: true },
        { name: "support-queue", type: "text", private: true },
      ],
    },
  ],
  recommendedBots: [
    { name: "Ticket Tool / Tickets", purpose: "Hệ thống ticket + transcript" },
    { name: "Changelog/announcement bot", purpose: "Đăng cập nhật sản phẩm" },
    { name: "CRM integration", purpose: "Định tuyến ticket sang HubSpot... (tùy chọn)" },
  ],
  securityNotes: [
    "Tách tuyệt đối kênh nội bộ khỏi công khai",
    "Transcript & quyền riêng tư dữ liệu khách hàng",
    "Đặt SLA phản hồi cho support",
  ],
  onboardingHint: "Onboarding: phân biệt Customer/Trial/Partner; mở kênh phù hợp theo nhóm.",
};
