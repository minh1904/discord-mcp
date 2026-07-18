## Why

P1 (đọc) và P2 (ghi cấu trúc) đã cho MCP đủ "bàn tay". P3 thêm lớp **"bộ não"** — phần khác biệt cốt lõi so với mọi Discord MCP hiện có (đều là wrapper API không có ý kiến): nhận diện loại server, đề xuất **blueprint** phù hợp, và dựng nguyên khung server từ blueprint đã duyệt. Đây là lúc tri thức chuyên gia trong `docs/` (blueprint 6 loại, quy trình tư vấn) được biến thành dữ liệu + công cụ dùng được.

## What Changes

- Thêm **thư viện blueprint dạng dữ liệu** (typed), khởi đầu với 2 blueprint mẫu: **game** và **giáo dục** (từ [docs/02](../../../docs/02-nhu-cau-theo-loai-server.md)). Mỗi blueprint mô tả roles, categories/channels, bot đề xuất, ghi chú bảo mật, gợi ý onboarding.
- Thêm tool **liệt kê/lấy blueprint** và tool **đề xuất blueprint** (`recommend_blueprint`) từ mục đích + quy mô + nhóm thành viên, kèm bộ **câu hỏi khám phá** (từ [docs/04](../../../docs/04-quy-trinh-tu-van.md)).
- Thêm tool **`propose_changes`**: so blueprint với hiện trạng guild → kế hoạch thay đổi (không thực thi).
- Thêm tool **`apply_blueprint`**: dựng phần còn thiếu (categories → channels → roles → overwrites) một cách **idempotent**, hỗ trợ `dryRun`, **gọi lại lớp "bàn tay" P2** (không gọi thẳng Discord API).
- **Tách lõi thao tác ghi của P2 thành service functions** dùng chung, để cả tool P2 lẫn `apply_blueprint` cùng gọi (một điểm kiểm soát quyền/rate limit). Đây là refactor nội bộ, không đổi hành vi tool P2.

## Capabilities

### New Capabilities
- `blueprint-library`: Mô hình dữ liệu blueprint + các blueprint mẫu (game, giáo dục); tool liệt kê và lấy blueprint.
- `server-advisor`: Nhận diện loại server và đề xuất blueprint từ đầu vào khám phá; cung cấp bộ câu hỏi khám phá.
- `blueprint-apply`: So sánh blueprint với hiện trạng (`propose_changes`) và dựng phần còn thiếu (`apply_blueprint`) idempotent, có `dryRun`, qua lớp bàn tay P2.

### Modified Capabilities
<!-- Không đổi requirement của mcp-foundation / discord-inspection / role|channel|permission-management (chỉ refactor nội bộ P2 thành service, hành vi tool giữ nguyên). -->

## Impact

- **Code mới:** `src/blueprints/` (schema + dữ liệu game/education + matcher), `src/tools/blueprint/` (list/get/recommend/propose/apply), và `src/discord/structureOps.ts` (service functions tách từ P2).
- **Refactor P2:** tool trong `src/tools/structure/` gọi service functions thay vì chứa lõi logic; giữ nguyên tên tool, tham số, hành vi.
- **Ngoài phạm vi (để P4):** cấu hình Community/Onboarding thật (blueprint chỉ mang dữ liệu onboarding để P4 dùng); audit least-privilege.
- **An toàn:** `apply_blueprint` mặc định trình kế hoạch; `dryRun` xem trước; idempotent để chạy lại an toàn.
