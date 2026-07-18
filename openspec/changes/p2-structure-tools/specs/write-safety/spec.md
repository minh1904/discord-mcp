## ADDED Requirements

### Requirement: Chế độ dryRun cho tool ghi

Mọi tool ghi (role, channel, category, permission) SHALL hỗ trợ tham số `dryRun`. Khi `dryRun` là true, tool SHALL KHÔNG thực hiện thay đổi nào lên guild mà chỉ trả về mô tả thay đổi dự kiến.

#### Scenario: Xem trước bằng dryRun
- **WHEN** client gọi một tool ghi với `dryRun: true`
- **THEN** không có thay đổi nào được áp lên guild và tool trả về mô tả rõ hành động dự kiến (đối tượng, trường thay đổi, giá trị mới)

#### Scenario: Thực thi khi không dryRun
- **WHEN** client gọi một tool ghi với `dryRun` là false hoặc bỏ trống
- **THEN** thay đổi được thực hiện thật và tool trả về kết quả phản ánh trạng thái sau thay đổi

### Requirement: Kiểm tra phân cấp role trước thao tác

Trước khi sửa/xóa/đổi vị trí role hoặc gán role, hệ thống SHALL kiểm tra rằng thao tác nằm trong phân cấp mà bot được phép (role đích thấp hơn role cao nhất của bot). Nếu không, tool SHALL từ chối với lỗi có cấu trúc và không thay đổi gì.

#### Scenario: Chặn thao tác vượt phân cấp
- **WHEN** một tool ghi cố thao tác trên role cao hơn hoặc bằng role cao nhất của bot
- **THEN** tool trả về lỗi phân cấp có cấu trúc (nêu rõ role đích và role bot) và không thực hiện thay đổi

### Requirement: Kết quả ghi có cấu trúc, mô tả thay đổi

Mọi tool ghi SHALL trả về kết quả có cấu trúc mô tả những gì đã (hoặc sẽ) thay đổi, đủ để người dùng/AI kiểm chứng. Lỗi khi thực thi SHALL trả về ở dạng lỗi có cấu trúc và SHALL KHÔNG làm sập server.

#### Scenario: Kết quả mô tả thay đổi
- **WHEN** một tool ghi hoàn tất thành công
- **THEN** kết quả nêu rõ đối tượng bị tác động và trạng thái sau thao tác

#### Scenario: Lỗi thực thi không làm sập server
- **WHEN** một tool ghi gặp lỗi (thiếu quyền, đối tượng không tồn tại, vi phạm ràng buộc Discord)
- **THEN** tool trả về lỗi có cấu trúc mô tả nguyên nhân và server vẫn phục vụ các request khác
