## Context

P1/P2 đã cho MCP đủ đọc và ghi cấu trúc. P3 thêm lớp "bộ não": blueprint dữ liệu + tư vấn + apply. Tri thức nguồn: [docs/02](../../../docs/02-nhu-cau-theo-loai-server.md) (blueprint 6 loại), [docs/03](../../../docs/03-kien-thuc-chuyen-gia.md) (nguyên tắc), [docs/04](../../../docs/04-quy-trinh-tu-van.md) (khám phá). Định hướng cấu trúc dữ liệu đã phác ở [docs/05](../../../docs/05-dinh-huong-mcp.md).

Roadmap yêu cầu: bộ não gọi lại lớp bàn tay (một điểm kiểm soát quyền/rate limit). Hiện lõi ghi P2 nằm trong handler tool → cần tách thành service functions để `apply_blueprint` tái dùng.

## Goals / Non-Goals

**Goals:**
- Blueprint là **dữ liệu typed**, thêm blueprint mới không phải sửa logic.
- 2 blueprint mẫu chất lượng: game + giáo dục.
- Tư vấn: recommend theo mục đích/quy mô + bộ câu hỏi khám phá.
- `propose_changes` (diff) và `apply_blueprint` (idempotent, dryRun) đi qua service P2.

**Non-Goals:**
- Không cấu hình Community/Onboarding thật (P4) — blueprint chỉ mang dữ liệu onboarding.
- Không audit least-privilege (P4).
- Không đủ 6 blueprint (mở rộng ở P5); P3 làm 2 mẫu + khung dễ thêm.

## Decisions

### D1: Blueprint là dữ liệu TypeScript typed trong `src/blueprints/`
```
src/blueprints/
  schema.ts        # interface Blueprint, BlueprintRole, BlueprintCategory, BlueprintChannel
  game.ts          # blueprint game
  education.ts     # blueprint giáo dục
  index.ts         # registry: Map<id, Blueprint> + getBlueprint/listBlueprints
```
- Model tối giản nhưng đủ: role {name,color?,hoist?,permissions?}; channel {name,type,topic?,announcementOnly?,private?}; category {name,channels[]}; kèm recommendedBots[], securityNotes[], onboardingHint?, matchKeywords[].
- `announcementOnly` → deny SendMessages cho @everyone; `private` → deny ViewChannel cho @everyone. Đây là cách blueprint diễn đạt quyền mà không cần liệt kê overwrite thô.
- *Alternative*: YAML/JSON ngoài code → để P5; TS typed cho type-safety và đơn giản trước.

### D2: Tách lõi ghi P2 thành service `src/discord/structureOps.ts`
- Hàm thuần: `ensureCategory(guild, name)`, `ensureChannel(guild, {name,type,parentId,...})`, `ensureRole(guild, {...})`, `applyChannelPermission(...)` — trả về summary, có biến thể "ensure" (idempotent: tạo nếu chưa có, trả cái đã có nếu có).
- Tool P2 gọi các hàm create/edit tương ứng; `apply_blueprint` gọi các hàm `ensure*`.
- *Vì sao*: một điểm kiểm soát; idempotency tập trung; tránh trùng lặp API call.

### D3: Nhận diện loại server bằng khớp từ khóa
- `recommend_blueprint(purpose, size?, groups?)`: chuẩn hóa purpose, chấm điểm theo `matchKeywords` của từng blueprint; trả blueprint xếp hạng + lý do. Nếu điểm cao nhất dưới ngưỡng → coi là "mơ hồ", trả ứng viên + câu hỏi khám phá.
- Đơn giản, giải thích được; đủ cho 2–6 blueprint. Không cần ML.

### D4: propose_changes = diff theo tên; apply = ensure phần thiếu
- Diff dựa trên **tên** (role name, category name, channel name trong category). Trùng tên = coi như đã có.
- `apply_blueprint` chạy `propose_changes` nội bộ rồi ensure theo thứ tự: categories → channels (gắn parent) → roles → overwrites. `dryRun` trả kế hoạch, không ghi.
- Idempotency nhờ ensure* + diff theo tên.
- *Rủi ro*: trùng tên nhưng khác loại → coi là đã có (chấp nhận ở P3; P5 có thể so sâu hơn).

### D5: Thực thi tuần tự, lỗi giữa chừng báo rõ
- `apply_blueprint` thực thi tuần tự (category trước để có parentId cho channel). Nếu một bước lỗi, dừng và trả lỗi có cấu trúc + danh sách mục đã tạo thành công (để người dùng biết trạng thái). Dựa REST queue discord.js cho rate limit.

## Risks / Trace-offs

- **Refactor P2 làm hồi quy** → giữ nguyên chữ ký tool + hành vi; smoke test lại 19 tool sau refactor.
- **Diff theo tên thô** → đủ cho P3; ghi rõ giới hạn; cải thiện ở P5 nếu cần.
- **apply nửa chừng lỗi** → không rollback (Discord không có transaction); bù bằng idempotency (chạy lại tiếp tục phần thiếu) + báo cáo mục đã tạo.
- **Ràng buộc onboarding (≥7 kênh...)** không áp ở P3 vì chưa cấu hình onboarding; nhưng blueprint nên đủ kênh để P4 bật onboarding không vướng — thiết kế 2 blueprint mẫu với đủ kênh mặc định.

## Open Questions

- `apply_blueprint` có nên tự đặt overwrite cho `private`/`announcementOnly` trong P3, hay để người dùng chạy tool permission riêng? (đề xuất: có, vì thuộc "dựng khung"; vẫn qua service P2)
- Recommend có nên nhận cả tín hiệu quy mô để cảnh báo "cần automation" không? (đề xuất: có, đưa vào phần lý do, không đổi blueprint)
- Ngưỡng "mơ hồ" cho recommend đặt bao nhiêu? (đề xuất: nếu không khớp từ khóa nào rõ → mơ hồ)
