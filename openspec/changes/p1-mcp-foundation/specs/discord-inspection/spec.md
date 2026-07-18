## ADDED Requirements

### Requirement: Kết nối bot Discord với đầy đủ quyền và intents

Hệ thống SHALL kết nối tới Discord bằng bot token qua `discord.js`, khởi tạo client với đầy đủ intents cần cho việc đọc cấu trúc và thành viên (`Guilds`, `GuildMembers`, `MessageContent`). Bot vận hành SHALL được cấp toàn bộ quyền (Administrator) theo quyết định của operator để không bị chặn ở các phase sau. Việc kết nối SHALL báo trạng thái sẵn sàng khi đăng nhập thành công và báo lỗi rõ ràng khi thất bại.

#### Scenario: Đăng nhập thành công
- **WHEN** server khởi động với token hợp lệ và bot đã ở trong guild
- **THEN** client Discord đăng nhập, phát tín hiệu sẵn sàng, và các tool inspection có thể truy vấn guild

#### Scenario: Token không hợp lệ
- **WHEN** server khởi động với token sai hoặc bot bị thu hồi
- **THEN** hệ thống báo lỗi kết nối rõ ràng và không để tool chạy trong trạng thái chưa sẵn sàng

#### Scenario: Bot chưa ở trong guild được yêu cầu
- **WHEN** một tool inspection được gọi với guild mà bot chưa tham gia
- **THEN** tool trả về lỗi có cấu trúc nêu rõ bot chưa ở trong guild đó

### Requirement: Tool tổng quan server (read-only)

Hệ thống SHALL cung cấp một tool trả về tổng quan một guild: tên, số thành viên, các feature (vd COMMUNITY), số lượng role/category/channel, và mức verification. Tool này SHALL chỉ đọc, không thực hiện thay đổi nào.

#### Scenario: Lấy tổng quan guild
- **WHEN** client gọi tool tổng quan với một guild id hợp lệ (hoặc guild mặc định đã cấu hình)
- **THEN** tool trả về dữ liệu tổng quan của guild mà không thay đổi bất kỳ cài đặt nào

### Requirement: Tool liệt kê role (read-only)

Hệ thống SHALL cung cấp tool liệt kê toàn bộ role của guild kèm thuộc tính chính: tên, màu, vị trí (position), hoist, và các quyền của role. Kết quả SHALL phản ánh thứ tự phân cấp role.

#### Scenario: Liệt kê role theo phân cấp
- **WHEN** client gọi tool liệt kê role
- **THEN** tool trả về danh sách role kèm position và quyền, sắp theo thứ tự phân cấp từ cao xuống thấp

### Requirement: Tool liệt kê kênh và category (read-only)

Hệ thống SHALL cung cấp tool liệt kê category và channel của guild, thể hiện quan hệ cha–con (channel thuộc category nào) và loại kênh (text/voice/stage/forum/announcement).

#### Scenario: Liệt kê kênh theo category
- **WHEN** client gọi tool liệt kê kênh
- **THEN** tool trả về các category kèm kênh con của chúng và loại từng kênh, giữ đúng quan hệ cha–con

### Requirement: Tool đọc permission overwrite của kênh (read-only)

Hệ thống SHALL cung cấp tool đọc các permission overwrite trên một kênh, nêu rõ mỗi overwrite áp cho role hay member và tập quyền allow/deny tương ứng.

#### Scenario: Đọc overwrite của một kênh
- **WHEN** client gọi tool đọc overwrite với một channel id hợp lệ
- **THEN** tool trả về danh sách overwrite với đối tượng áp dụng (role/member) và các quyền allow/deny, không thay đổi gì
