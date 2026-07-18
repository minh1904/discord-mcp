# Định hướng MCP (chưa code)

Tài liệu này **ánh xạ** tri thức chuyên gia sang hình hài của MCP server, để làm cơ sở cho bước code sau. Chưa chốt stack, chưa viết code.

---

## MCP này gồm 2 lớp

1. **Lớp "bộ não" (skill/consultant):** tri thức tư vấn — nhận diện loại server, hỏi khám phá, đề xuất blueprint. Phần lớn nằm ở **prompt/skill + thư viện blueprint** (chính là các file docs này được cấu trúc lại thành dữ liệu).
2. **Lớp "bàn tay" (tools):** các tool gọi Discord API để thực thi — tạo role, category, kênh, permission overwrite, cấu hình onboarding.

---

## Nhóm tool dự kiến (chỉ định hướng)

### A. Đọc / chẩn đoán (read-only)
- `get_server_overview` — liệt kê role, category, kênh, quyền hiện có.
- `audit_permissions` — soi rủi ro (bot/role có Administrator, kênh staff bị lộ, announcement ai cũng đăng được...).

### B. Đề xuất (không đụng server)
- `recommend_blueprint(purpose, size, groups...)` — trả về blueprint (role + kênh + bot + onboarding) từ thư viện ở [02-nhu-cau-theo-loai-server.md](02-nhu-cau-theo-loai-server.md).
- `propose_changes` — so blueprint với hiện trạng → ra danh sách thay đổi để user duyệt.

### C. Thực thi (ghi — cần xác nhận)
- `create_role`, `reorder_roles`
- `create_category`, `create_channel`, `sync_channel_to_category`
- `set_permission_overwrite`
- `configure_onboarding` (default channels, questions → role/kênh) *nếu API hỗ trợ ở thời điểm code*
- `apply_blueprint` — dựng nguyên khung từ một blueprint đã duyệt.

> **Ranh giới quan trọng:** MCP **không** tự cài bot bên thứ ba (MEE6, Carl-bot, Collab.Land...) — việc đó là OAuth do chính user thực hiện trên Discord. MCP chỉ **đề xuất + hướng dẫn**, và dựng sẵn kênh/role để bot hoạt động.

---

## Hành vi "chuyên gia" bắt buộc

MCP phải hành xử như tư vấn, không như cỗ máy thực thi mù:
1. **Hỏi trước khi dựng** nếu thiếu thông tin mục đích/quy mô (xem [04-quy-trinh-tu-van.md](04-quy-trinh-tu-van.md)).
2. **Trình blueprint & chờ duyệt** trước khi thực thi thay đổi ghi.
3. **An toàn mặc định:** least-privilege, không gợi ý Administrator, tự thêm kênh staff + gate.
4. **Giải thích lý do** cho mỗi đề xuất ("thêm voice team room vì server game xoay quanh chơi cùng").
5. **Xuất tài liệu bàn giao** sau khi dựng.

---

## Dữ liệu blueprint (định dạng gợi ý)

Mỗi blueprint có thể mô tả dạng khai báo (JSON/YAML) để tool `apply_blueprint` đọc:

```yaml
name: education
roles:
  - { name: Teacher, color: "#E67E22", hoist: true, perms: [ManageChannels, ManageMessages, KickMembers] }
  - { name: Mentor,  color: "#3498DB", hoist: true, perms: [ManageMessages] }
  - { name: Student, color: "#2ECC71" }
categories:
  - name: THÔNG TIN
    channels:
      - { name: welcome, type: text, everyone_send: false }
      - { name: announcements, type: text, everyone_send: false }
  - name: HỌC TẬP
    channels:
      - { name: hoi-dap, type: text }
      - { name: nop-bai, type: text }
  - name: CO-WORKING
    channels:
      - { name: Study Room, type: voice }
onboarding:
  default_channels: [welcome, announcements, hoi-dap]
  questions:
    - text: "Bạn học môn nào?"
      options:
        - { label: Toán, roles: [Math], channels: [toan] }
        - { label: Tiếng Anh, roles: [English], channels: [anh-van] }
recommended_bots:
  - { name: Sesh, purpose: "Nhắc lịch & RSVP sự kiện" }
  - { name: Carl-bot, purpose: "Reaction role + logging" }
security_notes:
  - "Không cấp Administrator cho bot"
  - "Kênh lớp riêng tư theo role"
```

> Đây chỉ là **hình dung cấu trúc dữ liệu**, không phải chốt schema. Sẽ tinh chỉnh khi code.

---

## Stack đã chốt

**TypeScript + discord.js** (chạy trên `@modelcontextprotocol/sdk`), **runtime & package manager: Bun** (chạy TS trực tiếp, tự nạp `.env`).

Lý do: là mặc định của hệ MCP (SDK chính thức viết bằng TS, nhiều ví dụ/cộng đồng nhất); `discord.js` là thư viện Discord mạnh & cập nhật nhất, hỗ trợ đầy đủ role/category/channel/permission overwrite và API Community/Onboarding; hợp kiến trúc 2 lớp (blueprint JSON/YAML + tool discord.js) trong cùng một codebase.

**Tham chiếu học pattern:** `aj-geddes/discord-agent-mcp` (71 tool, TS + discord.js) — gần với thứ dự án định làm.

Đã cân nhắc & loại: Python + discord.py (ổn nhưng ít ví dụ MCP hơn), Java + JDA (mạnh nhưng nặng, lệch mạch MCP phổ thông).

## Những câu còn cần chốt trước khi code

1. **Phạm vi v1:** làm read-only + recommend trước, hay làm luôn cả apply (tạo role/kênh thật)?
2. **Blueprint ưu tiên:** làm trước loại nào (game? học tập? cả 6)?
3. **Cấu hình bot Discord:** dùng bot token của user; cần hướng dẫn tạo application + scope/intent gì (`guilds`, `Manage Roles`, `Manage Channels`...).
4. **Onboarding qua API:** kiểm tra mức hỗ trợ của Discord API tại thời điểm code (một số cấu hình community có thể phải làm thủ công).
