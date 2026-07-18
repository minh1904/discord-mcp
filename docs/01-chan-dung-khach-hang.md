# Chân dung khách hàng

Có **hai lớp khách hàng** cần phân biệt rõ, vì chúng quyết định cách MCP giao tiếp:

- **Lớp A — Người dùng trực tiếp MCP:** chính là "chuyên gia setup server Discord" (persona mà MCP phải nhập vai và phục vụ).
- **Lớp B — Khách hàng cuối:** những người thuê/nhờ chuyên gia đó dựng server. Chuyên gia phải hiểu tệp này thì mới tư vấn đúng.

---

## Lớp A — Chuyên gia setup / kiến trúc server Discord

Đây là **persona mà MCP phải thể hiện được kỹ năng của họ.**

### Họ là ai
- Freelancer / agency chuyên nhận dựng và tối ưu server Discord (thấy nhiều trên Fiverr, Contra, Freelancer, các server "Freelance Marketplace").
- Community manager / Discord admin chuyên nghiệp, hoặc "Discord architect".
- Mức giá dịch vụ phổ biến: gói setup từ ~$30 đến $160+ (trung bình quanh $83 cho quản trị cộng đồng), chia tầng: **basic** (dựng cơ bản) → **intermediate** (thêm bot) → **premium** (bot custom + tích hợp).

### Họ giỏi cái gì (kỹ năng MCP cần mô phỏng)
1. **Chẩn đoán nhu cầu:** nhìn một mục tiêu ("tôi muốn server cho game X" / "server dạy học") là biết ngay cần role gì, kênh gì, luồng vào ra sao.
2. **Kiến trúc thông tin:** sắp xếp category/kênh sao cho dễ tìm, không rối; biết "80% hoạt động chỉ diễn ra ở 3–4 kênh" nên thiết kế quanh các kênh lõi.
3. **Thiết kế phân quyền:** xây cây role (admin → mod → member → chưa xác minh) + permission overwrite theo nguyên tắc least-privilege.
4. **Hệ sinh thái bot:** biết chọn bot cho từng nhu cầu (moderation, leveling, ticket, reaction role, lịch sự kiện, token-gating...).
5. **Onboarding & tăng trưởng:** dùng Community Onboarding, Rules Screening, welcome flow; biết cách phá "cold start" cho server mới.
6. **Bảo mật & chống raid:** verification gate, Raid Protection, tách kênh staff.

### Họ cần gì ở một công cụ như MCP này
- **Tăng tốc:** dựng khung server chuẩn trong vài phút thay vì vài giờ click tay.
- **Nhất quán & tái lập:** áp một blueprint đã được kiểm chứng cho nhiều khách hàng.
- **Tư vấn hóa:** một "đồng nghiệp" gợi ý đúng cấu trúc theo loại cộng đồng, để họ không bỏ sót và để khách hàng thấy chuyên nghiệp.
- **Bàn giao gọn:** xuất ra sơ đồ/role/kênh dạng tài liệu để giải thích cho khách.

### Nỗi đau (pain points)
- Làm lại từ đầu mỗi lần, dễ quên bước (quên khóa kênh announcement, quên tách kênh mod...).
- Khách hàng mô tả nhu cầu mơ hồ ("làm cho nó xịn") → cần công cụ biết hỏi lại.
- Sửa permission thủ công dễ sai, rủi ro để lộ quyền Administrator.
- Khó chuẩn hóa chất lượng giữa các dự án.

---

## Lớp B — Tệp khách hàng cuối (người thuê chuyên gia)

Chuyên gia phải hiểu các nhóm này để tư vấn đúng. Đây cũng là các **loại server** mà MCP cần có blueprint (chi tiết ở [02-nhu-cau-theo-loai-server.md](02-nhu-cau-theo-loai-server.md)).

| Nhóm khách | Họ muốn gì ở server | Đặc trưng dễ nhận |
|-----------|--------------------|-------------------|
| **Chủ cộng đồng game / guild** | Nơi tụ tập chơi cùng, tìm đồng đội (LFG), khoe clip, phân role theo game/rank | Kênh theo game, voice "phòng team", role rank tự động |
| **Giáo dục / lớp học / study group** | Môi trường học có tổ chức, phòng học nhóm, nộp bài, nhắc lịch | Voice co-working, kênh theo môn, role học viên/mentor, tích hợp lịch/Classroom |
| **Cộng đồng công khai lớn / thương hiệu** | Không gian topic rõ ràng, có kiểm duyệt mạnh, xác minh chống spam | Verification gate, nhiều kênh chủ đề, tooling mod mạnh |
| **Crypto / NFT / Web3** | Cộng đồng phân tầng theo mức nắm giữ, token-gating, thông báo giá, governance | Wallet verify (Collab.Land), kênh gated theo holder, cảnh báo giá |
| **Creator / Streamer / KOL** | Kết nối fan, thông báo lên sóng/nội dung mới, quyền lợi theo tier | Tích hợp Twitch/YouTube, role subscriber/tier, kênh fan |
| **Doanh nghiệp / SaaS / Support** | Hỗ trợ khách qua ticket, thông báo sản phẩm, cộng đồng người dùng | Hệ thống ticket, kênh feedback/bug, tách nội bộ vs công khai |

### Mẫu số chung của mọi khách hàng cuối
1. **Muốn trông chuyên nghiệp & có tổ chức** ngay từ ngày đầu.
2. **Sợ nhất:** server rối rắm, spam/raid, thành viên vào rồi không biết làm gì (rớt onboarding).
3. **Muốn thành viên chủ động**, không chỉ "vào rồi lặn".
4. **Ngân sách & kỹ năng khác nhau:** server 50 người gần như không cần automation; server 5.000 người "chết" nếu thiếu automation → cấu trúc phải co giãn theo quy mô.

---

## Kết luận cho thiết kế MCP
- MCP nhập vai **Lớp A** (chuyên gia), và phải **nhận diện được Lớp B** (loại server) để chọn blueprint.
- Trước khi tạo bất cứ thứ gì, MCP nên **hỏi khám phá nhu cầu** (xem [04-quy-trinh-tu-van.md](04-quy-trinh-tu-van.md)) — đúng như một chuyên gia thật sẽ làm.
