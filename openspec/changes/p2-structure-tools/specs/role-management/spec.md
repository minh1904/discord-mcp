## ADDED Requirements

### Requirement: Tạo role

Hệ thống SHALL cung cấp tool tạo một role mới trong guild với các thuộc tính tùy chọn: tên, màu, hoist, mentionable và tập quyền. Kết quả SHALL trả về role vừa tạo (id, name, position).

#### Scenario: Tạo role cơ bản
- **WHEN** client gọi tool tạo role với một tên hợp lệ
- **THEN** một role mới được tạo trong guild và tool trả về id, tên và vị trí của role đó

#### Scenario: Tạo role với quyền chỉ định
- **WHEN** client gọi tool tạo role kèm danh sách quyền
- **THEN** role được tạo với đúng tập quyền yêu cầu, và không quyền nào ngoài danh sách được thêm

### Requirement: Sửa role

Hệ thống SHALL cung cấp tool chỉnh sửa một role hiện có (tên, màu, hoist, mentionable, quyền). Tool SHALL chỉ thay đổi các trường được cung cấp và giữ nguyên các trường khác.

#### Scenario: Đổi tên và màu role
- **WHEN** client gọi tool sửa role với tên và màu mới
- **THEN** role được cập nhật tên và màu, các thuộc tính khác giữ nguyên

#### Scenario: Sửa role cao hơn bot
- **WHEN** client gọi tool sửa một role có vị trí cao hơn hoặc bằng role cao nhất của bot
- **THEN** tool từ chối với lỗi phân cấp có cấu trúc và không thực hiện thay đổi nào

### Requirement: Xóa role

Hệ thống SHALL cung cấp tool xóa một role. Tool SHALL từ chối nếu bot không đủ phân cấp để xóa role đó.

#### Scenario: Xóa role hợp lệ
- **WHEN** client gọi tool xóa một role thấp hơn role cao nhất của bot
- **THEN** role bị xóa khỏi guild và tool trả về xác nhận

### Requirement: Đổi vị trí role

Hệ thống SHALL cung cấp tool đặt lại vị trí (position) của một role trong cây phân cấp. Tool SHALL không cho phép đẩy role lên vị trí cao hơn role cao nhất của bot.

#### Scenario: Đổi vị trí role hợp lệ
- **WHEN** client gọi tool đổi vị trí một role tới một vị trí thấp hơn role cao nhất của bot
- **THEN** vị trí role được cập nhật và tool trả về thứ tự phân cấp mới của role đó

### Requirement: Gán và gỡ role cho thành viên

Hệ thống SHALL cung cấp tool gán một role cho thành viên và gỡ role khỏi thành viên. Tool SHALL từ chối nếu role cần gán cao hơn phân cấp của bot.

#### Scenario: Gán role cho thành viên
- **WHEN** client gọi tool gán một role (thấp hơn phân cấp bot) cho một thành viên hợp lệ
- **THEN** thành viên nhận role đó và tool trả về xác nhận

#### Scenario: Gỡ role khỏi thành viên
- **WHEN** client gọi tool gỡ một role đang có của thành viên
- **THEN** role bị gỡ khỏi thành viên và tool trả về xác nhận
