## ADDED Requirements

### Requirement: Tài liệu cài đặt và cấu hình đầy đủ

README SHALL mô tả đủ để người ngoài cài và chạy được: yêu cầu, cài đặt, tạo bot & quyền, biến môi trường (gồm chọn transport stdio/http), cách chạy, và cấu hình trong MCP client. README SHALL liệt kê mọi tool hiện có theo nhóm.

#### Scenario: Người mới cài theo README
- **WHEN** một người chưa biết dự án làm theo README từ đầu
- **THEN** họ cài được phụ thuộc, cấu hình được token/transport, và chạy được server (stdio hoặc http) mà không cần thông tin ngoài README

### Requirement: Đóng gói chạy được

Dự án SHALL có entrypoint và cấu hình `package.json` (bin/scripts) để chạy được server bằng một lệnh, và build ra artifact chạy được. Việc build SHALL không có lỗi.

#### Scenario: Build sạch
- **WHEN** chạy lệnh build của dự án
- **THEN** build hoàn tất không lỗi và tạo ra artifact chạy được

#### Scenario: Chạy bằng một lệnh
- **WHEN** chạy script start của dự án với cấu hình hợp lệ
- **THEN** server khởi động và sẵn sàng phục vụ MCP
