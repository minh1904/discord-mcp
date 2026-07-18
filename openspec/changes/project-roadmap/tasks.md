> Đây là roadmap mức phase. Mỗi phase khi triển khai sẽ có change OpenSpec riêng (`/opsx:propose`) với tasks chi tiết. Các mục dưới là cột mốc lớn + tiêu chí hoàn thành để "chốt" phase.

## 1. P0 — Discovery & Docs (đã hoàn tất)

- [x] 1.1 Chân dung khách hàng (docs/01)
- [x] 1.2 Thư viện blueprint 6 loại server (docs/02)
- [x] 1.3 Tri thức chuyên gia: role/permission/onboarding/bot/bảo mật (docs/03)
- [x] 1.4 Quy trình tư vấn & bộ câu hỏi khám phá (docs/04)
- [x] 1.5 Khảo sát MCP đối thủ + năng lực/giới hạn Discord API (docs/06)
- [x] 1.6 Chốt stack: TypeScript + discord.js (docs/05)

## 2. P1 — Nền tảng MCP + kết nối Discord (read-only)

- [ ] 2.1 Scaffold dự án TypeScript + `@modelcontextprotocol/sdk`
- [ ] 2.2 Tích hợp `discord.js`, khởi tạo bot client, quản lý token qua env
- [ ] 2.3 Transport stdio + đăng ký MCP server với Claude Code
- [ ] 2.4 Hướng dẫn tạo Discord application/bot + scope + intents tối thiểu (`Guilds`)
- [ ] 2.5 Tool đọc: `get_server_overview`, liệt kê role/category/channel/permission
- [ ] 2.6 Chuẩn hoá error handling + logging cơ bản
- [ ] **Exit P1:** chạy MCP thật, đọc và trình bày được cấu trúc một guild nháp qua Claude Code

## 3. P2 — Lớp thực thi cấu trúc (write tools / "bàn tay")

- [ ] 3.1 Tool tạo/sửa/xóa role (màu, hoist, quyền) + reorder position
- [ ] 3.2 Tool tạo/sửa/xóa category & channel (text/voice/stage/forum), set `parent_id`
- [ ] 3.3 Tool permission overwrite (role & member) + sync channel theo category
- [ ] 3.4 Cơ chế "apply cần duyệt": trình diff thay đổi & chờ xác nhận trước khi ghi
- [ ] 3.5 Kiểm tra phân cấp role bot + cảnh báo trước khi thao tác
- [ ] 3.6 Hàng đợi thực thi tuần tự tôn trọng rate limit (`Retry-After`)
- [ ] **Exit P2:** dựng thủ công (qua tool) một khung role+kênh+quyền hoàn chỉnh trên guild nháp, least-privilege, không dùng Administrator

## 4. P3 — Lớp bộ não (blueprint + tư vấn)

- [ ] 4.1 Định nghĩa schema blueprint (JSON/YAML): roles/categories/channels/onboarding/bots/security
- [ ] 4.2 Chuyển 1–2 blueprint mẫu (vd game + giáo dục) từ docs/02 sang dữ liệu
- [ ] 4.3 Tool `recommend_blueprint` + luồng hỏi khám phá (discovery Q&A) từ docs/04
- [ ] 4.4 Tool `propose_changes`: so blueprint với hiện trạng → danh sách thay đổi
- [ ] 4.5 Tool `apply_blueprint`: thực thi qua lớp bàn tay (P2), idempotent, có duyệt
- [ ] **Exit P3:** từ một câu mô tả mục đích, MCP đề xuất blueprint đúng loại và apply được nguyên khung lên guild nháp

## 5. P4 — Onboarding/Community + Audit an toàn

- [ ] 5.1 Bật Community feature (bước 1) rồi cấu hình Onboarding (bước 2) qua API
- [ ] 5.2 Đảm bảo ràng buộc ≥7 default channel / ≥5 cho @everyone; đường lui hướng dẫn thủ công
- [ ] 5.3 Tool `audit_permissions`: phát hiện Administrator, kênh staff lộ, announcement mở cho @everyone
- [ ] 5.4 "View-as" inspection: role/member thấy được kênh nào (tham chiếu ExilProductions)
- [ ] 5.5 Xuất tài liệu bàn giao (role tree + sơ đồ kênh + bot đề xuất + ghi chú bảo mật)
- [ ] **Exit P4:** blueprint áp xong kèm Onboarding hoạt động + báo cáo audit + tài liệu bàn giao

## 6. P5 — Hoàn thiện & phân phối

- [ ] 6.1 Thêm transport HTTP streamable (deploy dạng service)
- [ ] 6.2 Mở rộng đủ 6 blueprint + hỗ trợ ghép blueprint lai (hybrid)
- [ ] 6.3 Kiểm thử (guild nháp + mock ở mức hợp lý) & xử lý edge cases
- [ ] 6.4 README, hướng dẫn cài đặt/cấu hình, đóng gói phân phối
- [ ] **Exit P5:** phiên bản phát hành cài được bởi người ngoài, tài liệu đầy đủ

## 7. Quyết định cần chốt trước khi vào phase triển khai

- [ ] 7.1 Phạm vi v1 dừng ở P3 hay P4
- [ ] 7.2 Blueprint mẫu làm trước ở P3 (game vs giáo dục)
- [ ] 7.3 Có persist/cache cấu trúc guild hay luôn đọc trực tiếp
- [ ] 7.4 Chiến lược kiểm thử (guild thật vs mock)
