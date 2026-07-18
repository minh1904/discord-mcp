## ADDED Requirements

### Requirement: Quét rủi ro phân quyền

Hệ thống SHALL cung cấp tool `audit_permissions` quét guild và trả về danh sách rủi ro có phân loại mức độ, tối thiểu gồm: role/bot có quyền Administrator; kênh có tên gợi ý staff/nội bộ nhưng `@everyone` vẫn thấy được; kênh announcement mà `@everyone` gửi được; role của bot đặt thấp gây hạn chế quản lý. Tool SHALL chỉ đọc.

#### Scenario: Phát hiện Administrator
- **WHEN** guild có một role (không phải role mặc định) mang quyền Administrator và client gọi `audit_permissions`
- **THEN** báo cáo liệt kê role đó như một rủi ro kèm mức độ và mô tả

#### Scenario: Phát hiện kênh staff bị lộ
- **WHEN** guild có kênh tên gợi ý nội bộ (ví dụ chứa "mod" hoặc "staff") mà `@everyone` vẫn có quyền xem
- **THEN** báo cáo liệt kê kênh đó như một rủi ro cần khóa quyền xem

#### Scenario: Guild sạch rủi ro
- **WHEN** client gọi `audit_permissions` trên guild không có rủi ro nào theo tiêu chí
- **THEN** tool trả về danh sách rủi ro rỗng, không gây lỗi

### Requirement: Soi khả năng truy cập theo role/member (view_as)

Hệ thống SHALL cung cấp tool `view_as` nhận một role hoặc member và trả về danh sách kênh mà đối tượng đó **thấy được** và **không thấy được**. Tool SHALL chỉ đọc.

#### Scenario: Xem kênh theo góc nhìn một role
- **WHEN** client gọi `view_as` với một role hợp lệ
- **THEN** tool trả về hai danh sách kênh (thấy được / không thấy được) theo quyền ViewChannel hiệu lực của role đó

#### Scenario: Đối tượng không tồn tại
- **WHEN** client gọi `view_as` với id không phải role cũng không phải member trong guild
- **THEN** tool trả về lỗi có cấu trúc nêu rõ không tìm thấy đối tượng
