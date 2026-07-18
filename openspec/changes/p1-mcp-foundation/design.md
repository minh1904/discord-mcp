## Context

P1 là phase nền của Discord MCP (stack đã chốt: TypeScript + discord.js + `@modelcontextprotocol/sdk`). Mục tiêu là dựng khung code chuẩn best-practice và các tool đọc, để P2 (write) và P3 (blueprint) xây lên không phải refactor nền.

Quyết định của operator: **bot vận hành cấp Administrator + đầy đủ intents**. Nguyên tắc least-privilege trong roadmap (`delivery-roadmap`) áp cho **khuyến nghị mà sản phẩm đưa tới server khách hàng cuối**, còn mức quyền của chính bot vận hành là lựa chọn của operator — hai phạm vi khác nhau nên không mâu thuẫn.

Ràng buộc kỹ thuật liên quan (từ [docs/06](../../../docs/06-khao-sat-mcp-va-api.md)): stdout dành cho giao thức MCP nên log phải ra kênh khác; `GuildMembers`/`MessageContent` là privileged intent phải bật ở Developer Portal; thao tác trên guild bot đã tham gia.

## Goals / Non-Goals

**Goals:**
- Khung dự án TS strict, có lint/format/typecheck, cấu trúc thư mục phân lớp.
- MCP server chạy qua stdio, đăng ký tool có schema kiểm chứng.
- Kết nối bot discord.js ổn định, báo trạng thái/lỗi rõ ràng.
- Bộ tool read-only đủ để "nhìn thấy" toàn bộ cấu trúc guild.
- Config qua env có kiểm chứng; không lộ secret.

**Non-Goals:**
- Không có tool ghi (tạo/sửa/xóa) — để P2.
- Không có blueprint/tư vấn — để P3.
- Không HTTP transport — để P5.
- Không cài bot bên thứ ba.

## Decisions

### D1: Cấu trúc thư mục phân lớp, chừa chỗ cho phase sau
```
src/
  index.ts              # entrypoint: nạp config, khởi động server + client
  server/               # bootstrap MCP, đăng ký tool, transport stdio
  config/               # schema env (zod) + loader
  discord/              # khởi tạo & quản lý discord.js client
  tools/
    inspection/         # tool read-only của P1
    (structure/)        # chỗ dành cho write tools P2 — chưa tạo
  lib/                  # logger, helpers, kiểu dữ liệu chung
```
- *Vì sao*: tách `tools/inspection` khỏi `tools/structure` (P2) và lớp bộ não (P3) ngay từ đầu để không phải dời file sau.

### D2: Validate mọi input bằng zod; tool schema sinh từ zod
- Env và tham số tool đều qua zod → một kiểu kiểm chứng nhất quán, thông báo lỗi tốt cho AI, và có type an toàn.
- *Alternative*: kiểm tra thủ công → loại vì dễ sót và lệch giữa schema công bố và thực thi.

### D3: Logging ra stderr (không đụng stdout)
- Transport stdio dùng stdout cho JSON-RPC; logger phải ghi stderr (hoặc file) để không phá giao thức.
- *Vì sao*: lỗi kinh điển của MCP stdio là log lẫn vào stdout làm client parse hỏng.

### D4: discord.js client là singleton, khởi tạo một lần, chờ `ready` trước khi phục vụ tool
- Tool inspection chỉ chạy khi client đã `ready`; nếu chưa, trả lỗi có cấu trúc.
- Intents bật đủ (`Guilds`, `GuildMembers`, `MessageContent`) để P1 đọc được và phase sau không phải đổi.

### D5: Bot Administrator theo yêu cầu operator
- Mời bot bằng OAuth2 URL với `permissions=8` (Administrator) + scope `bot applications.commands`.
- Ghi rõ trong README đây là lựa chọn giai đoạn dev; audit/siết quyền để dành P4.

### D6: Tool đọc trả dữ liệu trực tiếp từ API, chưa cache
- P1 ưu tiên đơn giản & đúng; cache/persist là open question để cân nhắc ở phase sau nếu rate limit thành vấn đề.

## Risks / Trade-offs

- **Bot Administrator = bề mặt rủi ro lớn** nếu token lộ → Mitigation: token chỉ trong `.env` (đã gitignore), không in ra log, README cảnh báo; có thể siết ở P4.
- **Privileged intents chưa bật ở Developer Portal** → client báo lỗi khó hiểu → Mitigation: tài liệu setup hướng dẫn bật, và thông điệp lỗi kết nối chỉ rõ nguyên nhân intent.
- **Log lẫn stdout phá giao thức** → Mitigation: bắt buộc logger ghi stderr; thêm kiểm tra khi review.
- **Khác biệt nền tảng (Windows)** cho script build/dev → Mitigation: dùng script npm đa nền, tránh lệnh shell đặc thù.

## Migration Plan

Dự án mới, không có gì để migrate. Thứ tự triển khai: scaffold & convention → config → discord client → server/transport → tool inspection → tài liệu setup → nghiệm thu trên guild nháp.

## Open Questions

- Có nên thêm một tool "health/ping" để client kiểm tra trạng thái kết nối không? (nhẹ, có thể thêm)
- Guild mặc định qua `DISCORD_GUILD_ID`: bắt buộc hay để tool nhận guild id theo tham số? (đề xuất: optional, tham số ghi đè)
