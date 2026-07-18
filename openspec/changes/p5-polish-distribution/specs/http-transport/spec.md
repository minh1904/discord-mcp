## ADDED Requirements

### Requirement: Chọn transport qua cấu hình

Hệ thống SHALL cho phép chọn transport qua cấu hình môi trường: `stdio` (mặc định) hoặc `http`. Khi không cấu hình, hệ thống SHALL dùng stdio để giữ tương thích với hành vi hiện tại.

#### Scenario: Mặc định là stdio
- **WHEN** khởi động server không đặt biến chọn transport
- **THEN** server chạy với transport stdio như trước

#### Scenario: Chọn HTTP qua cấu hình
- **WHEN** khởi động server với cấu hình chọn transport HTTP và một cổng hợp lệ
- **THEN** server lắng nghe HTTP ở cổng đó và phục vụ giao thức MCP qua HTTP

### Requirement: Phục vụ MCP qua HTTP streamable

Khi ở chế độ HTTP, hệ thống SHALL phục vụ giao thức MCP qua HTTP streamable, để một MCP client kết nối HTTP có thể liệt kê và gọi tool như qua stdio.

#### Scenario: Client HTTP gọi được tool
- **WHEN** một MCP client kết nối tới endpoint HTTP và liệt kê tool
- **THEN** server trả về cùng tập tool như chế độ stdio và cho phép gọi tool

#### Scenario: Cấu hình HTTP thiếu/sai cổng
- **WHEN** chọn transport HTTP nhưng cổng thiếu hoặc không hợp lệ
- **THEN** server dừng khởi động với thông báo lỗi rõ ràng, không chạy ở trạng thái nửa vời
