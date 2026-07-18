## ADDED Requirements

### Requirement: Sinh tài liệu bàn giao

Hệ thống SHALL cung cấp tool `generate_handoff` sinh tài liệu bàn giao dạng Markdown từ cấu trúc guild hiện tại, gồm: cây role (theo phân cấp, có ghi chú quyền chính), sơ đồ category/kênh, và tóm tắt cấu hình. Tool SHALL chỉ đọc.

#### Scenario: Sinh tài liệu từ guild
- **WHEN** client gọi `generate_handoff` cho một guild
- **THEN** tool trả về một tài liệu Markdown mô tả role và cấu trúc kênh của guild, không thay đổi gì

### Requirement: Bổ sung khuyến nghị từ blueprint

Khi được cung cấp một blueprint id, `generate_handoff` SHALL bổ sung vào tài liệu phần bot đề xuất và ghi chú bảo mật của blueprint đó.

#### Scenario: Kèm blueprint
- **WHEN** client gọi `generate_handoff` với một blueprint id hợp lệ
- **THEN** tài liệu bàn giao bao gồm thêm danh sách bot đề xuất và ghi chú bảo mật của blueprint

#### Scenario: Blueprint id không tồn tại
- **WHEN** client gọi `generate_handoff` với một blueprint id không có trong thư viện
- **THEN** tool trả về lỗi có cấu trúc nêu rõ không tìm thấy blueprint, không sinh tài liệu sai
