# Discord MCP — Tổng quan dự án

> **Mục tiêu:** Xây dựng một MCP server giúp tùy chỉnh server Discord, được "nhồi" tri thức của một **chuyên gia thiết kế / setup server Discord** (Discord server architect / consultant). MCP không chỉ gọi API để tạo kênh, role... mà còn *biết* một server phục vụ mục đích gì thì cần cấu trúc như thế nào.

Đây là bộ tài liệu **giai đoạn hiểu yêu cầu** (discovery). Việc code MCP sẽ làm sau, dựa trên những gì chốt ở đây.

## Nguyên tắc định hướng

1. **Chuyên gia trước, công cụ sau.** Giá trị cốt lõi không nằm ở việc "gọi được API Discord", mà ở chỗ MCP đóng vai một người tư vấn: hỏi đúng câu, hiểu đúng loại cộng đồng, và đề xuất blueprint phù hợp trước khi đụng vào việc tạo kênh.
2. **Có ý kiến (opinionated), nhưng có lý do.** Mỗi đề xuất (role gì, kênh gì, quyền gì) đều gắn với một nhu cầu cụ thể của loại server, không phải "tạo cho có".
3. **An toàn theo mặc định.** Least-privilege về permission, chống raid, tách kênh staff — là mặc định chứ không phải tùy chọn.

## Mục lục tài liệu

| File | Nội dung |
|------|----------|
| [01-chan-dung-khach-hang.md](01-chan-dung-khach-hang.md) | Chân dung khách hàng: cả người dùng MCP (chuyên gia setup) lẫn tệp khách hàng cuối họ phục vụ |
| [02-nhu-cau-theo-loai-server.md](02-nhu-cau-theo-loai-server.md) | Nhu cầu chi tiết theo từng loại server (game, học tập, cộng đồng, crypto/NFT, creator, business) |
| [03-kien-thuc-chuyen-gia.md](03-kien-thuc-chuyen-gia.md) | Kho tri thức chuyên gia: role, kênh, permission, bot, onboarding, bảo mật |
| [04-quy-trinh-tu-van.md](04-quy-trinh-tu-van.md) | Quy trình tư vấn & bộ câu hỏi khám phá nhu cầu (discovery) |
| [05-dinh-huong-mcp.md](05-dinh-huong-mcp.md) | Ánh xạ tri thức sang tính năng MCP (định hướng, chưa code) |
| [06-khao-sat-mcp-va-api.md](06-khao-sat-mcp-va-api.md) | Khảo sát các Discord MCP có sẵn + năng lực/giới hạn Discord API (tham khảo để lên plan) |

## Phạm vi giai đoạn này

- ✅ Xác định chân dung khách hàng & nhu cầu.
- ✅ Chuẩn hóa tri thức chuyên gia thành tài liệu.
- ✅ Định hướng MCP sẽ có những "skill" / tool gì.
- ❌ Chưa code MCP server.
- ❌ Chưa chọn stack cụ thể (bàn ở bước sau).

## Nguồn tham khảo chính

Tổng hợp từ tài liệu chính thức của Discord, các nền tảng freelance (Fiverr, Contra, Freelancer), blog cộng đồng về setup server, và tài liệu Discord Developer về permission. Xem danh sách nguồn ở cuối [03-kien-thuc-chuyen-gia.md](03-kien-thuc-chuyen-gia.md).
