## Context

P1–P4 hoàn tất phần năng lực (31 tool). P5 là "làm cho tin cậy và dùng được rộng": HTTP transport, đủ 6 blueprint, test tự động, đóng gói. Tận dụng: `createServer(config)` đã tách khỏi transport (P1), thư viện blueprint dữ liệu (P3), Bun test runner có sẵn.

## Goals / Non-Goals

**Goals:**
- Chọn transport stdio (mặc định) / http qua cấu hình; HTTP dùng để deploy service.
- Đủ 6 blueprint, nhận diện được qua recommend.
- Bộ test `bun test` phủ logic thuần (không cần Discord).
- README + đóng gói để người ngoài chạy được.

**Non-Goals:**
- Không đổi hành vi 31 tool hiện có.
- Không thêm tính năng tư vấn mới ngoài dữ liệu blueprint.
- Không auth/multi-tenant cho HTTP ở P5 (chỉ transport cơ bản; bảo mật deploy để sau).

## Decisions

### D1: Transport chọn qua env, `createServer` tái dùng
- Thêm `MCP_TRANSPORT` (`stdio` | `http`, mặc định `stdio`) và `MCP_HTTP_PORT` vào schema env (zod). Entrypoint rẽ nhánh: stdio dùng `StdioServerTransport` như hiện tại; http dùng `StreamableHTTPServerTransport` (SDK) sau một HTTP server Node.
- `createServer(config)` không đổi — chỉ lớp transport khác. Xác thực class/đường import SDK bằng typecheck khi apply.
- *Alternative*: SSE cũ → loại, dùng streamable HTTP hiện hành.

### D2: HTTP tối giản, một phiên
- P5 làm HTTP ở mức đủ chạy: một endpoint MCP, khởi tạo transport và kết nối `server`. Chưa làm session-store phức tạp/đa client nâng cao (ghi rõ là cơ bản). Nếu cần theo phiên, dùng cơ chế session của SDK ở mức tối thiểu.
- Nếu `MCP_TRANSPORT=http` mà thiếu/सai `MCP_HTTP_PORT` → dừng với lỗi rõ (theo spec).

### D3: 4 blueprint mới theo cùng schema P3
- Thêm `community.ts`, `crypto.ts`, `creator.ts`, `business.ts` theo `Blueprint` interface, đăng ký trong `blueprints/index.ts`. Mỗi cái có `matchKeywords` để recommend nhận diện (crypto: "nft","crypto","web3","token","holder"; creator: "streamer","youtube","twitch","fan"; business: "saas","support","khách hàng","ticket"; community: "cộng đồng","community","public").
- Giữ đủ số kênh hợp lý để P4 onboarding không vướng ràng buộc.

### D4: Test bằng bun test cho logic thuần
- File `*.test.ts` cạnh mã hoặc trong `tests/`. Phủ: `recommendBlueprints` (rõ/mơ hồ, và các loại mới), `assertValidBlueprint`/`listBlueprints` (mọi blueprint hợp lệ, đủ 6), `loadConfig` (thiếu token → ném, hợp lệ → parse), `channelTypeName`.
- Chỉ logic thuần, không mock discord.js (tránh phức tạp). Tool cần guild để dành nghiệm thu thật.
- Thêm script `"test": "bun test"`.

### D5: Đóng gói
- README bổ sung mục HTTP + bảng đầy đủ tool (đã có phần lớn). `package.json` bin/scripts đã có; đảm bảo `build` (bun build) chạy sạch và `start` chạy được.

## Risks / Trade-offs

- **API HTTP transport của SDK có thể khác phiên bản** → xác thực bằng typecheck khi apply; nếu chữ ký khác, điều chỉnh theo SDK đã cài.
- **HTTP không auth** → nêu rõ chỉ dùng nội bộ/đằng sau proxy; bảo mật deploy ngoài phạm vi P5.
- **Blueprint mới nhiều → recommend chồng từ khóa** → chọn từ khóa phân biệt; test recommend cho từng loại để tránh nhầm.
- **bun test và ESM/TS** → Bun chạy TS trực tiếp nên test import mã nguồn `.ts` bình thường.

## Open Questions

- HTTP có cần hỗ trợ nhiều phiên đồng thời ngay ở P5 không? (đề xuất: không; làm cơ bản, mở rộng sau nếu cần)
- Có publish lên npm không, hay chỉ chạy từ source/GitHub? (đề xuất: chuẩn bị `package.json` publish-ready nhưng chưa bắt buộc publish)
