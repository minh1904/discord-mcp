## Why

P1–P3 đã cho MCP đủ đọc, ghi cấu trúc, và dựng khung từ blueprint. Còn thiếu ba mảnh để khép vòng "chuyên gia dựng server": (1) bật **Community + Onboarding** để người mới được dẫn dắt và tự chọn role/kênh; (2) **audit an toàn** để phát hiện rủi ro phân quyền (Administrator, kênh staff lộ, announcement ai cũng đăng được); (3) **tài liệu bàn giao** để giao lại cho khách. Đây chính là P4 trong roadmap.

## What Changes

- Thêm tool **bật Community** (`enable_community`) và **cấu hình Onboarding** (`configure_onboarding` + đọc `get_onboarding`), xử lý đúng luồng 2 bước và ràng buộc của Discord (Community trước; Onboarding cần ≥7 default channel, ≥5 cho @everyone gửi), có `dryRun` và **đường lui hướng dẫn thủ công** khi API từ chối.
- Thêm tool **`audit_permissions`**: quét guild và báo cáo rủi ro (role/bot có Administrator, kênh có tên staff nhưng @everyone vẫn thấy, announcement mở cho @everyone, role bot đặt thấp...).
- Thêm tool **`view_as`**: liệt kê kênh mà một role/member thấy được và không thấy được (accessibility inspection, tham chiếu ExilProductions).
- Thêm tool **`generate_handoff`**: sinh tài liệu bàn giao (Markdown) từ cấu trúc guild hiện tại + (tùy chọn) blueprint: cây role, sơ đồ kênh, bot đề xuất, ghi chú bảo mật.

## Capabilities

### New Capabilities
- `community-onboarding`: Bật Community và cấu hình/đọc Onboarding qua API, có kiểm tra ràng buộc và đường lui thủ công.
- `permission-audit`: Quét rủi ro phân quyền (`audit_permissions`) và soi khả năng truy cập theo role/member (`view_as`).
- `handoff-docs`: Sinh tài liệu bàn giao Markdown từ guild (+ blueprint tùy chọn).

### Modified Capabilities
<!-- Không đổi requirement của các capability đang tồn tại. -->

## Impact

- **Code mới:** `src/tools/community/` (enable_community, get/configure_onboarding), `src/tools/audit/` (audit_permissions, view_as), `src/tools/handoff/` (generate_handoff). Có thể thêm helper trong `src/discord/`.
- **Quyền bot:** cần `Manage Guild` (Community/Onboarding) + `Manage Roles` — bot Administrator theo P1 đã đủ.
- **Ràng buộc Discord:** Community phải bật trước Onboarding; Onboarding cần đủ default channel hợp lệ. Tool kiểm tra trước, `dryRun` để xem trước, và hướng dẫn thủ công nếu API từ chối.
- **An toàn:** `audit_permissions` là read-only; các tool cấu hình có `dryRun`. Đây cũng là nơi hiện thực lại tinh thần least-privilege của roadmap ở mức khuyến nghị (audit cảnh báo Administrator).
