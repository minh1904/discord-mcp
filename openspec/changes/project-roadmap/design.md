## Context

Discord MCP đã qua P0 (discovery). Bộ `docs/` chốt: persona chuyên gia, blueprint 6 loại server, tri thức chuyên gia, khảo sát MCP đối thủ + giới hạn Discord API, và stack TypeScript + discord.js. Các MCP Discord hiện có đều là **wrapper API không có ý kiến** — chưa cái nào có lớp tư vấn/blueprint. Đó vừa là khoảng trống ta khai thác, vừa là nguồn tham chiếu tool taxonomy (SaseQ ~65 tool, aj-geddes 71 tool).

Ràng buộc kỹ thuật đã biết (chi tiết ở [docs/06](../../../docs/06-khao-sat-mcp-va-api.md)):
- Onboarding có qua API (`PUT /guilds/{id}/onboarding`) nhưng phải **bật Community trước** (2 bước) và cần **≥7 default channel / ≥5 cho @everyone gửi**.
- Role bot phải cao hơn role nó quản lý; REST có rate limit; thao tác trên **guild sẵn có** (không dựng guild mới 1-call).
- Intents: `Guilds` đủ cho quản trị cấu trúc; `GuildMembers` (privileged) khi thao tác theo member.

Tài liệu này giải thích cách chia phase và vì sao theo thứ tự đó. Chi tiết kỹ thuật từng phase sẽ nằm trong change riêng của phase khi triển khai.

## Goals / Non-Goals

**Goals:**
- Đưa ra khung 5 phase lớn (sau P0) với ranh giới, phụ thuộc và exit criteria rõ ràng.
- Xây theo trục rủi ro giảm dần: kết nối & đọc trước → ghi cấu trúc → lớp tư vấn → community/audit → hoàn thiện.
- Mỗi phase giao được giá trị kiểm chứng end-to-end.
- Neo các nguyên tắc xuyên suốt: phân lớp bàn tay/bộ não, an toàn theo mặc định.

**Non-Goals:**
- Không viết code trong change này.
- Không chốt chi tiết schema tool, tên hàm, hay chi tiết từng blueprint (để dành change của phase).
- Không dựng UI riêng; MCP hoạt động qua client (Claude Code) bằng slash/tool.
- Không tự cài bot bên thứ ba (MEE6, Collab.Land…) — đó là OAuth của user; MCP chỉ đề xuất/hướng dẫn.

## Decisions

### D1: Chia 5 phase theo trục "kết nối → ghi → tư vấn → community → hoàn thiện"
- **P1 read-only trước**: rủi ro thấp, xác lập được nền (auth bot, discord.js client, transport, khung tool, error handling) mà không nguy cơ làm hỏng server. Cho phép "audit/overview" có giá trị ngay.
- **P2 write tools**: xây "bàn tay" đầy đủ (role/category/channel/overwrite/reorder). Đây là nền mà lớp bộ não sẽ gọi lại.
- **P3 bộ não**: blueprint dạng dữ liệu (JSON/YAML) + recommend + discovery Q&A + `apply_blueprint` (gọi lớp bàn tay). Đây là điểm khác biệt cốt lõi.
- **P4 onboarding/community + audit**: tách riêng vì vướng ràng buộc 2 bước của Community API và cần logic audit least-privilege — không nên nhét vào P2/P3.
- **P5 hoàn thiện**: HTTP transport, thêm blueprint, test, đóng gói.
- *Alternative đã cân nhắc*: làm "apply blueprint" sớm ngay sau P1 → loại, vì thiếu lớp bàn tay chắc chắn thì apply dễ vỡ và khó kiểm soát quyền/rate limit.

### D2: Phân lớp bàn tay/bộ não trong cùng một codebase TS
- Một repo, hai module: `tools/` (discord.js wrappers) và `blueprints/` + `advisor/` (bộ não). Bộ não gọi tools nội bộ, không gọi thẳng API.
- *Vì sao*: một điểm kiểm soát quyền + rate limit + logging; dễ test lớp bàn tay độc lập; đúng tinh thần tái sử dụng.
- *Alternative*: hai package tách rời → loại ở giai đoạn đầu vì thêm chi phí vận hành không cần thiết.

### D3: Stdio trước, HTTP sau (P5)
- P1 dùng stdio (chạy local cùng Claude Code) cho vòng lặp phát triển nhanh; HTTP streamable để dành P5 khi cần deploy dạng service (theo pattern SaseQ/barryyip0625 hỗ trợ cả hai).

### D4: An toàn & xác nhận là ràng buộc, không phải tính năng
- "Apply cần duyệt" và least-privilege được nhúng vào thiết kế tool ghi ngay từ P2, không thêm sau. Audit chuyên sâu ở P4.

### D5: Guild sẵn có + cấu hình bot tối thiểu
- MCP thao tác trên guild người dùng đã có và đã mời bot với quyền tối thiểu. P1 kèm hướng dẫn tạo application/bot + scope/intents.

## Risks / Trade-offs

- **Ràng buộc Community/Onboarding API (2 bước, ≥7/≥5 kênh)** → tách hẳn thành P4 và để blueprint đảm bảo đủ default channel hợp lệ; có đường lui "hướng dẫn thủ công" nếu API từ chối.
- **Rate limit khi apply cả blueprint** → P2/P3 thiết kế thực thi tuần tự có hàng đợi, tôn trọng `Retry-After`; apply theo bước idempotent để retry an toàn.
- **Phân cấp role bot** (bot không sửa được role cao hơn) → tool ghi phải kiểm tra vị trí role và cảnh báo user kéo role bot lên trước khi apply.
- **Phạm vi bộ não phình to** (6 blueprint × nhiều biến thể) → P3 chỉ làm 1–2 blueprint mẫu trước, mở rộng ở P5; giữ blueprint là dữ liệu để thêm không cần đổi code.
- **Trôi phạm vi giữa các phase** → mỗi phase có exit criteria; tính năng ngoài phạm vi được đẩy sang change/phase sau thay vì nhồi vào.

## Open Questions

- Phạm vi v1 dừng ở đâu: P3 (apply blueprint) đã đủ "v1", hay cần cả P4?
- Blueprint nào làm mẫu trước ở P3 (game hay giáo dục)?
- Có cần persist state (cache guild structure) hay luôn đọc trực tiếp từ API?
- Chuẩn kiểm thử: test thật trên guild nháp vs mock discord.js tới mức nào?
