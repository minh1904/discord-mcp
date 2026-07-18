## ADDED Requirements

### Requirement: Bộ câu hỏi khám phá

Hệ thống SHALL cung cấp tool trả về bộ câu hỏi khám phá nhu cầu (mục đích, đối tượng, quy mô, nhóm thành viên, tính năng...) để người tư vấn hỏi khách trước khi dựng server.

#### Scenario: Lấy câu hỏi khám phá
- **WHEN** client gọi tool lấy câu hỏi khám phá
- **THEN** tool trả về danh sách câu hỏi có nhóm, đủ để xác định loại server và quy mô

### Requirement: Đề xuất blueprint từ đầu vào khám phá

Hệ thống SHALL cung cấp tool `recommend_blueprint` nhận mô tả mục đích (bắt buộc) và các đầu vào tùy chọn (quy mô, nhóm thành viên) rồi trả về một hoặc nhiều blueprint phù hợp, xếp hạng, kèm **lý do** vì sao phù hợp.

#### Scenario: Đề xuất theo mục đích rõ ràng
- **WHEN** client gọi `recommend_blueprint` với mục đích thể hiện rõ loại server (ví dụ nhắc tới chơi game)
- **THEN** tool trả về blueprint đúng loại đó ở vị trí đầu, kèm lý do dựa trên từ khóa/loại server

#### Scenario: Mục đích mơ hồ
- **WHEN** client gọi `recommend_blueprint` với mục đích không đủ để xác định loại server
- **THEN** tool trả về các blueprint ứng viên kèm gợi ý những câu hỏi khám phá cần hỏi thêm, thay vì chọn bừa một blueprint
