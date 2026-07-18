## 1. HTTP transport

- [x] 1.1 Thêm `MCP_TRANSPORT` (stdio|http, mặc định stdio) + `MCP_HTTP_PORT` vào schema env (zod) và AppConfig
- [x] 1.2 `src/server/httpTransport.ts`: HTTP server Node + `StreamableHTTPServerTransport` (SDK), kết nối `createServer(config)` (stateless/request)
- [x] 1.3 Entrypoint rẽ nhánh theo transport; http thiếu/sai port → dừng với lỗi rõ (kiểm trong loadConfig)
- [x] 1.4 Giữ stdio là mặc định (không đổi hành vi hiện tại)

## 2. Mở rộng blueprint (đủ 6 loại)

- [x] 2.1 `src/blueprints/community.ts` (cộng đồng lớn: verify, forum theo chủ đề, mod tooling)
- [x] 2.2 `src/blueprints/crypto.ts` (crypto/NFT/Web3: verify ví, holder-gated, price-alerts, governance)
- [x] 2.3 `src/blueprints/creator.ts` (creator/streamer: thông báo live/upload, role theo tier, kênh độc quyền)
- [x] 2.4 `src/blueprints/business.ts` (SaaS/support: ticket, feedback/bug, kênh nội bộ)
- [x] 2.5 Đăng ký 4 blueprint mới trong `blueprints/index.ts`; matchKeywords phân biệt

## 3. Test tự động

- [x] 3.1 Test `recommendBlueprints`: game/education + 4 loại mới (rõ) và mục đích mơ hồ
- [x] 3.2 Test blueprint: `listBlueprints` đủ 6 + mọi blueprint qua `assertValidBlueprint`
- [x] 3.3 Test `loadConfig`: thiếu token → ném; hợp lệ → parse đúng (guildId/transport)
- [x] 3.4 Test `channelTypeName` ánh xạ đúng
- [x] 3.5 Thêm script `"test": "bun test"`; `bun test` chạy xanh (13 pass) không cần Discord

## 4. Đóng gói & tài liệu

- [x] 4.1 README: mục HTTP transport (env, cách chạy) + bảng đầy đủ tool theo nhóm
- [x] 4.2 `.env.example`: thêm `MCP_TRANSPORT`, `MCP_HTTP_PORT`
- [x] 4.3 Đảm bảo `bun run build` sạch và `bun start` chạy được

## 5. Chất lượng & nghiệm thu

- [x] 5.1 `bun run typecheck` + `bun run lint` + `bun run format:check` + `bun test` sạch
- [x] 5.2 Smoke test giao thức: liệt kê blueprint đủ 6 (recommend crypto đúng); server khởi động cả stdio và **http** (client HTTP liệt kê được 31 tool)
