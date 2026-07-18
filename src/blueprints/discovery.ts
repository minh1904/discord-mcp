/** Discovery questions a consultant asks before building (see docs/04). */
export interface DiscoveryQuestion {
  group: string;
  question: string;
}

export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    group: "Mục đích & bản chất",
    question:
      "Server này phục vụ mục đích chính là gì? (game / học tập / cộng đồng / crypto / creator / business / lai)",
  },
  {
    group: "Mục đích & bản chất",
    question:
      "Đối tượng thành viên là ai? (bạn bè nhỏ / công khai / khách hàng / học viên / holder / fan)",
  },
  {
    group: "Mục đích & bản chất",
    question: "Điều quan trọng nhất bạn muốn thành viên làm khi vào server?",
  },
  {
    group: "Quy mô & tăng trưởng",
    question: "Dự kiến bao nhiêu thành viên? (ảnh hưởng mức độ automation cần thiết)",
  },
  { group: "Quy mô & tăng trưởng", question: "Bắt đầu từ 0 hay đã có sẵn cộng đồng?" },
  {
    group: "Quy mô & tăng trưởng",
    question: "Công khai hay riêng tư / có cần xác minh đầu vào không?",
  },
  {
    group: "Cấu trúc & quyền",
    question:
      "Có những nhóm thành viên nào cần phân biệt? (học viên vs mentor, holder vs public, customer vs internal)",
  },
  {
    group: "Cấu trúc & quyền",
    question: "Có nội dung độc quyền / gated không? Gate theo gì? (role, tier, token/NFT)",
  },
  { group: "Cấu trúc & quyền", question: "Ai là admin/mod? Cần kênh nội bộ riêng không?" },
  {
    group: "Tính năng & tích hợp",
    question:
      "Cần automation nào? (leveling, welcome, ticket, nhắc lịch, thông báo live, cảnh báo giá)",
  },
  {
    group: "Tính năng & tích hợp",
    question: "Có tích hợp ngoài không? (Twitch/YouTube, Google Classroom, ví crypto, CRM)",
  },
  {
    group: "Tính năng & tích hợp",
    question: "Có sự kiện định kỳ không? (game night, standup học tập, AMA)",
  },
  {
    group: "Thương hiệu & vận hành",
    question: "Ngôn ngữ chính? Tông giọng? Emoji/màu thương hiệu?",
  },
  { group: "Thương hiệu & vận hành", question: "Ai vận hành hằng ngày sau khi bàn giao?" },
];
