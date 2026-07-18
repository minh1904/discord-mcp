## Why

Roadmap đã chốt P1 là nền tảng: dựng MCP server, kết nối bot Discord và cung cấp các tool đọc/chẩn đoán. Cần một bộ khung code **chuẩn convention/best practice** (TypeScript strict, cấu trúc module rõ, config có kiểm chứng, error handling & logging nhất quán) để mọi phase sau xây lên mà không phải refactor nền. Theo yêu cầu, **bot vận hành được cấp toàn bộ quyền** (Administrator + đầy đủ intents) nhằm tối đa tốc độ phát triển và tránh vướng quyền khi mở rộng sang phase ghi.

## What Changes

- Khởi tạo dự án Node/TypeScript với `@modelcontextprotocol/sdk` + `discord.js`, chạy MCP server qua transport **stdio**.
- Kết nối bot Discord bằng token qua biến môi trường; bot được mời với **Administrator + tất cả privileged intents** (`Guilds`, `GuildMembers`, `MessageContent`).
- Bộ **tool đọc/chẩn đoán (read-only)**: tổng quan server, liệt kê role, category, channel và permission overwrite.
- Chuẩn hoá **convention**: strict TS, ESLint + Prettier, validate env bằng zod, schema tool bằng zod, error handling tập trung, structured logging, cấu trúc thư mục phân lớp (tách sẵn "bàn tay" cho phase sau).
- Tài liệu setup: tạo Discord application/bot, lấy token, mời bot, cấu hình MCP trong Claude Code.

## Capabilities

### New Capabilities
- `mcp-foundation`: Bootstrap MCP server (đăng ký tool, transport stdio), nạp & kiểm chứng cấu hình, error handling và logging theo chuẩn dự án.
- `discord-inspection`: Kết nối bot Discord (full permissions + intents) và các tool read-only để đọc cấu trúc một guild (server overview, roles, channels/categories, permission overwrites).

### Modified Capabilities
<!-- Không thay đổi requirement của capability đang tồn tại. Nguyên tắc least-privilege trong `delivery-roadmap` áp dụng cho KHUYẾN NGHỊ hướng tới server khách hàng cuối, không phải mức quyền của bot vận hành do operator tự chọn — nên không mâu thuẫn. -->

## Impact

- **Code mới:** `package.json`, `tsconfig.json`, cấu hình lint/format, `src/` (entrypoint MCP, discord client, config, logger, tools read-only).
- **Cấu hình runtime:** biến môi trường `DISCORD_TOKEN`, tùy chọn `DISCORD_GUILD_ID`.
- **Bảo mật:** bot Administrator theo yêu cầu — quyết định có chủ đích cho giai đoạn phát triển; có thể siết lại ở P4 (audit). Token không commit; dùng `.env` + `.gitignore`.
- **Phase sau:** cấu trúc thư mục chừa sẵn lớp "bàn tay" (write tools) cho P2 và lớp "bộ não" cho P3.
