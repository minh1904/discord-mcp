## Context

P4 khép vòng chuyên gia: Onboarding (dẫn dắt người mới), audit an toàn, và tài liệu bàn giao. Ràng buộc Discord (từ [docs/06](../../../docs/06-khao-sat-mcp-va-api.md)): Onboarding cần bật **Community** trước (2 bước, không đổi cùng lúc), và khi bật Onboarding cần **≥7 default channel / ≥5 cho @everyone gửi**. discord.js hỗ trợ `guild.edit({ features })` và `guild.editOnboarding()` (kiểm chứng chính xác bằng typecheck khi code).

Tận dụng sẵn có: `resolveGuild`, `run/ok/fail`, `structureOps`, thư viện blueprint (P3), và `channelTypeName`.

## Goals / Non-Goals

**Goals:**
- Bật Community + cấu hình/đọc Onboarding, kiểm ràng buộc trước, có `dryRun` và đường lui thủ công.
- `audit_permissions` phát hiện rủi ro phổ biến; `view_as` soi truy cập theo role/member.
- `generate_handoff` xuất Markdown từ guild (+ blueprint tùy chọn).

**Non-Goals:**
- Không tự sửa rủi ro trong audit (chỉ báo cáo; sửa dùng tool P2).
- Không dựng nội dung welcome/rules text (người dùng tự soạn).
- Không thêm blueprint mới (P5).

## Decisions

### D1: Cấu trúc thư mục theo domain
```
src/tools/community/   # enable_community, get_onboarding, configure_onboarding
src/tools/audit/       # audit_permissions, view_as
src/tools/handoff/     # generate_handoff
```
Đăng ký qua `registerCommunityTools/registerAuditTools/registerHandoffTools` trong `server/index.ts`.

### D2: Onboarding 2 bước, kiểm ràng buộc phía client trước
- `configure_onboarding` kiểm tra trước khi gọi API: Community đã bật chưa; `defaultChannelIds.length >= 7`; và ≥5 kênh trong đó cho `@everyone` gửi (đọc `channel.permissionsFor(everyone).has(SendMessages)`).
- Nếu vi phạm → trả lỗi có cấu trúc + hướng dẫn (thêm kênh / bật Community), **không gọi API**. Đây là "đường lui thủ công".
- *Vì sao*: Discord trả lỗi khó hiểu; kiểm trước cho thông điệp rõ và tránh thay đổi nửa vời.

### D3: Dùng API discord.js, xác thực bằng typecheck
- `guild.edit({ features: [...features, GuildFeature.Community], rulesChannelId, publicUpdatesChannelId })` để bật Community; `guild.editOnboarding({ enabled, mode, defaultChannelIds, prompts })` để cấu hình.
- Nếu chữ ký khác ở phiên bản discord.js đang dùng, typecheck sẽ báo và ta điều chỉnh (không đoán mù).

### D4: audit_permissions theo bộ quy tắc rõ ràng, có severity
- Quy tắc: (a) role != @everyone có `Administrator` → high; (b) kênh tên chứa từ khóa nội bộ ("mod","staff","admin","internal") mà `@everyone` có `ViewChannel` → medium; (c) kênh announcement (tên chứa "announce"/"thông báo") mà `@everyone` có `SendMessages` → low/medium; (d) role bot không phải cao nhất → info.
- Trả `findings[]` {code, severity, message, target}. Read-only, giải thích được.

### D5: view_as bằng permissionsFor
- Với role: duyệt kênh, `channel.permissionsFor(role).has(ViewChannel)`. Với member: `channel.permissionsFor(member)`. Chia hai danh sách visible/hidden.

### D6: generate_handoff sinh Markdown thuần
- Đọc roles (sắp phân cấp) + categories/channels; render Markdown (cây role, sơ đồ kênh). Nếu có blueprintId hợp lệ → thêm mục bot đề xuất + ghi chú bảo mật (từ P3). Trả về text Markdown trong kết quả tool.

## Risks / Trade-offs

- **Chữ ký API Community/Onboarding khác nhau giữa phiên bản** → dựa typecheck để bắt sớm; nếu discord.js chưa hỗ trợ trọn vẹn, tool trả hướng dẫn thủ công thay vì cố gọi sai.
- **Bật Community là đổi cài đặt server** → có `dryRun`, và chỉ chạy khi người dùng gọi (MCP client duyệt tool). Không tự bật kèm thao tác khác.
- **Ràng buộc ≥7/≥5 phụ thuộc trạng thái kênh thời điểm gọi** → kiểm ngay trước khi gọi API để giảm sai lệch.
- **audit heuristics theo tên** có thể bỏ sót/nhận nhầm → nêu rõ là gợi ý; không tự sửa.

## Open Questions

- `enable_community` có nên tự chọn rules/updates channel nếu người dùng không cung cấp (ví dụ tạo mới)? (đề xuất: không tự tạo; yêu cầu cung cấp id để minh bạch)
- `configure_onboarding` nhận prompt theo tên kênh/role hay theo id? (đề xuất: theo id để khớp API; có thể thêm lớp tiện ích tra tên sau)
- `generate_handoff` trả text hay cũng ghi file? (đề xuất: trả text; ghi file để người dùng/AI quyết định)
