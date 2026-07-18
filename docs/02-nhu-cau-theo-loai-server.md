# Nhu cầu theo loại server (Blueprint library)

Mỗi loại server có một "blueprint" gồm: **mục tiêu → role → category/kênh → bot đề xuất → automation → lưu ý**. Đây là thư viện tri thức để MCP chọn đúng khi biết loại cộng đồng.

> Quy ước chung áp dụng cho **mọi** blueprint:
> - Cây role tối thiểu: `Admin → Moderator → Member → Unverified`.
> - Kênh top-level lúc ra mắt: **6–10 kênh nhìn thấy** (đừng nhiều hơn), mở rộng sau theo nhu cầu.
> - Luôn có: `#welcome`, `#rules`, `#announcements` (chỉ staff đăng), một kênh mod riêng tư.
> - Bật verification/onboarding trước khi mở công khai.

---

## 1. Server Game / Guild

**Mục tiêu:** tụ tập chơi cùng, tìm đồng đội, chia sẻ khoảnh khắc, phân cấp theo game/rank.

**Role:**
- Theo game: `@Valorant`, `@LoL`, `@Minecraft`... (self-assign qua reaction/onboarding).
- Theo rank/level: role tự động theo XP (leveling) hoặc rank trong game.
- Vận hành: `@Event Host`, `@Moderator`.

**Category & kênh:**
- 📢 **THÔNG TIN:** `#welcome`, `#rules`, `#announcements`, `#patch-notes`
- 💬 **CHUNG:** `#general`, `#off-topic`, `#memes`, `#clips-screenshots`
- 🎮 **TÌM ĐỘI (LFG):** `#lfg-<game>` cho từng game
- 🔊 **VOICE:** các "Team Room 1/2/3", `#afk`
- 🛠️ **BOT:** `#bot-commands`

**Bot đề xuất:** MEE6/Carl-bot (leveling + reaction role), một bot LFG/tournament, bot moderation.

**Automation:** role rank tự động theo XP; poll cho tournament; lịch sự kiện game night.

**Lưu ý:** voice là trung tâm — ưu tiên nhiều phòng voice; kênh clip khuyến khích tương tác.

---

## 2. Server Giáo dục / Học tập / Study group

**Mục tiêu:** môi trường học có tổ chức, học nhóm, trách nhiệm (accountability), nhắc lịch.

**Role:**
- `@Student`, `@Mentor/TA`, `@Teacher/Admin`.
- Theo môn/lớp: `@Math`, `@IELTS`, `@Khóa-2026`...
- Cấp độ: `@Beginner`, `@Intermediate`, `@Advanced`.

**Category & kênh:**
- 📢 **THÔNG TIN:** `#welcome`, `#rules`, `#announcements`, `#lich-hoc`
- 📚 **HỌC TẬP:** kênh theo môn `#toan`, `#anh-van`...; `#hoi-dap`; `#tai-lieu`; `#nop-bai`
- 🎯 **ĐỒNG HÀNH:** `#accountability` (check-in mục tiêu), `#study-log`
- 🔊 **CO-WORKING VOICE:** "Study Room" (học chung, mở mic/camera), "Silent Focus"
- 🛠️ **BOT:** `#bot-commands`

**Bot đề xuất:** bot nhắc lịch/sự kiện (vd Sesh), bot Pomodoro/focus, bot điểm danh; tích hợp Google Classroom nếu cần.

**Automation:** welcome + gán role lớp qua Onboarding; nhắc deadline; standup/check-in định kỳ.

**Lưu ý:** an toàn học viên (nhất là có trẻ vị thành niên): kiểm duyệt phù hợp lứa tuổi, kênh riêng tư cho lớp, cân nhắc quy định về quyền riêng tư.

---

## 3. Cộng đồng công khai lớn / Thương hiệu

**Mục tiêu:** không gian chủ đề rõ ràng, kiểm duyệt mạnh, chống spam, mở rộng bền vững.

**Role:** `Admin → Mod → Trusted/Regular → Member → Unverified`; role sở thích để lọc kênh.

**Category & kênh:**
- 🚪 **CỔNG VÀO:** `#welcome`, `#rules`, `#verify`, `#announcements`, `#server-guide`
- 💬 **CHUNG:** `#general`, `#introductions`, `#off-topic`
- 🧵 **CHỦ ĐỀ:** dùng **Forum channel** cho thảo luận dài; nhóm kênh theo chủ đề
- 🎉 **SỰ KIỆN:** `#events`, Stage channel cho AMA/townhall
- 🛡️ **STAFF (riêng tư):** `#mod-chat`, `#mod-log`, `#reports`

**Bot đề xuất:** moderation mạnh (Dyno/Carl-bot/MEE6 automod), logging, verification, ticket cho báo cáo.

**Automation:** Raid Protection + automod; verification gate bắt buộc; auto-log; reaction role cho sở thích.

**Lưu ý:** least-privilege nghiêm ngặt; tách bạch kênh staff; chuẩn bị mở rộng bằng automation vì quy mô lớn.

---

## 4. Crypto / NFT / Web3 / DAO

**Mục tiêu:** cộng đồng phân tầng theo mức nắm giữ/đóng góp, token-gating, thảo luận governance, cảnh báo giá.

**Role:** `@Holder` (theo mức token/NFT), `@Contributor`, `@Core/Governance`, `@Verified` (đã nối ví).

**Category & kênh:**
- 🌐 **PUBLIC:** `#welcome`, `#rules`, `#verify-wallet`, `#announcements`, `#general`
- 🔒 **HOLDER-GATED:** `#holders-lounge`, `#alpha`, `#trading` (chỉ mở sau khi verify)
- 🏛️ **GOVERNANCE:** `#proposals`, `#voting-discussion`
- 📈 **DỮ LIỆU:** `#price-alerts`, `#floor-tracking`
- 🛡️ **CORE (riêng tư):** kênh contributor/core

**Bot đề xuất:** **Collab.Land** (chuẩn ngành cho wallet verify & token-gated role), bot cảnh báo giá, AI moderation.

**Automation:** verify ví → gán role theo holdings; layered access (public → gated → private/core).

**Lưu ý:** cảnh giác scam/impersonation cực cao; không bao giờ để bot có quyền Administrator; kênh core tách riêng.

---

## 5. Creator / Streamer / KOL

**Mục tiêu:** kết nối fan, thông báo nội dung/lên sóng, quyền lợi theo tier subscriber.

**Role:** `@Subscriber`/`@Member` theo tier (YouTube/Twitch/Patreon), `@VIP/OG`, `@Moderator`.

**Category & kênh:**
- 📢 **THÔNG TIN:** `#welcome`, `#rules`, `#announcements`, `#new-content` (auto post video/stream)
- 💬 **CỘNG ĐỒNG:** `#general`, `#fan-art`, `#clips`
- ⭐ **ĐỘC QUYỀN (gated):** `#subscribers-only`, `#behind-the-scenes`
- 🔊 **VOICE:** watch party / hangout
- 🛠️ **BOT:** `#bot-commands`

**Bot đề xuất:** tích hợp Twitch/YouTube (auto thông báo live/upload), bot gán role subscriber, leveling để thưởng fan tích cực.

**Automation:** auto post khi lên sóng/đăng video; gán role theo tier tự động; role fan tích cực theo XP.

**Lưu ý:** quyền lợi độc quyền phải rõ ràng; dễ tham gia (đừng gate quá tay ở kênh chung).

---

## 6. Doanh nghiệp / SaaS / Support

**Mục tiêu:** hỗ trợ khách qua ticket, thông báo sản phẩm, cộng đồng người dùng, tách nội bộ.

**Role:** `@Customer`, `@Trial`, `@Partner`, `@Support Staff`, `@Team (internal)`.

**Category & kênh:**
- 📢 **THÔNG TIN:** `#welcome`, `#rules`, `#announcements`, `#changelog`
- 🎫 **HỖ TRỢ:** `#open-a-ticket` (panel ticket), `#faq`, `#status`
- 💬 **CỘNG ĐỒNG:** `#general`, `#feature-requests`, `#bug-reports`, `#showcase`
- 🔒 **NỘI BỘ (riêng tư):** `#team`, `#support-queue`

**Bot đề xuất:** **Ticket Tool / Tickets** (hệ thống ticket + transcript), bot changelog/announcement; cân nhắc route ticket sang CRM (HubSpot...).

**Automation:** ticket → transcript lưu trữ; form thu thập bug/feature; phân loại & định tuyến.

**Lưu ý:** tách tuyệt đối kênh nội bộ; transcript & quyền riêng tư dữ liệu khách; SLA phản hồi.

---

## Bảng chọn nhanh (cheat sheet)

| Nếu server là... | Nhấn mạnh nhất |
|---|---|
| Game | Voice team rooms, LFG, role rank tự động |
| Học tập | Voice co-working, kênh theo môn, accountability, nhắc lịch |
| Cộng đồng lớn | Verification, forum theo chủ đề, mod tooling |
| Crypto/NFT | Wallet verify, token-gated channels, price alerts |
| Creator | Tích hợp Twitch/YouTube, role theo tier, kênh độc quyền |
| Business/SaaS | Ticket system, feedback/bug, tách nội bộ |

> Nhiều server là **lai (hybrid)** — vd "creator chơi game" hay "cộng đồng học + business". MCP nên cho phép **ghép blueprint**, lấy khối phù hợp từ nhiều loại.
