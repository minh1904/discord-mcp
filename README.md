# Discord MCP

MCP server để tùy chỉnh & khảo sát server Discord, hướng tới vai một **chuyên gia setup Discord**. Hiện đã có **P1 — nền tảng + tool đọc** và **P2 — tool ghi cấu trúc** (role/channel/permission). Phase sau bổ sung lớp blueprint/tư vấn (P3+). Xem lộ trình trong [`openspec/changes/project-roadmap`](openspec/changes/project-roadmap) và tài liệu nền trong [`docs/`](docs/00-tong-quan.md).

- **Stack:** TypeScript + [discord.js](https://discord.js.org) + [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol) (transport stdio).
- **Runtime & package manager:** [Bun](https://bun.sh) ≥ 1.1 (chạy TypeScript trực tiếp, không cần build; tự nạp `.env`).

## Tool hiện có (P1, read-only)

| Tool                      | Chức năng                                                                   |
| ------------------------- | --------------------------------------------------------------------------- |
| `get_server_overview`     | Tên, số thành viên, features, verification level, đếm role/category/channel |
| `list_roles`              | Danh sách role: tên, màu, position, hoist, quyền — theo phân cấp            |
| `list_channels`           | Category + kênh con, loại kênh, quan hệ cha–con                             |
| `get_channel_permissions` | Permission overwrite của một kênh (role/member, allow/deny)                 |
| `ping`                    | Trạng thái kết nối bot                                                      |

## Tool ghi (P2, write — mọi tool có `dryRun` để xem trước)

| Nhóm             | Tool                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Role             | `create_role`, `edit_role`, `delete_role`, `reorder_role`, `assign_role`, `remove_role`                           |
| Category/Channel | `create_category`, `create_channel`, `edit_channel`, `move_channel`, `delete_channel`, `sync_channel_to_category` |
| Permission       | `set_channel_permission`, `remove_channel_permission`                                                             |

An toàn ghi: mọi tool ghi nhận `dryRun: true` để trả về thay đổi dự kiến mà không thực thi; thao tác role bị chặn nếu role đích không thấp hơn role cao nhất của bot (lỗi `role_hierarchy`).

## 1. Tạo Discord application & bot

1. Vào **Discord Developer Portal** → **New Application**.
2. Tab **Bot** → **Reset Token** → copy token (giữ bí mật, đây là `DISCORD_TOKEN`).
3. Trong tab **Bot**, bật **Privileged Gateway Intents**:
   - **Server Members Intent**
   - **Message Content Intent**
   > Bắt buộc, nếu không bot sẽ đăng nhập lỗi (server này khởi tạo client với các intent đó).

## 2. Mời bot vào server (toàn quyền)

Theo thiết kế P1, bot vận hành được cấp **Administrator** cho tốc độ phát triển. Tạo OAuth2 invite URL:

```
https://discord.com/api/oauth2/authorize?client_id=<APPLICATION_ID>&permissions=8&scope=bot%20applications.commands
```

- `<APPLICATION_ID>`: lấy ở tab **General Information**.
- `permissions=8` = Administrator.

Mở URL, chọn server của bạn để thêm bot.

> ⚠️ Administrator là bề mặt rủi ro lớn nếu token lộ. Đây là lựa chọn có chủ đích cho giai đoạn dev; có thể siết quyền ở P4 (audit). Không commit token.

## 3. Cấu hình môi trường

```bash
cp .env.example .env
```

Điền vào `.env`:

```
DISCORD_TOKEN=your-bot-token-here
DISCORD_GUILD_ID=            # tùy chọn: guild mặc định để tool bỏ qua tham số guildId
LOG_LEVEL=info               # debug | info | warn | error
```

## 4. Cài đặt

```bash
bun install
```

Kiểm tra chất lượng:

```bash
bun run typecheck   # tsc --noEmit
bun run lint
bun run format:check
```

Build (tùy chọn — chỉ cần khi muốn một file bundle chạy bằng Node):

```bash
bun run build       # bun build → dist/index.js (target node)
```

## 5. Chạy

```bash
bun run dev         # chạy từ src, tự reload khi đổi file (--watch)
# hoặc
bun start           # chạy từ src (bun run src/index.ts)
```

Bun **tự nạp `.env`** ở thư mục hiện tại. Log đi ra **stderr** (stdout dành riêng cho giao thức MCP).

## 6. Cấu hình trong Claude Code

Thêm server vào cấu hình MCP của Claude Code (chạy thẳng source bằng Bun, không cần build):

```json
{
  "mcpServers": {
    "discord": {
      "command": "bun",
      "args": ["run", "D:/personal/discord-mcp/src/index.ts"],
      "env": {
        "DISCORD_TOKEN": "your-bot-token-here",
        "DISCORD_GUILD_ID": ""
      }
    }
  }
}
```

Sau khi thêm, khởi động lại Claude Code; các tool `get_server_overview`, `list_roles`, `list_channels`, `get_channel_permissions`, `ping` sẽ khả dụng.

> `env` truyền trực tiếp trong config vì cwd khi Claude Code khởi chạy có thể khác thư mục dự án (nên không chắc `.env` được nạp).

## Cấu trúc mã

```
src/
  index.ts              # entrypoint: nạp config, khởi động MCP + kết nối Discord
  config/               # schema env (zod) + loader
  discord/              # discord.js client (singleton) + helpers format
  server/               # bootstrap MCP server + helper thực thi tool
  tools/inspection/     # 5 tool read-only (P1)
  tools/structure/      # 14 tool ghi role/channel/permission (P2)
  lib/                  # logger (stderr), lỗi có cấu trúc
```
