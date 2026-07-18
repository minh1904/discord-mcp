## 1. Scaffold & convention

- [x] 1.1 Khởi tạo `package.json` (type: module), cài `@modelcontextprotocol/sdk`, `discord.js`, `zod`
- [x] 1.2 Cấu hình `tsconfig.json` ở chế độ strict (target/module hợp lý cho Node ESM)
- [x] 1.3 Thiết lập ESLint + Prettier + script `lint`/`format`/`typecheck`/`build`
- [x] 1.4 Tạo cấu trúc thư mục `src/{server,config,discord,tools/inspection,lib}` (chừa `tools/structure` cho P2)
- [x] 1.5 Thêm `.gitignore` (node_modules, dist, `.env`) và `.env.example`

## 2. Config & logging

- [x] 2.1 Định nghĩa schema env bằng zod (`DISCORD_TOKEN` bắt buộc, `DISCORD_GUILD_ID` optional)
- [x] 2.2 Loader config: kiểm chứng khi khởi động, dừng có thông báo rõ nếu thiếu/sai, không in secret
- [x] 2.3 Logger ghi ra stderr (không đụng stdout), có mức log và ngữ cảnh cơ bản

## 3. Kết nối Discord

- [x] 3.1 Khởi tạo discord.js client (intents: Guilds, GuildMembers, MessageContent) dạng singleton
- [x] 3.2 Đăng nhập bằng token, chờ sự kiện `ready`, phát trạng thái sẵn sàng
- [x] 3.3 Xử lý lỗi kết nối (token sai, intent chưa bật) với thông điệp rõ ràng
- [x] 3.4 Helper: lấy guild theo id/tham số, báo lỗi có cấu trúc nếu bot chưa ở trong guild

## 4. MCP server & transport

- [x] 4.1 Bootstrap MCP server, kết nối transport stdio
- [x] 4.2 Cơ chế đăng ký tool: tên + mô tả + schema zod → JSON schema công bố
- [x] 4.3 Wrapper thực thi tool: kiểm chứng input, bắt lỗi → trả kết quả lỗi có cấu trúc (không sập)
- [x] 4.4 Xử lý gọi tool không tồn tại: trả lỗi có cấu trúc

## 5. Tool read-only (inspection)

- [x] 5.1 `get_server_overview`: tên, số thành viên, features, đếm role/category/channel, verification level
- [x] 5.2 `list_roles`: tên, màu, position, hoist, quyền — sắp theo phân cấp
- [x] 5.3 `list_channels`: category + kênh con, loại kênh, quan hệ cha–con
- [x] 5.4 `get_channel_permissions`: overwrite theo role/member với allow/deny
- [x] 5.5 (tuỳ chọn) `ping`/health: kiểm tra trạng thái kết nối

## 6. Tài liệu & nghiệm thu

- [x] 6.1 README: tạo Discord application/bot, bật privileged intents, tạo OAuth2 invite URL (Administrator), lấy token
- [x] 6.2 Hướng dẫn cấu hình MCP server trong Claude Code (stdio) + `.env`
- [x] 6.3 Chạy build/lint/typecheck sạch lỗi
- [ ] 6.4 Nghiệm thu: chạy MCP thật, gọi 4 tool inspection trên một guild nháp và quan sát kết quả đúng cấu trúc
  - Đã kiểm chứng end-to-end phần giao thức: server khởi động qua stdio, liệt kê đúng 5 tool, `ping` trả `ready:false`, tool cần kết nối trả lỗi `not_ready` có cấu trúc, tool không tồn tại trả lỗi MCP `-32602`, và config thiếu token báo lỗi rõ (không lộ secret).
  - **Còn lại (cần token + guild thật của bạn):** chạy với `DISCORD_TOKEN` thật và quan sát dữ liệu guild thực từ 4 tool inspection.
