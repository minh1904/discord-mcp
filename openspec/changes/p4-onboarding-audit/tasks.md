## 1. Community & Onboarding

- [x] 1.1 `src/tools/community/` + `registerCommunityTools` (đăng ký trong `server/index.ts`)
- [x] 1.2 `enable_community` (rulesChannelId, publicUpdatesChannelId) + dryRun; báo trạng thái nếu đã bật
- [x] 1.3 `get_onboarding` (read-only): trạng thái, default channels, prompts hiện có
- [x] 1.4 `configure_onboarding`: kiểm Community đã bật + `defaultChannelIds ≥ 7` + `≥5` cho @everyone gửi trước khi gọi API
- [x] 1.5 Vi phạm ràng buộc → lỗi có cấu trúc + hướng dẫn thủ công, không gọi API; hỗ trợ dryRun
- [x] 1.6 Gọi `guild.editOnboarding(...)` với enabled/defaultChannels/prompts

## 2. Audit phân quyền

- [x] 2.1 `src/tools/audit/` + `registerAuditTools`
- [x] 2.2 `audit_permissions`: role/bot có Administrator (high); kênh staff bị @everyone thấy (medium); announcement @everyone gửi được (low); role bot không cao nhất (info) → findings[] có severity
- [x] 2.3 `view_as` (role/member): danh sách kênh visible/hidden theo ViewChannel; lỗi nếu id không hợp lệ

## 3. Tài liệu bàn giao

- [x] 3.1 `src/tools/handoff/` + `registerHandoffTools`
- [x] 3.2 `generate_handoff`: render Markdown cây role + sơ đồ category/kênh từ guild
- [x] 3.3 Kèm blueprint (tùy chọn): thêm bot đề xuất + ghi chú bảo mật; lỗi có cấu trúc nếu blueprint id sai

## 4. Chất lượng & nghiệm thu

- [x] 4.1 Đăng ký toàn bộ tool P4; `bun run typecheck` + `bun run lint` + `bun run format:check` sạch
- [x] 4.2 Smoke test giao thức: 31 tool liệt kê đúng (6 tool P4 có mặt); tool cần guild (`audit_permissions`, `generate_handoff`) trả `not_ready` khi chưa kết nối. *Ràng buộc onboarding kiểm sau khi resolve guild → gộp vào 4.3.*
- [ ] 4.3 Nghiệm thu guild THẬT: bật Community → configure_onboarding (thử vi phạm <7 kênh) → audit_permissions → view_as → generate_handoff (cần token thật của user)
