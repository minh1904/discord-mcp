## ADDED Requirements

### Requirement: Tạo category

Hệ thống SHALL cung cấp tool tạo một category trong guild với tên cho trước và vị trí tùy chọn. Kết quả SHALL trả về category vừa tạo (id, name, position).

#### Scenario: Tạo category
- **WHEN** client gọi tool tạo category với một tên hợp lệ
- **THEN** một category mới được tạo và tool trả về id, tên, vị trí của nó

### Requirement: Tạo channel

Hệ thống SHALL cung cấp tool tạo channel với loại chỉ định (text, voice, stage, forum, announcement) và tùy chọn gắn vào một category (parent). Với kênh không hợp lệ cho loại yêu cầu, tool SHALL báo lỗi có cấu trúc.

#### Scenario: Tạo text channel trong category
- **WHEN** client gọi tool tạo channel loại text kèm parent là một category hợp lệ
- **THEN** channel được tạo dưới category đó và tool trả về id, tên, loại, parent

#### Scenario: Tạo voice channel không có category
- **WHEN** client gọi tool tạo channel loại voice không kèm parent
- **THEN** channel voice được tạo ở cấp cao nhất và tool trả về thông tin channel

### Requirement: Sửa channel

Hệ thống SHALL cung cấp tool sửa thuộc tính của channel (tên, topic, nsfw, vị trí, và các thuộc tính hợp lệ theo loại). Tool SHALL chỉ đổi các trường được cung cấp.

#### Scenario: Đổi tên và topic channel
- **WHEN** client gọi tool sửa channel với tên và topic mới
- **THEN** channel được cập nhật đúng các trường đó, các trường khác giữ nguyên

### Requirement: Di chuyển channel

Hệ thống SHALL cung cấp tool di chuyển một channel: đổi category cha (parent) và/hoặc vị trí. Nếu parent mới không phải category, tool SHALL báo lỗi có cấu trúc.

#### Scenario: Chuyển channel sang category khác
- **WHEN** client gọi tool di chuyển channel tới một category hợp lệ
- **THEN** channel đổi parent sang category đó và tool trả về quan hệ cha–con mới

### Requirement: Xóa channel

Hệ thống SHALL cung cấp tool xóa một channel hoặc category. Khi xóa một category còn chứa channel con, tool SHALL nêu rõ hệ quả (channel con trở thành không thuộc category) trong kết quả.

#### Scenario: Xóa channel
- **WHEN** client gọi tool xóa một channel hợp lệ
- **THEN** channel bị xóa và tool trả về xác nhận

### Requirement: Đồng bộ quyền channel theo category

Hệ thống SHALL cung cấp tool đồng bộ permission overwrite của một channel theo category cha của nó (synced), để channel kế thừa quyền từ category.

#### Scenario: Sync channel với category cha
- **WHEN** client gọi tool đồng bộ một channel đang thuộc một category
- **THEN** overwrite của channel được đặt trùng với category cha và tool trả về trạng thái đã đồng bộ
