## Why

Giai đoạn discovery đã xong (bộ `docs/` 00–06): đã chốt persona chuyên gia, blueprint 6 loại server, tri thức chuyên gia, khảo sát MCP đối thủ và giới hạn Discord API, và stack (TypeScript + discord.js). Trước khi viết code, cần một **roadmap chia phase lớn** làm khung thống nhất: xác định thứ tự xây, ranh giới mỗi phase và tiêu chí "xong" (exit criteria) để mỗi phase giao được giá trị dùng được và giảm rủi ro.

## What Changes

- Thiết lập **lộ trình 5 phase lớn** (P0 đã hoàn tất là discovery) cho Discord MCP, mỗi phase có mục tiêu, phạm vi, đầu ra và tiêu chí hoàn thành rõ ràng.
- Chốt **nguyên tắc phân lớp**: "bàn tay" (tool discord.js gọi API) xây trước, "bộ não" (blueprint + tư vấn) xếp lên trên — khác biệt với các MCP wrapper thuần hiện có.
- Chốt **an toàn theo mặc định**: least-privilege, không dùng Administrator, apply-cần-duyệt là ràng buộc xuyên suốt mọi phase, không phải tính năng thêm sau.
- Đây là change **lập kế hoạch**: đầu ra là roadmap (spec + design + tasks ở mức phase). Từng phase sẽ được đề xuất/triển khai bằng các change OpenSpec riêng về sau.

## Capabilities

### New Capabilities
- `delivery-roadmap`: Lộ trình phân phối theo phase cho Discord MCP — định nghĩa các phase lớn, phạm vi từng phase, sự phụ thuộc giữa các phase, và tiêu chí hoàn thành (gate) để chuyển phase.

### Modified Capabilities
<!-- Không có capability nào đang tồn tại thay đổi requirement. -->

## Impact

- **Tài liệu:** bổ sung `openspec/changes/project-roadmap/*` làm nguồn sự thật cho kế hoạch; liên kết với `docs/` sẵn có (đặc biệt [05-dinh-huong-mcp.md](../../../docs/05-dinh-huong-mcp.md) và [06-khao-sat-mcp-va-api.md](../../../docs/06-khao-sat-mcp-va-api.md)).
- **Code:** chưa đụng code trong change này; nó định khung cho các change triển khai tiếp theo (P1→P5).
- **Quyết định còn mở (không chặn roadmap, sẽ chốt khi vào phase):** phạm vi v1 (read-only trước hay apply luôn), blueprint làm trước, chi tiết cấu hình bot token/intents.
