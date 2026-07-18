# Kho tri thức chuyên gia (Expert Knowledge Base)

Đây là phần "skill" cốt lõi mà MCP phải nắm — những nguyên tắc một chuyên gia setup Discord luôn áp dụng, độc lập với loại server.

---

## 1. Kiến trúc Role (phân quyền theo nhóm)

**Nguyên tắc:**
- Cây role tối thiểu: `Admin → Moderator → Member → Unverified`. Mở rộng thêm 3 nhóm role:
  - **Loại thành viên:** customer, partner, learner, trial, holder, subscriber...
  - **Cấp độ/chuyên môn:** beginner → intermediate → advanced → mentor.
  - **Vận hành:** moderator, event host, community champion.
- **Thứ tự role quan trọng:** bot chỉ quản lý được user có role cao nhất *thấp hơn* role cao nhất của bot → role bot phải nằm **trên** role nó cần quản lý.
- Role có thể "hoist" (hiển thị tách nhóm ở sidebar) + có màu để nhận diện.
- **Self-assign role** qua reaction role / Onboarding cho sở thích, game, môn học...

**Least-privilege (cực kỳ quan trọng):**
- Mỗi role chỉ có **đúng** quyền tối thiểu cần thiết.
- **Không** cấp `Administrator` trừ khi thật sự bắt buộc — kể cả cho bot. Thay vào đó ghép quyền cụ thể (`Manage Messages`, `Manage Channels`, `Kick Members`...).
- Bot có `Administrator` sẽ ghi đè mọi permission overwrite → rủi ro bảo mật lớn.

---

## 2. Kiến trúc kênh (Information Architecture)

**Nguyên tắc:**
- **80% hoạt động diễn ra ở 3–4 kênh** → thiết kế quanh các kênh lõi trước, thêm kênh phụ chỉ khi thành viên yêu cầu.
- Giữ top-level gọn: **6–10 kênh** lúc ra mắt.
- Gom kênh vào **category** hợp lý; thông tin quan trọng phải dễ tìm.
- Ba kênh nền tảng: **Welcome** (chào & làm quen) → **Rules** (nội quy) → **Announcements** (chỉ staff đăng).

**Các loại kênh:**
- **Text channel** — chat văn bản.
- **Voice channel** (có text-in-voice) — thoại/video; nền tảng cho game & co-working học tập.
- **Forum channel** — thảo luận dài, có tổ chức (tốt cho cộng đồng lớn, Q&A, feature requests).
- **Stage channel** — sự kiện phát biểu (AMA, townhall).
- **Announcement channel** — có thể "follow" để đẩy sang server khác.

---

## 3. Permission Overwrites (phân quyền theo kênh)

- Permission có 2 tầng: **guild-level** (theo role toàn server) và **channel-level overwrite** (theo role/user trên từng kênh).
- **Overwrite cấp kênh luôn ghi đè** permission cấp server.
- **Synced category:** nếu kênh con giữ nguyên overwrite như category cha → nó "đồng bộ"; sửa category cha sẽ tự áp cho kênh con. Đây là cách quản lý quyền gọn nhất: **set quyền ở category, cho kênh sync theo**.
- Mẫu phổ biến:
  - Kênh staff: deny `View Channel` cho `@everyone`, allow cho `@Moderator`+.
  - `#announcements`: deny `Send Messages` cho `@everyone`, allow cho staff.
  - Kênh gated: deny `View Channel` cho `@everyone`/`@Unverified`, allow cho role đã verify.

---

## 4. Onboarding & luồng thành viên mới (native Discord)

Discord có bộ tính năng Community tích hợp — chuyên gia luôn tận dụng:

- **Rules Screening:** thành viên phải đồng ý nội quy trước khi tương tác.
- **Community Onboarding:** một "survey" dẫn dắt người mới:
  1. Chọn **Default Channels** (kênh mọi người thấy khi vừa vào).
  2. Tạo **Customization Questions** → mỗi đáp án gán **role + mở kênh** tương ứng.
  3. Người mới *phải* hoàn tất onboarding trước khi đăng bài.
  - Câu hỏi có thể bắt buộc hoặc tùy chọn.
- **Welcome Screen / Server Guide:** giới thiệu server, chỉ đường tới kênh quan trọng.
- Thứ tự: (Verification) → **Rules Screening** → **Onboarding** → vào server.

**Phá "cold start" cho server mới:** mời 10–20 người quen tạo hoạt động mồi, tự đăng bài đều, thêm hoạt động do bot tạo, lên lịch sự kiện cố định để "luôn có gì đó diễn ra".

---

## 5. Hệ sinh thái Bot (khi nào dùng cái gì)

| Nhu cầu | Bot tiêu biểu | Ghi chú |
|--------|--------------|--------|
| Moderation / automod / logging | **Dyno**, **Carl-bot**, **MEE6** | Dyno mạnh về moderation dashboard; Carl-bot mạnh logging + automod |
| Reaction role / self-assign | **Carl-bot** | Chuẩn mực cho reaction role, embed |
| Leveling / XP → role tự động | **MEE6** | XP theo chat, unlock role theo mốc |
| Ticket / support | **Ticket Tool**, **Tickets** | Transcript, form, panel; premium có thêm tính năng |
| Lịch / sự kiện | **Sesh** (và tương tự) | RSVP, nhắc lịch |
| Token-gating (crypto/NFT) | **Collab.Land** | Chuẩn ngành cho wallet verify + gán role theo holdings |
| Tích hợp Twitch/YouTube | bot thông báo live/upload | Cho creator/streamer |

**Nguyên tắc chọn bot:** ít bot nhưng đúng việc; không chồng chéo chức năng; không cấp Administrator; đặt role bot đúng thứ tự phân cấp.

> Lưu ý kỹ thuật cho MCP: **MCP không "cài" bot bên thứ ba hộ user** (đó là OAuth do user thực hiện). MCP dựng khung (role/kênh/quyền/onboarding) và **đề xuất** danh sách bot + hướng dẫn cài. Xem [05-dinh-huong-mcp.md](05-dinh-huong-mcp.md).

---

## 6. Bảo mật & chống raid

- **Verification gate:** yêu cầu xác minh trước khi thấy nội dung chính.
- **Raid Protection:** dùng ML phát hiện hành vi bất thường/dấu hiệu join-raid.
- **Automod:** lọc từ khóa, spam, link, mention hàng loạt.
- **Tách kênh staff:** `#mod-chat`, `#mod-log` chỉ staff thấy.
- **Least-privilege** cho cả người lẫn bot (mục 1).
- Với crypto/NFT: cảnh giác scam/impersonation, kênh chính thức được đánh dấu rõ.

---

## 7. Tăng trưởng & gắn kết (engagement)

- **Leveling** thưởng thành viên tích cực (role theo mốc XP).
- **Reaction role** cho sở thích → cá nhân hóa trải nghiệm.
- **Sự kiện định kỳ** (game night, study standup, AMA) — "luôn có gì đó diễn ra".
- **Forum channel** cho thảo luận dài, giữ nội dung có tổ chức.
- **Server stats** (kênh hiển thị số thành viên) tạo cảm giác cộng đồng sống động.
- Có **community manager** theo dõi, tổ chức sự kiện, thu feedback, trả lời câu hỏi.

---

## Nguồn tham khảo

- Discord Support — *Server Setup Guide*, *Community Onboarding FAQ/Examples*, *Roles and Permissions*.
- Discord Developer Docs — *Permissions* (overwrites, synced category, phân cấp role bot).
- discordjs.guide — *Permissions*.
- Blog/hướng dẫn cộng đồng: Whop, Domino, BuildMyDiscord, Mighty Networks, GameAnalytics, Memvers, VibeBot, PeakBot (so sánh MEE6/Dyno/Carl-bot), Mava (ticket bots).
- Thị trường dịch vụ: Fiverr, Contra, Freelancer (gói & kỳ vọng khách hàng).
- Crypto/NFT & token-gating: Collab.Land, các bài tổng hợp cộng đồng crypto/NFT 2026.

*(Tổng hợp từ tìm kiếm web tháng 7/2026; kiểm chứng lại số liệu bot & tính năng trước khi đưa vào sản phẩm vì có thể thay đổi.)*
