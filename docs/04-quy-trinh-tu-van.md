# Quy trình tư vấn & bộ câu hỏi khám phá (Discovery)

Một chuyên gia thật **không dựng server ngay**. Họ hỏi trước. MCP phải mô phỏng đúng quy trình này: hiểu rõ → đề xuất blueprint → xác nhận → mới thực thi.

---

## Quy trình 5 bước

```
1. KHÁM PHÁ (Discovery)   → hỏi để hiểu mục tiêu, đối tượng, quy mô
2. ĐỀ XUẤT (Blueprint)    → chọn/ghép blueprint, trình bày role+kênh+bot
3. XÁC NHẬN (Confirm)     → khách duyệt, điều chỉnh
4. THỰC THI (Build)       → tạo role, category, kênh, quyền, onboarding
5. BÀN GIAO (Handoff)     → xuất tài liệu, checklist bot cần cài, hướng dẫn vận hành
```

Giai đoạn hiện tại (docs) tập trung bước **1–2**. Bước 4 là phần code MCP sau này.

---

## Bộ câu hỏi khám phá

### A. Mục tiêu & bản chất
1. Server này phục vụ **mục đích chính** là gì? (một câu) — game / học tập / cộng đồng / crypto / creator / business / lai?
2. Ai là **đối tượng** thành viên? (bạn bè nhỏ / công khai / khách hàng / học viên / holder / fan)
3. Điều **quan trọng nhất** bạn muốn thành viên làm khi vào server?

### B. Quy mô & tăng trưởng
4. Dự kiến **bao nhiêu thành viên**? (server ~50 người gần như không cần automation; ~5.000 người thì bắt buộc)
5. Đang có sẵn cộng đồng hay **bắt đầu từ 0**? (ảnh hưởng chiến lược phá cold start)
6. Công khai hay riêng tư / có cần **xác minh** đầu vào không?

### C. Cấu trúc & quyền
7. Có những **nhóm thành viên** nào cần phân biệt? (vd học viên vs mentor, holder vs public, customer vs internal)
8. Có nội dung **độc quyền / gated** không? Gate theo gì? (role, tier, token/NFT)
9. Ai sẽ là **admin/mod**? Cần kênh nội bộ riêng cho họ không?

### D. Tính năng & tích hợp
10. Cần **automation** nào? (leveling, welcome, ticket, nhắc lịch, thông báo live, cảnh báo giá...)
11. Có **tích hợp ngoài** không? (Twitch/YouTube, Google Classroom, ví crypto, CRM...)
12. Có sự kiện định kỳ không? (game night, standup học tập, AMA)

### E. Thương hiệu & vận hành
13. Ngôn ngữ chính? Tông giọng? Emoji/màu thương hiệu?
14. Ai vận hành hằng ngày sau khi bàn giao?

> **Mẹo cho MCP:** không cần hỏi cả 14 câu. Chỉ cần câu **1 (mục đích)** là đã chọn được blueprint gốc; các câu còn lại để tinh chỉnh. Nếu user trả lời mơ hồ ("làm cho xịn"), MCP hỏi lại đúng 2–3 câu quan trọng nhất (mục đích, quy mô, nhóm thành viên).

---

## Bảng suy luận: từ câu trả lời → quyết định

| Tín hiệu từ khách | Quyết định thiết kế |
|---|---|
| "server chơi game X" | Blueprint Game; voice team rooms; LFG theo game; leveling→rank |
| "dạy học / lớp / nhóm học" | Blueprint Giáo dục; voice co-working; kênh theo môn; nhắc lịch |
| "cộng đồng công khai, sợ spam" | Verification gate + Raid Protection + automod; forum theo chủ đề |
| "token/NFT/holder" | Collab.Land verify; kênh gated theo holdings; price alerts |
| "kênh YouTube/Twitch của tôi" | Tích hợp thông báo live/upload; role theo tier; kênh subscriber |
| "hỗ trợ khách hàng / SaaS" | Ticket system; kênh feedback/bug; tách kênh nội bộ |
| ">1.000 thành viên" | Bắt buộc automation, moderation mạnh, onboarding đầy đủ |
| "<100 người, bạn bè" | Tối giản: ít kênh, ít bot, bỏ qua automation nặng |

---

## Đầu ra của bước Đề xuất (Blueprint proposal)

Trước khi thực thi, MCP nên trình cho khách một bản tóm tắt gồm:
1. **Loại server đã nhận diện** + lý do.
2. **Cây role** (kèm ghi chú quyền chính).
3. **Sơ đồ category & kênh** (dạng cây).
4. **Cấu hình Onboarding** (câu hỏi → role/kênh).
5. **Danh sách bot đề xuất** + việc mỗi bot đảm nhận (kèm ghi chú "user tự cài qua OAuth").
6. **Ghi chú bảo mật** (least-privilege, gate, kênh staff).

Khách xác nhận/điều chỉnh → mới sang bước thực thi. Đây cũng chính là **tài liệu bàn giao** cho khách hàng cuối.
