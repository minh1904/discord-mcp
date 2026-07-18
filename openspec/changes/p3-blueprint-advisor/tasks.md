## 1. Tách service ghi từ P2 (structureOps)

- [x] 1.1 Tạo `src/discord/structureOps.ts`: hàm thuần `createRole/editRole/deleteRole/...`, `createCategory`, `createChannel`, `editChannel`, `applyChannelPermission` trả summary
- [x] 1.2 Thêm biến thể idempotent: `ensureRole`, `ensureCategory`, `ensureChannel` (tạo nếu chưa có theo tên, trả cái đã có nếu có)
- [x] 1.3 Refactor tool P2 (`src/tools/structure/*`) gọi structureOps thay vì chứa lõi; giữ nguyên tên tool/tham số/hành vi
- [x] 1.4 Smoke test lại: 19 tool cũ vẫn liệt kê & hoạt động (typecheck/lint/format sạch)

## 2. Thư viện blueprint

- [x] 2.1 `src/blueprints/schema.ts`: interface Blueprint/BlueprintRole/BlueprintCategory/BlueprintChannel + validate cơ bản
- [x] 2.2 `src/blueprints/game.ts` (từ docs/02): roles theo game/rank, LFG, voice team, bot đề xuất, security
- [x] 2.3 `src/blueprints/education.ts` (từ docs/02): roles học viên/mentor, kênh theo môn, co-working voice, bot, security
- [x] 2.4 `src/blueprints/index.ts`: registry Map<id, Blueprint> + `getBlueprint`/`listBlueprints`

## 3. Tool blueprint & tư vấn

- [x] 3.1 `list_blueprints`: định danh + loại + mô tả
- [x] 3.2 `get_blueprint`: chi tiết theo định danh; lỗi có cấu trúc nếu không tồn tại
- [x] 3.3 `get_discovery_questions`: trả bộ câu hỏi khám phá (từ docs/04)
- [x] 3.4 `recommend_blueprint`: khớp từ khóa từ purpose (+size/groups) → xếp hạng + lý do; mơ hồ thì trả ứng viên + câu hỏi

## 4. propose_changes & apply_blueprint

- [x] 4.1 `propose_changes`: đọc guild, diff theo tên (roles/categories/channels) → kế hoạch, không ghi
- [x] 4.2 `apply_blueprint` (dryRun): trả kế hoạch giống propose_changes, không ghi
- [x] 4.3 `apply_blueprint` (thực thi): ensure categories → channels(parent) → roles → overwrites qua structureOps; idempotent
- [x] 4.4 Dịch `private`/`announcementOnly` của blueprint thành overwrite @everyone qua service
- [x] 4.5 Lỗi giữa chừng: dừng, trả lỗi có cấu trúc + danh sách mục đã tạo (`createdBeforeError`)

## 5. Chất lượng & nghiệm thu

- [x] 5.1 Đăng ký tool blueprint; `bun run typecheck` + `bun run lint` + `bun run format:check` sạch
- [x] 5.2 Smoke test giao thức: 25 tool liệt kê đúng; `list_blueprints`/`recommend_blueprint`(game rõ + mơ hồ)/`get_blueprint`(lỗi) chạy không cần guild; `propose_changes` trả `not_ready` khi chưa kết nối
- [ ] 5.3 Nghiệm thu guild THẬT: `recommend_blueprint` → `propose_changes` → `apply_blueprint dryRun` → apply thật → chạy lại (idempotent) → dọn dẹp (cần token thật của user)
