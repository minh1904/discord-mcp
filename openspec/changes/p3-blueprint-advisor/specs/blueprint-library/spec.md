## ADDED Requirements

### Requirement: Mô hình dữ liệu blueprint

Hệ thống SHALL định nghĩa một mô hình blueprint có kiểu (typed) mô tả một loại server: định danh, loại server, mô tả, từ khóa nhận diện, danh sách role, danh sách category kèm channel (có loại), danh sách bot đề xuất, ghi chú bảo mật, và gợi ý onboarding. Mỗi blueprint SHALL có định danh duy nhất.

#### Scenario: Blueprint hợp lệ về cấu trúc
- **WHEN** hệ thống nạp một blueprint từ thư viện
- **THEN** blueprint có đủ các trường bắt buộc (định danh, loại server, roles, categories) và mọi channel nằm trong một category với loại hợp lệ

### Requirement: Thư viện blueprint mẫu

Hệ thống SHALL cung cấp sẵn ít nhất hai blueprint mẫu: một cho server **game** và một cho server **giáo dục**, phản ánh tri thức trong tài liệu (role, kênh, bot, bảo mật theo loại).

#### Scenario: Có blueprint game và giáo dục
- **WHEN** client yêu cầu danh sách blueprint
- **THEN** danh sách chứa ít nhất blueprint loại "game" và loại "education", mỗi cái có role và category/channel đặc trưng của loại đó

### Requirement: Liệt kê blueprint

Hệ thống SHALL cung cấp tool liệt kê các blueprint khả dụng, mỗi mục gồm định danh, loại server và mô tả ngắn.

#### Scenario: Liệt kê blueprint
- **WHEN** client gọi tool liệt kê blueprint
- **THEN** tool trả về mọi blueprint khả dụng với định danh, loại server và mô tả

### Requirement: Lấy chi tiết blueprint

Hệ thống SHALL cung cấp tool trả về toàn bộ nội dung một blueprint theo định danh. Nếu định danh không tồn tại, tool SHALL trả lỗi có cấu trúc.

#### Scenario: Lấy blueprint theo định danh
- **WHEN** client gọi tool lấy blueprint với một định danh hợp lệ
- **THEN** tool trả về đầy đủ roles, categories/channels, bot đề xuất, ghi chú bảo mật của blueprint đó

#### Scenario: Định danh không tồn tại
- **WHEN** client gọi tool lấy blueprint với định danh không có trong thư viện
- **THEN** tool trả về lỗi có cấu trúc nêu rõ không tìm thấy blueprint
