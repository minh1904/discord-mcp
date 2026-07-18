# Khảo sát Discord MCP có sẵn & năng lực Discord API

Tài liệu tham khảo trước khi lên plan. Gồm 3 phần: (A) các MCP Discord hiện có & nguyên lý thiết kế, (B) "bộ tool chuẩn" mà chúng phơi ra, (C) Discord API hỗ trợ/giới hạn gì — và (D) khoảng trống để dự án ta khai thác.

---

## A. Bức tranh các Discord MCP hiện có

> **Discord chưa có MCP chính thức.** Toàn bộ là cộng đồng, **không cái nào host sẵn** (đều chạy local/container). Đa số là **wrapper API thuần** — phơi API Discord ra thành tool, *không* có lớp "tư vấn/blueprint".

| Dự án | Ngôn ngữ | Transport | Quy mô | Điểm nổi bật |
|---|---|---|---|---|
| **SaseQ/discord-mcp** | Java + JDA | stdio + HTTP | ~65 tool | Coverage rộng nhất: forum, voice/stage, events, permission overwrite, emoji, invite, webhook |
| **barryyip0625/mcp-discord** | TypeScript | stdio + HTTP | vừa | Forum support tốt, active; intents rõ ràng |
| **ExilProductions/discord-mcp** | Python (FastMCP + discord.py) | — | rộng | Có **AutoMod**, audit log, "view-as" inspection, polls |
| **aj-geddes/discord-agent-mcp** | TS + discord.js | — | 71 tool | Tham chiếu pattern gần dự án ta nhất |
| **v-3/discordmcp** | TypeScript | stdio | tối giản | Chỉ send/read message — minh họa "khởi đầu gọn" |
| **IQAIcom/mcp-discord** | TS | — | vừa | Messaging, channel, forum, reaction, webhook |

### Nguyên lý thiết kế rút ra được
1. **Optional Guild ID:** cấu hình sẵn `DISCORD_GUILD_ID` → tham số guild thành optional ở mọi tool (bớt lặp).
2. **Hai transport:** `stdio` (mặc định, chạy local với client) và `HTTP streamable` (deploy dạng service, singleton). Nên hỗ trợ cả hai.
3. **Pagination chuẩn Discord:** message endpoints dùng cursor `before/after/around`, giới hạn 1–100 item.
4. **"View-as" / accessibility inspection (ExilProductions):** tool cho AI "xem một role/member thấy được kênh nào" → rất hợp workflow AI, giúp *audit* quyền. Đáng học.
5. **Cân bằng permission:** nhiều repo *khuyến nghị cấp Administrator cho nhanh* — tiện nhưng đi ngược least-privilege. Dự án ta nên **làm ngược lại**: hướng dẫn quyền tối thiểu và tự cảnh báo rủi ro.
6. **Wrapper mỏng:** hầu hết map 1-1 tool ↔ endpoint, không có "ý kiến". Đây chính là chỗ ta khác biệt (xem phần D).

---

## B. "Bộ tool chuẩn" (hợp nhất từ các MCP trên)

Đây là tập năng lực mà một Discord MCP trưởng thành thường có — dùng làm checklist tham chiếu:

- **Server/Guild:** get server info, edit guild settings (name, description, verification level).
- **Channel:** create/edit/delete/move text, voice, stage, forum, media, announcement; category CRUD; **move/reorder**.
- **Permission overwrite:** list; upsert cho role; upsert cho member; delete overwrite; (nâng cao) "view-as", liệt kê kênh accessible/inaccessible.
- **Role:** list/create/edit(+reorder position)/delete; assign/remove cho member.
- **Message:** send/edit/delete/bulk-delete/read (pagination); embed & mention; reaction add/remove/list reactors.
- **Moderation:** kick/ban/unban/timeout/remove-timeout; set nickname; get bans; **AutoMod** rules (keyword/spam/mention/preset).
- **Onboarding/Community:** (ít MCP có — xem phần C) set default channels + prompts.
- **Voice/Stage:** create/edit; move member; disconnect; modify voice state.
- **Scheduled Events:** create/edit/delete/list; get attendees.
- **Forum:** create/edit forum channel; tags; create/list/modify forum post (thread).
- **Webhook:** create/edit/delete/list; send via webhook.
- **Invite:** create/list/delete/get details.
- **Emoji/Sticker:** CRUD.
- **Audit log:** query có filter.

---

## C. Discord API hỗ trợ gì (và giới hạn) — phần quyết định

### Làm được qua API (bot token)
- **Role:** tạo/sửa/xóa, đặt màu, hoist, **reorder position**, gán/gỡ. ✅
- **Category & Channel:** tạo/sửa/xóa mọi loại kênh; gán `parent_id` (category); reorder. ✅
- **Permission overwrite theo kênh** (allow/deny cho role/member) + **synced category**. ✅
- **Community Onboarding:** `PUT /guilds/{id}/onboarding` — set `enabled`, `mode`, `default_channel_ids`, `prompts` (câu hỏi → role/kênh). Cần quyền **MANAGE_GUILD + MANAGE_ROLES**. discord.js có `GuildOnboarding*`. ✅ *(có ràng buộc, xem dưới)*
- **AutoMod, scheduled events, webhook, invite, emoji, moderation.** ✅
- **Server Template:** tạo template từ guild và **sync** (cần `MANAGE_GUILD`). ✅

### Ràng buộc & giới hạn cần nhớ (ảnh hưởng plan)
1. **Onboarding yêu cầu bật Community trước.** Nhiều cấu hình (onboarding, moderation settings) chỉ có khi guild có `COMMUNITY` trong `features`. **Không đổi được cùng lúc** với thao tác bật community → phải làm **2 bước**: bật Community trước, rồi cấu hình onboarding sau.
2. **Ràng buộc Onboarding khi bật:** phải có **≥ 7 default channel**, và **≥ 5** trong số đó cho phép `@everyone` gửi tin. → blueprint phải đủ số kênh mặc định hợp lệ, nếu không API từ chối.
3. **Tạo guild-from-scratch qua REST không set được `parent_id`** (không gắn kênh vào category khi tạo cả server một lần). → Với server **đã tồn tại** thì tạo kênh riêng lẻ *có* set parent_id bình thường. ⇒ Ta thao tác trên guild sẵn có, không dựng guild mới bằng 1 call.
4. **Phân cấp role:** bot chỉ quản lý/gán được role **thấp hơn** role cao nhất của bot → khi apply blueprint phải đặt role bot đủ cao (hoặc cảnh báo user kéo role bot lên).
5. **Bot phải là member của guild** và được mời với đúng scope/permission trước khi làm gì.
6. **Rate limit:** REST có rate limit (per-route + global). Apply cả blueprint = nhiều call → cần xử lý tuần tự/hàng đợi, tôn trọng header `Retry-After`.
7. **Một số thứ vẫn phải làm thủ công / hạn chế qua bot:** ví dụ vài cài đặt community nâng cao, một số thao tác cần quyền chủ sở hữu. → phần này ta *hướng dẫn* thay vì tự làm.

### Intents & permission bot cần (để lên plan cấu hình)
- **Gateway intents:** `Guilds` (bắt buộc, đủ cho quản trị cấu trúc); `GuildMembers` (privileged — cần nếu thao tác theo member); `MessageContent` (privileged — chỉ nếu đọc nội dung tin nhắn).
- **Bot permissions:** `Manage Roles`, `Manage Channels`, `Manage Guild` (cho onboarding/template), và tùy tính năng: `Kick/Ban/Moderate Members`, `Manage Webhooks`, `Manage Emojis`, `View Channel`, `Send Messages`.
- **Least-privilege:** *không* dùng Administrator (khác với khuyến nghị "cho nhanh" của nhiều repo).

---

## D. Khoảng trống → cơ hội khác biệt của dự án ta

Tất cả MCP hiện có là **wrapper API không có ý kiến**. Chưa cái nào:
- Nhận diện **loại server** và đề xuất **blueprint** phù hợp.
- **Hỏi khám phá** nhu cầu trước khi dựng (hành xử như chuyên gia tư vấn).
- **Apply nguyên khung** (role + category + kênh + overwrite + onboarding) từ một blueprint đã duyệt trong một luồng.
- **Audit least-privilege** và cảnh báo rủi ro (Administrator, kênh staff lộ, announcement ai cũng đăng).
- Xuất **tài liệu bàn giao**.

→ Định vị dự án: **"lớp chuyên gia" đặt trên bộ tool wrapper.** Ta vẫn cần bộ tool nền (phần B) làm "bàn tay", nhưng giá trị nằm ở "bộ não" blueprint + tư vấn (đã mô tả ở [02](02-nhu-cau-theo-loai-server.md), [03](03-kien-thuc-chuyen-gia.md), [04](04-quy-trinh-tu-van.md)).

**Gợi ý tái sử dụng:** có thể học/tham chiếu trực tiếp `aj-geddes/discord-agent-mcp` (TS+discord.js) cho lớp bàn tay, và bổ sung lớp bộ não của riêng ta.

---

## Nguồn
- GitHub: SaseQ/discord-mcp, barryyip0625/mcp-discord, ExilProductions/discord-mcp, v-3/discordmcp, IQAIcom/mcp-discord, aj-geddes/discord-agent-mcp.
- Discord Developer Docs — *Guild Resource* (Modify Guild Onboarding: `PUT /guilds/{id}/onboarding`, ràng buộc ≥7/≥5 default channels; template sync), *Permissions*.
- discord.js docs — `GuildOnboardingPrompt`.
- discord-api-docs issues #6887, #6320 (chi tiết tham số onboarding); ghi chú giới hạn `parent_id` khi tạo guild & community feature.

*(Tổng hợp tháng 7/2026 — kiểm chứng lại endpoint/ràng buộc tại thời điểm code vì API có thể đổi.)*
