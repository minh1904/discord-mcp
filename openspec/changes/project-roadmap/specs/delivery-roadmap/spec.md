## ADDED Requirements

### Requirement: Phased delivery structure

Dự án Discord MCP SHALL được phân phối theo các phase lớn có thứ tự và phụ thuộc rõ ràng. Mỗi phase SHALL có mục tiêu, phạm vi và tiêu chí hoàn thành (exit criteria) xác định; một phase SHALL không được coi là hoàn thành khi chưa đạt đủ exit criteria của nó.

Các phase lớn:
- **P0 — Discovery & Docs** (đã hoàn tất): chân dung khách hàng, thư viện blueprint, tri thức chuyên gia, khảo sát MCP & API, chốt stack.
- **P1 — Nền tảng MCP + kết nối Discord (read-only)**: dựng MCP server TypeScript, kết nối bot discord.js, transport stdio, và các tool đọc/chẩn đoán.
- **P2 — Lớp thực thi cấu trúc (write tools)**: tạo/sửa role, category, channel, permission overwrite, reorder — "bàn tay".
- **P3 — Lớp bộ não (blueprint + tư vấn)**: thư viện blueprint dạng dữ liệu, nhận diện loại server, hỏi khám phá, đề xuất và apply blueprint.
- **P4 — Onboarding/Community + Audit an toàn**: bật Community, cấu hình Onboarding, audit least-privilege, xuất tài liệu bàn giao.
- **P5 — Hoàn thiện & phân phối**: transport HTTP, mở rộng blueprint, kiểm thử, đóng gói/phân phối.

#### Scenario: Một phase được đánh dấu hoàn thành
- **WHEN** đội đánh giá một phase để chuyển sang phase kế
- **THEN** mọi tiêu chí hoàn thành (exit criteria) của phase đó phải đã đạt và có thể kiểm chứng, nếu không phase vẫn ở trạng thái đang làm

#### Scenario: Thứ tự phụ thuộc được tôn trọng
- **WHEN** bắt đầu một phase
- **THEN** tất cả phase mà nó phụ thuộc phải đã hoàn thành trước đó (P1→P2→P3→P4→P5; P3 có thể khởi động phần dữ liệu blueprint song song nhưng phần apply phụ thuộc P2)

### Requirement: Layered architecture ("bàn tay" trước, "bộ não" sau)

Kiến trúc SHALL tách hai lớp: lớp công cụ ("bàn tay") gọi Discord API qua discord.js, và lớp tư vấn ("bộ não") chứa blueprint và logic đề xuất. Lớp bàn tay SHALL được xây trước và có thể dùng độc lập; lớp bộ não SHALL đặt lên trên và tái sử dụng lớp bàn tay để thực thi, không gọi thẳng API trùng lặp.

#### Scenario: Bộ não thực thi qua bàn tay
- **WHEN** lớp bộ não cần tạo role/kênh khi apply một blueprint
- **THEN** nó phải gọi các tool của lớp bàn tay thay vì gọi trực tiếp Discord API, để đảm bảo một điểm kiểm soát quyền và rate limit

### Requirement: An toàn theo mặc định xuyên suốt mọi phase

Mọi phase có thao tác ghi lên server SHALL tuân thủ an toàn theo mặc định: áp dụng least-privilege, KHÔNG yêu cầu hay đề xuất quyền Administrator, và MỌI thao tác ghi (tạo/sửa/xóa/apply) SHALL yêu cầu người dùng xác nhận trước khi thực thi.

#### Scenario: Thao tác ghi cần xác nhận
- **WHEN** MCP chuẩn bị thực thi bất kỳ thay đổi ghi nào lên guild
- **THEN** nó phải trình bày thay đổi dự kiến và chờ người dùng duyệt trước khi gọi API

#### Scenario: Không leo thang quyền
- **WHEN** MCP hướng dẫn cấu hình bot hoặc tạo role
- **THEN** nó chỉ yêu cầu tập quyền tối thiểu cần thiết và không đề xuất cấp Administrator

### Requirement: Mỗi phase giao được giá trị dùng được

Mỗi phase (từ P1) SHALL kết thúc bằng một sản phẩm chạy được và kiểm chứng được bởi người dùng, không chỉ là code nội bộ. Exit criteria của mỗi phase SHALL bao gồm một cách chứng minh giá trị end-to-end.

#### Scenario: Nghiệm thu cuối phase
- **WHEN** một phase tuyên bố hoàn thành
- **THEN** phải có thể chạy MCP thật và quan sát được năng lực mới của phase đó hoạt động trên một server Discord thử nghiệm
