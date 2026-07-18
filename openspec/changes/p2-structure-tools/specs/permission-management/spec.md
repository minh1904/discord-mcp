## ADDED Requirements

### Requirement: Upsert permission overwrite

Hệ thống SHALL cung cấp tool thêm mới hoặc cập nhật (upsert) permission overwrite cho một role hoặc member trên một channel, với tập quyền allow và deny chỉ định. Nếu overwrite cho đối tượng đó đã tồn tại, tool SHALL cập nhật thay vì tạo trùng.

#### Scenario: Tạo overwrite cho role
- **WHEN** client gọi tool upsert overwrite cho một role trên một channel với allow/deny chỉ định
- **THEN** overwrite được áp lên channel cho role đó và tool trả về trạng thái allow/deny sau khi áp

#### Scenario: Cập nhật overwrite đã tồn tại
- **WHEN** client gọi tool upsert overwrite cho một đối tượng đã có overwrite trên channel
- **THEN** overwrite hiện có được cập nhật (không tạo bản trùng) và tool trả về trạng thái mới

### Requirement: Xóa permission overwrite

Hệ thống SHALL cung cấp tool xóa permission overwrite của một role hoặc member trên một channel.

#### Scenario: Xóa overwrite
- **WHEN** client gọi tool xóa overwrite của một đối tượng đang có overwrite trên channel
- **THEN** overwrite bị gỡ khỏi channel và tool trả về xác nhận

#### Scenario: Xóa overwrite không tồn tại
- **WHEN** client gọi tool xóa overwrite của một đối tượng không có overwrite nào trên channel
- **THEN** tool trả về kết quả nêu rõ không có gì để xóa, không gây lỗi làm sập server
