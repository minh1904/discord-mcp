## ADDED Requirements

### Requirement: Test tự động cho logic thuần

Dự án SHALL có bộ test tự động chạy bằng `bun test`, phủ tối thiểu: đề xuất blueprint (rõ ràng và mơ hồ), kiểm tra hợp lệ của mọi blueprint, nạp/kiểm chứng cấu hình (thiếu token → lỗi), và ánh xạ loại kênh. Bộ test SHALL chạy được **không cần kết nối Discord**.

#### Scenario: Test suite chạy xanh
- **WHEN** chạy `bun test`
- **THEN** toàn bộ test đi qua, không cần bot token hay kết nối mạng

#### Scenario: Test bắt lỗi hồi quy logic
- **WHEN** một hàm logic thuần (ví dụ recommend hoặc validate blueprint) bị thay đổi làm sai kết quả kỳ vọng
- **THEN** có ít nhất một test thất bại chỉ ra hồi quy đó

### Requirement: Script test trong package

Dự án SHALL cung cấp script `test` trong `package.json` để chạy bộ test bằng một lệnh.

#### Scenario: Chạy test qua script
- **WHEN** chạy `bun run test`
- **THEN** bộ test được thực thi và báo cáo kết quả pass/fail
