## ADDED Requirements

### Requirement: MCP server bootstrap qua stdio

Hệ thống SHALL khởi tạo một MCP server dùng `@modelcontextprotocol/sdk`, giao tiếp qua transport stdio, và đăng ký các tool khả dụng để client (Claude Code) gọi được. Server SHALL công bố danh sách tool kèm mô tả và schema tham số.

#### Scenario: Client kết nối và liệt kê tool
- **WHEN** một MCP client kết nối tới server qua stdio và yêu cầu danh sách tool
- **THEN** server trả về danh sách tool đã đăng ký, mỗi tool có tên, mô tả và JSON schema tham số hợp lệ

#### Scenario: Gọi tool không tồn tại
- **WHEN** client gọi một tool không được đăng ký
- **THEN** server trả về lỗi có cấu trúc (không crash) nêu rõ tool không tồn tại

### Requirement: Nạp và kiểm chứng cấu hình

Hệ thống SHALL nạp cấu hình từ biến môi trường và kiểm chứng bằng schema trước khi khởi động. Nếu thiếu hoặc sai cấu hình bắt buộc (vd `DISCORD_TOKEN`), server SHALL dừng khởi động với thông báo lỗi rõ ràng, và SHALL KHÔNG in giá trị bí mật ra log.

#### Scenario: Thiếu token bắt buộc
- **WHEN** khởi động server mà không có `DISCORD_TOKEN`
- **THEN** server dừng lại với thông báo nêu rõ biến môi trường còn thiếu, không in giá trị nào của biến bí mật

#### Scenario: Cấu hình hợp lệ
- **WHEN** khởi động với đầy đủ biến môi trường hợp lệ
- **THEN** cấu hình được kiểm chứng thành công và server tiếp tục khởi động

### Requirement: Error handling và logging nhất quán

Mọi tool SHALL trả về lỗi ở dạng có cấu trúc, thân thiện với AI (thông điệp rõ, không lộ secret/stack trace nhạy cảm) thay vì ném lỗi làm sập server. Hệ thống SHALL ghi log có cấu trúc cho các sự kiện chính (khởi động, gọi tool, lỗi) qua kênh không lẫn với giao thức stdio.

#### Scenario: Tool gặp lỗi khi thực thi
- **WHEN** một tool gặp lỗi trong lúc xử lý (vd lỗi mạng, thiếu quyền)
- **THEN** tool trả về kết quả lỗi có cấu trúc mô tả nguyên nhân và server vẫn tiếp tục phục vụ các request khác

#### Scenario: Log không phá vỡ giao thức stdio
- **WHEN** server ghi log trong lúc chạy với transport stdio
- **THEN** log được ghi ra kênh riêng (vd stderr) và không làm hỏng luồng thông điệp MCP trên stdout

### Requirement: Chuẩn convention của dự án

Mã nguồn SHALL tuân theo bộ convention thống nhất: TypeScript ở chế độ strict, lint và format tự động, cấu trúc thư mục phân lớp tách biệt (bootstrap, cấu hình, kết nối Discord, tool). Tham số tool SHALL được định nghĩa và kiểm chứng bằng schema.

#### Scenario: Kiểm tra chất lượng mã
- **WHEN** chạy lệnh build/lint/typecheck của dự án
- **THEN** mã nguồn biên dịch ở chế độ strict và vượt qua lint mà không có lỗi

#### Scenario: Tham số tool được kiểm chứng
- **WHEN** client gọi một tool với tham số sai kiểu hoặc thiếu trường bắt buộc
- **THEN** tool từ chối với lỗi kiểm chứng rõ ràng trước khi thực hiện bất kỳ thao tác nào
