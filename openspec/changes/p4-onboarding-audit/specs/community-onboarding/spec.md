## ADDED Requirements

### Requirement: Bật Community feature

Hệ thống SHALL cung cấp tool bật Community cho guild, nhận kênh rules và kênh public-updates cần thiết. Nếu Community đã bật, tool SHALL báo trạng thái đó thay vì lỗi. Tool SHALL hỗ trợ `dryRun`.

#### Scenario: Bật Community trên guild chưa bật
- **WHEN** client gọi tool bật Community với kênh rules và public-updates hợp lệ
- **THEN** Community được bật và tool trả về trạng thái mới của guild (đã có COMMUNITY trong features)

#### Scenario: Community đã bật sẵn
- **WHEN** client gọi tool bật Community trên guild đã có Community
- **THEN** tool trả về trạng thái đã bật, không gây lỗi

### Requirement: Đọc cấu hình Onboarding

Hệ thống SHALL cung cấp tool đọc cấu hình Onboarding hiện tại của guild (trạng thái bật, default channels, các prompt). Tool này SHALL chỉ đọc.

#### Scenario: Đọc onboarding hiện tại
- **WHEN** client gọi tool đọc Onboarding
- **THEN** tool trả về trạng thái bật/tắt, danh sách default channel và các prompt hiện có, không thay đổi gì

### Requirement: Cấu hình Onboarding với kiểm tra ràng buộc

Hệ thống SHALL cung cấp tool cấu hình Onboarding: default channels và các prompt (mỗi prompt có câu hỏi và các đáp án gán role/kênh). Trước khi gọi API, tool SHALL kiểm tra ràng buộc của Discord — cần **≥ 7 default channel** và **≥ 5** trong số đó cho phép `@everyone` gửi tin. Tool SHALL hỗ trợ `dryRun`.

#### Scenario: Cấu hình hợp lệ
- **WHEN** client gọi tool cấu hình Onboarding với ≥7 default channel (≥5 cho @everyone gửi) và các prompt hợp lệ
- **THEN** Onboarding được cập nhật và tool trả về cấu hình mới

#### Scenario: Vi phạm ràng buộc default channel
- **WHEN** client gọi tool cấu hình Onboarding với ít hơn 7 default channel hoặc ít hơn 5 kênh cho @everyone gửi
- **THEN** tool trả về lỗi có cấu trúc nêu rõ ràng buộc bị vi phạm và gợi ý cách khắc phục (hoặc làm thủ công), không gọi API

#### Scenario: Community chưa bật
- **WHEN** client gọi tool cấu hình Onboarding trên guild chưa bật Community
- **THEN** tool trả về lỗi có cấu trúc hướng dẫn bật Community trước, không gọi API onboarding
