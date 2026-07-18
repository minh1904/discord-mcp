## Context

P1 đã dựng nền: MCP server (stdio), discord.js client singleton, helper `run/ok/fail`, và 5 tool read-only trong `src/tools/inspection/`. P2 thêm lớp "bàn tay" — tool ghi — vào `src/tools/structure/` (thư mục đã chừa sẵn), tái dùng toàn bộ hạ tầng P1.

Ràng buộc đã biết (từ [docs/06](../../../docs/06-khao-sat-mcp-va-api.md)): bot chỉ thao tác được role thấp hơn role cao nhất của bot; permission overwrite theo kênh + synced category; REST có rate limit. discord.js có **REST queue nội bộ tự tôn trọng rate limit**, nên phần lớn ta dựa vào đó thay vì tự xây limiter.

Nguyên tắc từ roadmap: an toàn theo mặc định, least-privilege đối với khuyến nghị sản phẩm. Bot vận hành đang có Administrator theo quyết định P1 (đủ `Manage Roles`/`Manage Channels`).

## Goals / Non-Goals

**Goals:**
- Bộ tool ghi đầy đủ cho role, category, channel, permission overwrite + reorder/move/sync.
- An toàn ghi dùng chung: `dryRun`, kiểm tra phân cấp role, kết quả có cấu trúc.
- Tái dùng helper P1; giữ cùng convention (zod input, lỗi có cấu trúc, log stderr).
- Chuẩn bị để P3 `apply_blueprint` gọi lại các tool này.

**Non-Goals:**
- Không có blueprint/tư vấn (P3).
- Không cấu hình Community/Onboarding (P4).
- Không tự cài bot bên thứ ba.
- Không xây interactive confirmation riêng — việc duyệt do MCP client đảm nhiệm (xem D3).

## Decisions

### D1: Đặt tool ghi trong `src/tools/structure/`, tái dùng `run/ok/fail`
- Mỗi domain một file: `roles.ts`, `channels.ts`, `categories.ts`, `permissions.ts`, cùng `index.ts` đăng ký. Aggregator `registerStructureTools(server, config)` gọi trong `server/index.ts`.
- Tool ghi mặc định `requireReady: true` như tool đọc.

### D2: `dryRun` là tham số chuẩn của mọi tool ghi
- Mỗi input schema có `dryRun: z.boolean().optional()`. Khi true, tool tính toán & trả về mô tả thay đổi dự kiến, **không gọi API ghi**.
- Giúp lớp bộ não (P3) và người dùng xem trước trước khi áp.

### D3: Xác nhận do MCP client đảm nhiệm; không tự prompt
- Trong stdio MCP không có kênh hỏi lại giữa chừng; MCP client (Claude Code) đã có cơ chế duyệt tool trước khi chạy. Ta không tái tạo confirmation, mà cung cấp `dryRun` + kết quả mô tả rõ để hỗ trợ quyết định.
- *Alternative*: tự xây luồng "propose→confirm" bằng 2 lần gọi tool → để dành cho P3 (`propose_changes` + `apply_blueprint`), không cần ở tầng tool nguyên thủy.

### D4: Guard phân cấp role tập trung
- Helper `assertManageableRole(guild, role)` so `role.position` với `guild.members.me.roles.highest.position`; ném `ToolError("role_hierarchy", ...)` nếu vi phạm. Dùng ở mọi thao tác role/gán role.
- Với permission overwrite theo role, cũng cân nhắc guard nếu role đích cao hơn bot (Discord có thể vẫn cho set overwrite, nhưng ta cảnh báo rõ).

### D5: Dựa vào REST queue của discord.js cho rate limit
- Không tự xây limiter phức tạp. Với thao tác hàng loạt (do P3 gọi), thực thi tuần tự bằng `await` từng bước để giữ thứ tự phụ thuộc (vd tạo category trước, rồi tạo channel con). discord.js tự chờ khi gặp 429.
- *Alternative*: hàng đợi/limiter riêng → chưa cần ở P2; thêm sau nếu đo được vấn đề.

### D6: Kết quả ghi mô tả thay đổi
- Trả về object gồm `action`, `target` (id/tên), và `after`/`planned` (trạng thái sau/dự kiến). Với `dryRun`, gắn cờ `dryRun: true` trong kết quả.

## Risks / Trade-offs

- **Thao tác role vượt phân cấp bot** → guard D4 chặn trước với lỗi rõ; test bằng scenario phân cấp.
- **Xóa category chứa channel con** → không xóa lan; nêu rõ hệ quả (child mất parent) trong kết quả, không tự xóa channel con.
- **Rate limit khi P3 apply hàng loạt** → dựa REST queue discord.js + thực thi tuần tự; ghi log khi gặp 429.
- **Loại channel không hợp lệ / thuộc tính sai loại** → validate bằng zod + kiểm tra loại trước khi gọi API, trả lỗi có cấu trúc.
- **`dryRun` lệch thực tế** → giữ mô tả dryRun bám sát tham số sẽ gửi API; không hứa hẹn quá mức (chỉ mô tả điều tool sẽ làm).

## Open Questions

- Có cần tool "bulk" ở P2 (vd tạo nhiều kênh một lần) hay để P3 lo việc lặp? (đề xuất: để P3 lặp qua tool nguyên thủy; P2 giữ tool đơn nhiệm)
- Guard phân cấp cho permission overwrite theo role: chặn cứng hay chỉ cảnh báo? (đề xuất: cảnh báo trong kết quả, không chặn, vì set overwrite khác sửa role)
- Có cần idempotency key/"tạo nếu chưa có" ở P2 không, hay để P3 xử lý khi diff blueprint? (đề xuất: để P3)
