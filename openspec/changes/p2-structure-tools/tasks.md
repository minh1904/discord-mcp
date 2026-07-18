## 1. Hạ tầng an toàn ghi

- [x] 1.1 Tạo `src/tools/structure/` và aggregator `registerStructureTools(server, config)`; gọi trong `src/server/index.ts`
- [x] 1.2 Helper `assertManageableRole(guild, role)`: so phân cấp với role cao nhất của bot, ném `ToolError("role_hierarchy", ...)`
- [x] 1.3 Helper chuẩn hóa kết quả ghi (`action`, `target`, `after`/`planned`, cờ `dryRun`)
- [x] 1.4 Quy ước tham số `dryRun: z.boolean().optional()` dùng chung cho mọi tool ghi

## 2. Quản lý role

- [x] 2.1 `create_role` (name, color?, hoist?, mentionable?, permissions?) + dryRun
- [x] 2.2 `edit_role` (chỉ đổi trường được cung cấp) + guard phân cấp + dryRun
- [x] 2.3 `delete_role` + guard phân cấp + dryRun
- [x] 2.4 `reorder_role` (đặt position, không vượt phân cấp bot) + dryRun
- [x] 2.5 `assign_role` / `remove_role` cho thành viên + guard phân cấp + dryRun

## 3. Quản lý category & channel

- [x] 3.1 `create_category` (name, position?) + dryRun
- [x] 3.2 `create_channel` (type: text/voice/stage/forum/announcement, parent?, các thuộc tính theo loại) + dryRun
- [x] 3.3 `edit_channel` (name/topic/nsfw/position…, chỉ trường được cung cấp) + dryRun
- [x] 3.4 `move_channel` (đổi parent và/hoặc position; validate parent là category) + dryRun
- [x] 3.5 `delete_channel` (nêu rõ hệ quả khi xóa category có child) + dryRun
- [x] 3.6 `sync_channel_to_category` (đặt overwrite trùng category cha) + dryRun

## 4. Quản lý permission overwrite

- [x] 4.1 `set_channel_permission` (upsert overwrite cho role/member: allow/deny) + dryRun
- [x] 4.2 `remove_channel_permission` (xóa overwrite; báo rõ nếu không có gì để xóa) + dryRun

## 5. Chất lượng & nghiệm thu

- [x] 5.1 Đăng ký toàn bộ tool structure; `bun run typecheck` + `bun run lint` + `bun run format:check` sạch
- [x] 5.2 Smoke test giao thức: 19 tool (5 đọc + 14 ghi) liệt kê đúng; tool ghi trả lỗi có cấu trúc khi chưa kết nối (không sập). *Kiểm tra "dryRun không đổi gì / mô tả đúng" và lỗi phân cấp thực tế cần guild thật → gộp vào 5.3.*
- [ ] 5.3 Nghiệm thu trên guild THẬT: tạo role + category + channel + overwrite, đổi vị trí, thử dryRun và thử thao tác vượt phân cấp, rồi dọn dẹp; quan sát kết quả đúng (cần token thật của user)
