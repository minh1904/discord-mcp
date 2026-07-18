## Why

P1 đã cho MCP "nhìn thấy" cấu trúc guild (read-only). P2 bổ sung lớp **"bàn tay"**: các tool ghi để tạo/sửa/xóa/sắp xếp role, category, channel và permission overwrite. Đây là nền mà lớp "bộ não" (P3) sẽ gọi lại khi apply blueprint, nên phải chắc chắn, an toàn và nhất quán trước khi xây tiếp.

## What Changes

- Thêm nhóm tool **quản lý role**: tạo, sửa, xóa, đổi vị trí (reorder), gán/gỡ role cho thành viên.
- Thêm nhóm tool **quản lý category & channel**: tạo (text/voice/stage/forum/announcement), sửa, xóa, di chuyển (đổi category + vị trí), đồng bộ quyền theo category.
- Thêm nhóm tool **quản lý permission overwrite**: thêm/cập nhật (upsert) và xóa overwrite cho role hoặc member trên một kênh.
- Thêm lớp **an toàn ghi** dùng chung: chế độ `dryRun` (xem trước, không thực thi), kiểm tra phân cấp role trước thao tác, và kết quả trả về mô tả rõ thay đổi để người dùng/AI kiểm chứng.
- Tạo thư mục `src/tools/structure/` (đã chừa từ P1) chứa các tool ghi; tái dùng helper thực thi/lỗi có cấu trúc của P1.

## Capabilities

### New Capabilities
- `role-management`: Tạo/sửa/xóa/đổi vị trí role và gán/gỡ role cho thành viên qua tool ghi.
- `channel-management`: Tạo/sửa/xóa/di chuyển category và channel; đồng bộ quyền kênh theo category.
- `permission-management`: Upsert và xóa permission overwrite cho role/member trên kênh.
- `write-safety`: Ràng buộc an toàn dùng chung cho mọi tool ghi — `dryRun` xem trước, kiểm tra phân cấp role, và kết quả có cấu trúc mô tả thay đổi.

### Modified Capabilities
<!-- Không thay đổi requirement của capability đang tồn tại (mcp-foundation, discord-inspection giữ nguyên). -->

## Impact

- **Code mới:** `src/tools/structure/` (role, channel, category, permission), mở rộng helper an toàn ghi trong `src/server/` hoặc `src/discord/`.
- **Quyền bot:** cần `Manage Roles`, `Manage Channels` (bot đang có Administrator theo quyết định P1 nên đã đủ).
- **Xác nhận thao tác ghi:** trong ngữ cảnh MCP, việc duyệt do MCP client (Claude Code) đảm nhiệm khi gọi tool; MCP bổ sung `dryRun` để xem trước. Không tự cấp quyền, không đề xuất Administrator trong tool.
- **Phase sau:** P3 (`apply_blueprint`) sẽ gọi các tool structure này thay vì gọi thẳng Discord API.
