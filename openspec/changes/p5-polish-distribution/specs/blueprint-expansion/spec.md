## ADDED Requirements

### Requirement: Thư viện phủ đủ sáu loại server

Thư viện blueprint SHALL cung cấp blueprint cho đủ sáu loại server trong tài liệu: game, education, community (cộng đồng lớn), crypto (crypto/NFT/Web3), creator (creator/streamer), business (SaaS/support). Mỗi blueprint mới SHALL có role, category/channel, bot đề xuất và ghi chú bảo mật đặc trưng của loại đó, và SHALL vượt qua kiểm tra hợp lệ blueprint.

#### Scenario: Có đủ sáu blueprint
- **WHEN** client gọi tool liệt kê blueprint
- **THEN** danh sách chứa cả sáu loại: game, education, community, crypto, creator, business

#### Scenario: Blueprint mới đặc trưng theo loại
- **WHEN** client lấy chi tiết một blueprint mới (ví dụ crypto)
- **THEN** blueprint có phần tử đặc trưng của loại đó (ví dụ crypto: kênh xác minh ví/holder-gated) và vượt qua kiểm tra hợp lệ

### Requirement: Nhận diện các loại server mới

Tool đề xuất blueprint SHALL nhận diện được các loại server mới qua từ khóa, trả về đúng blueprint tương ứng khi mục đích thể hiện rõ loại đó.

#### Scenario: Đề xuất đúng loại mới
- **WHEN** client gọi đề xuất với mục đích thể hiện rõ một loại mới (ví dụ nhắc tới NFT/crypto, hoặc kênh streamer, hoặc hỗ trợ khách hàng SaaS)
- **THEN** tool trả về blueprint đúng loại đó ở vị trí đầu kèm lý do
