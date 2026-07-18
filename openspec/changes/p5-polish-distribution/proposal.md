## Why

P1–P4 đã cho MCP trọn vòng "chuyên gia": đọc → dựng → tư vấn/dựng-khung → onboarding/audit/bàn giao (31 tool). P5 hoàn thiện để **dùng được rộng và tin cậy**: chạy được dưới dạng service (HTTP), phủ đủ **6 loại server** trong thư viện blueprint, có **test tự động** bảo vệ logic lõi, và **đóng gói** để người ngoài cài được.

## What Changes

- Thêm **transport HTTP streamable** (song song stdio) chọn qua cấu hình, để deploy dạng service; giữ stdio làm mặc định.
- Mở rộng thư viện blueprint từ 2 → **6**: bổ sung `community` (cộng đồng lớn), `crypto` (crypto/NFT/Web3), `creator` (creator/streamer), `business` (SaaS/support) — từ [docs/02](../../../docs/02-nhu-cau-theo-loai-server.md).
- Thêm **bộ test tự động** (bun test) cho logic thuần: recommend, diff/plan blueprint, validate blueprint, load config, quy tắc audit.
- **Đóng gói & tài liệu phân phối**: script `test`, README hoàn chỉnh (mọi tool + hướng dẫn HTTP), bin/chạy được ngoài repo.

## Capabilities

### New Capabilities
- `http-transport`: Chạy MCP server qua HTTP streamable (chọn transport qua cấu hình), song song với stdio.
- `blueprint-expansion`: Bổ sung blueprint cho community, crypto/NFT, creator, business để thư viện phủ đủ 6 loại server.
- `test-suite`: Bộ test tự động (bun test) phủ logic thuần cốt lõi.
- `distribution`: Đóng gói & tài liệu để cài/chạy được bởi người ngoài.

### Modified Capabilities
<!-- Không sửa requirement của capability đang tồn tại; việc mở rộng blueprint là ADDED qua `blueprint-expansion`. -->

## Impact

- **Code mới:** `src/server/httpTransport.ts` (hoặc mở rộng entrypoint); `src/blueprints/{community,crypto,creator,business}.ts`; thư mục test `*.test.ts`.
- **Config:** thêm `MCP_TRANSPORT` (stdio|http) và `MCP_HTTP_PORT` vào schema env.
- **Scripts:** thêm `test` (bun test) vào package.json.
- **Ngoài phạm vi:** không đổi hành vi tool hiện có; không thêm tính năng tư vấn mới ngoài blueprint dữ liệu.
