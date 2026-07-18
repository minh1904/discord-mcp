## ADDED Requirements

### Requirement: So sánh blueprint với hiện trạng (propose_changes)

Hệ thống SHALL cung cấp tool `propose_changes` nhận một blueprint và một guild, đọc cấu trúc hiện có, và trả về kế hoạch thay đổi: role cần tạo, category cần tạo, channel cần tạo (kèm category cha), permission overwrite cần đặt. Tool SHALL KHÔNG thực hiện thay đổi nào.

#### Scenario: Sinh kế hoạch trên guild trống
- **WHEN** client gọi `propose_changes` với một blueprint trên một guild chưa có role/kênh của blueprint
- **THEN** kế hoạch liệt kê toàn bộ role, category, channel của blueprint cần tạo, và không thay đổi gì trên guild

#### Scenario: Kế hoạch tôn trọng phần đã có
- **WHEN** client gọi `propose_changes` mà guild đã có sẵn một số role/kênh trùng tên với blueprint
- **THEN** kế hoạch chỉ liệt kê phần còn thiếu, bỏ qua những mục đã tồn tại

### Requirement: Dựng blueprint idempotent (apply_blueprint)

Hệ thống SHALL cung cấp tool `apply_blueprint` dựng phần còn thiếu theo kế hoạch của `propose_changes`, theo thứ tự phụ thuộc: tạo category trước, rồi channel thuộc category, rồi role, rồi permission overwrite. Tool SHALL idempotent — chạy lại trên guild đã dựng SHALL không tạo trùng.

#### Scenario: Dựng khung từ blueprint
- **WHEN** client gọi `apply_blueprint` (không dryRun) với một blueprint trên guild thiếu các mục đó
- **THEN** các category, channel, role và overwrite còn thiếu được tạo, và kết quả tóm tắt những gì đã tạo

#### Scenario: Chạy lại không tạo trùng
- **WHEN** client gọi `apply_blueprint` lần hai với cùng blueprint trên cùng guild
- **THEN** không có mục trùng nào được tạo thêm và kết quả cho biết không còn gì để tạo

### Requirement: apply_blueprint hỗ trợ dryRun và đi qua lớp bàn tay

`apply_blueprint` SHALL hỗ trợ tham số `dryRun`; khi true, tool trả về kế hoạch mà không thực thi. Khi thực thi, tool SHALL dùng lại các thao tác ghi của lớp cấu trúc (P2) thay vì gọi trực tiếp Discord API, để giữ một điểm kiểm soát quyền và phân cấp.

#### Scenario: Xem trước bằng dryRun
- **WHEN** client gọi `apply_blueprint` với `dryRun: true`
- **THEN** không có thay đổi nào được áp và tool trả về kế hoạch dự kiến giống `propose_changes`

#### Scenario: Lỗi giữa chừng không làm sập server
- **WHEN** một bước trong `apply_blueprint` thất bại (ví dụ vi phạm phân cấp role)
- **THEN** tool trả về lỗi có cấu trúc nêu rõ bước thất bại và những mục đã tạo thành công trước đó, server vẫn phục vụ request khác
