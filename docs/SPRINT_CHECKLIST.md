# Checklist sprint - Hoàn thiện flow quản lý thiết bị

Tài liệu này chia backlog thành từng sprint để có thể cập nhật dần trong quá trình phát triển. Mỗi mục được viết theo dạng checklist để team có thể tick sau khi hoàn thành.

---

## Nguyên tắc sử dụng

- Đánh dấu `[x]` khi hoàn thành.
- Thêm ngày hoàn thành, người phụ trách, ghi chú ngay bên dưới nếu cần.
- Ưu tiên hoàn thành theo thứ tự `Sprint 1 -> Sprint 2 -> Sprint 3...`.
- Nếu có task phát sinh, thêm vào mục `Backlog bổ sung` cuối file.

---

## Sprint 1 - Chốt nền tảng quản lý thiết bị

**Ưu tiên bảo vệ:** Trung bình

**Mục tiêu**

- Chốt các chức năng cốt lõi để quản lý danh mục thiết bị ổn định và dễ bảo trì lâu dài.

**Checklist**

- [ ] Rà soát và chuẩn hóa các trạng thái thiết bị trong toàn hệ thống.
- [ ] Thống nhất vòng đời thiết bị: mới nhập, sẵn sàng sử dụng, đang sử dụng, đang mượn, bảo trì, hỏng, chờ thanh lý, đã thanh lý.
- [ ] Kiểm tra tất cả API và UI đang đọc/ghi đúng bộ trạng thái mới.
- [ ] Chuẩn hóa validation cho `ThietBi` tại UI và API.
- [ ] Bổ sung ràng buộc trùng lặp cho `maThietBi` và `serialNumber`.
- [ ] Kiểm tra lại phân quyền `xem / tạo / sửa / xóa` trên module thiết bị.
- [ ] Chuyển hard delete sang soft delete nếu hiện tại còn xóa vật lý.
- [ ] Bổ sung hiển thị lịch sử thay đổi cơ bản trên trang chi tiết thiết bị.
- [ ] Chốt thông điệp lỗi và thông báo thành công nhất quán cho module thiết bị.
- [ ] Viết tài liệu quy ước nghiệp vụ cho module thiết bị.

**Kết quả mong đợi**

- Module thiết bị ổn định, nhất quán dữ liệu, sẵn sàng mở rộng sang các quy trình nghiệp vụ khác.

**Case có thể test demo**

- [ ] Tạo mới một thiết bị với đầy đủ thông tin và kiểm tra hiển thị trong danh sách.
- [ ] Sửa thông tin một thiết bị hiện có và kiểm tra dữ liệu được cập nhật đúng.
- [ ] Kiểm tra chặn tạo thiết bị khi trùng `maThietBi` hoặc `serialNumber`.
- [ ] Kiểm tra phân quyền: tài khoản không phải `ADMIN` / `THU_KHO` không thể thêm hoặc sửa thiết bị.
- [ ] Mở trang chi tiết thiết bị và xác nhận có hiển thị lịch sử thay đổi cơ bản.

---

## Sprint 2 - Hoàn thiện nhập kho và import dữ liệu

**Ưu tiên bảo vệ:** Cao

**Mục tiêu**

- Hoàn thiện flow tiếp nhận tài sản mới vào hệ thống từ nhập tay hoặc import file.

**Checklist**

- [x] Hoàn thiện flow tạo phiếu nhập kho với danh sách dòng thiết bị.
- [x] Bổ sung workflow trạng thái phiếu nhập: chờ duyệt, đã duyệt, từ chối, hoàn tất.
- [x] Hiển thị lý do từ chối khi phiếu nhập bị reject.
- [x] Bổ sung role được phê duyệt phiếu nhập.
- [x] Tự động cập nhật thiết bị sau khi phiếu nhập được hoàn tất.
- [x] Hoàn thiện import Excel với báo cáo dòng lỗi chi tiết.
- [x] Kiểm tra file sai định dạng, thiếu cột, sai dữ liệu, trùng mã.
- [x] Bổ sung file mẫu import và hướng dẫn mapping cột.
- [ ] Bổ sung export Excel danh sách thiết bị theo bộ lọc hiện tại. _(Chưa triển khai trong sprint này)_
- [x] Ghi `AuditLog` đầy đủ cho tạo, sửa, duyệt, từ chối, import.

**Kết quả mong đợi**

- Tài sản mới có thể vào hệ thống theo một quy trình rõ ràng, có kiểm soát và dễ đối soát.

**Case có thể test demo**

- [ ] Tạo một phiếu nhập mới với nhiều dòng thiết bị và kiểm tra tổng tiền tính đúng.
- [ ] Chuyển phiếu nhập từ `CHO_DUYET` sang `DA_DUYET` rồi `HOAN_TAT`.
- [ ] Từ chối một phiếu nhập và kiểm tra lý do từ chối được lưu/hiển thị.
- [ ] Hoàn tất phiếu nhập và xác nhận thiết bị mới được tạo tự động trong danh sách thiết bị.
- [ ] Import một file Excel hợp lệ và kiểm tra số dòng thành công.
- [ ] Import một file Excel lỗi định dạng/cột/mã trùng và kiểm tra danh sách lỗi trả về.

---

## Sprint 3 - Hoàn thiện phân bổ và điều chuyển

**Ưu tiên bảo vệ:** Cao

**Mục tiêu**

- Biến module phân bổ từ trang overview thành quy trình điều chuyển thiết bị thực thụ.

**Checklist**

- [ ] Tạo chức năng lập phiếu điều chuyển thiết bị.
- [ ] Cho phép chọn `từ khoa / từ phòng` và `đến khoa / đến phòng`.
- [ ] Bổ sung người bàn giao, người tiếp nhận, lý do điều chuyển.
- [ ] Ghi lịch sử di chuyển cho mỗi lần phân bổ.
- [ ] Cập nhật vị trí hiện tại của thiết bị sau khi điều chuyển.
- [ ] Bổ sung bộ lọc xem phân bổ theo khoa, phòng, người sử dụng, trạng thái.
- [ ] Hiển thị timeline phân bổ trên trang chi tiết thiết bị.
- [ ] Chặn điều chuyển với thiết bị đang bảo trì, đang thanh lý, đã thanh lý nếu nghiệp vụ yêu cầu.
- [ ] Bổ sung xác nhận 2 bước cho điều chuyển nếu liên quan tài sản giá trị cao.
- [ ] Ghi `AuditLog` cho tạo phiếu, cập nhật, xác nhận, hủy.

**Kết quả mong đợi**

- Có workflow phân bổ rõ ràng, truy vết được và đúng với nghiệp vụ điều chuyển tài sản.

**Case có thể test demo**

- [ ] Tạo phiếu điều chuyển thiết bị từ một phòng sang phòng khác.
- [ ] Kiểm tra vị trí hiện tại của thiết bị được cập nhật sau điều chuyển.
- [ ] Mở chi tiết thiết bị và xác nhận timeline/lịch sử di chuyển xuất hiện đúng.
- [ ] Lọc danh sách phân bổ theo khoa hoặc phòng và kiểm tra kết quả.
- [ ] Thử điều chuyển thiết bị đang ở trạng thái không hợp lệ và kiểm tra hệ thống chặn thao tác.

---

## Sprint 4 - Hoàn thiện mượn trả và sử dụng thiết bị

**Ưu tiên bảo vệ:** Trung bình

**Mục tiêu**

- Đảm bảo thiết bị được mượn, duyệt, trả và theo dõi tình trạng đúng quy trình.

**Checklist**

- [ ] Hoàn thiện tạo phiếu mượn với mục đích, ngày mượn, ngày trả dự kiến.
- [ ] Bổ sung workflow phê duyệt phiếu mượn.
- [ ] Bổ sung role duyệt: admin, thủ kho, trưởng khoa theo đúng nghiệp vụ.
- [ ] Khi duyệt mượn, cập nhật trạng thái thiết bị phù hợp.
- [ ] Hoàn thiện flow trả thiết bị và ghi nhận tình trạng khi trả.
- [ ] Tự động đánh dấu quá hạn cho phiếu mượn trễ hạn.
- [ ] Hoàn thiện cron/reminder nhắc hạn trả.
- [ ] Chặn mượn với thiết bị đang hỏng, bảo trì, thanh lý.
- [ ] Bổ sung lịch sử mượn trả trong trang chi tiết thiết bị.
- [ ] Ghi `AuditLog` đầy đủ cho tạo, duyệt, từ chối, nhận trả.

**Kết quả mong đợi**

- Flow mượn trả hoạt động đầy đủ, hạn chế xung đột trạng thái và theo dõi được sử dụng thiết bị.

**Case có thể test demo**

- [ ] Tạo một phiếu mượn với ngày mượn và ngày trả dự kiến hợp lệ.
- [ ] Duyệt phiếu mượn bằng tài khoản có quyền và kiểm tra trạng thái thiết bị thay đổi.
- [ ] Từ chối phiếu mượn và kiểm tra trạng thái phiếu cập nhật đúng.
- [ ] Thực hiện trả thiết bị và ghi nhận tình trạng khi trả.
- [ ] Kiểm tra hệ thống không cho mượn thiết bị đang bảo trì hoặc đã thanh lý.

---

## Sprint 5 - Hoàn thiện bảo trì và bảo hành

**Ưu tiên bảo vệ:** Trung bình

**Mục tiêu**

- Đưa module bảo trì thành công cụ theo dõi vấn đề, chi phí và tình trạng xử lý.

**Checklist**

- [ ] Hoàn thiện tạo phiếu bảo trì và cập nhật kết quả xử lý.
- [ ] Gán kỹ thuật viên / đơn vị sửa chữa cho từng phiếu.
- [ ] Tự động cập nhật trạng thái thiết bị sang `BAO_TRI` khi mở phiếu.
- [ ] Tự động khôi phục trạng thái phù hợp khi bảo trì hoàn tất.
- [ ] Bổ sung theo dõi chi phí bảo trì theo thiết bị.
- [ ] Bổ sung cảnh báo thiết bị bảo trì lặp lại nhiều lần.
- [ ] Bổ sung nhắc hạn bảo hành / bảo trì định kỳ.
- [ ] Hiển thị lịch sử bảo trì đầy đủ trên trang chi tiết thiết bị.
- [ ] Bổ sung file đính kèm: biên bản, hóa đơn, ảnh hiện trạng nếu cần.
- [ ] Ghi `AuditLog` đầy đủ cho tạo, sửa, hoàn tất bảo trì.

**Kết quả mong đợi**

- Theo dõi được sức khỏe tài sản và chi phí bảo trì trong suốt vòng đời sử dụng.

**Case có thể test demo**

- [ ] Tạo mới một phiếu bảo trì cho thiết bị đang hoạt động.
- [ ] Kiểm tra trạng thái thiết bị tự động chuyển sang `BAO_TRI`.
- [ ] Cập nhật kết quả bảo trì và đánh dấu hoàn tất.
- [ ] Kiểm tra trạng thái thiết bị sau khi hoàn tất bảo trì.
- [ ] Mở trang chi tiết thiết bị và xác nhận lịch sử bảo trì được hiển thị.

---

## Sprint 6 - Hoàn thiện kiểm kê

**Ưu tiên bảo vệ:** Cao

**Mục tiêu**

- Chốt quy trình kiểm kê thực tế và đối chiếu với dữ liệu hệ thống.

**Checklist**

- [ ] Hoàn thiện tạo đợt kiểm kê theo phạm vi khoa, phòng, danh mục.
- [ ] Sinh danh sách thiết bị cần kiểm kê tự động theo phạm vi.
- [ ] Bổ sung nhập tình trạng thực tế, ghi chú, xác nhận từng item.
- [ ] Hoàn thiện xử lý chênh lệch giữa dữ liệu hệ thống và thực tế.
- [ ] Cho phép lưu nháp đợt kiểm kê trước khi đóng.
- [ ] Khóa đợt kiểm kê sau khi hoàn tất.
- [ ] Bổ sung tổng hợp kết quả kiểm kê: tốt, hỏng, bảo trì, thanh lý, không tìm thấy.
- [ ] Cho phép xuất biên bản / báo cáo kiểm kê.
- [ ] Cập nhật trạng thái thiết bị nếu kết quả kiểm kê xác nhận thay đổi hợp lệ.
- [ ] Ghi `AuditLog` đầy đủ cho tạo đợt, cập nhật item, đóng đợt.

**Kết quả mong đợi**

- Kiểm kê trở thành quy trình đối soát dữ liệu, không chỉ là một màn hình nhập trạng thái.

**Case có thể test demo**

- [ ] Tạo một đợt kiểm kê mới theo phạm vi khoa hoặc phòng.
- [ ] Kiểm tra hệ thống sinh danh sách thiết bị cần kiểm kê.
- [ ] Cập nhật tình trạng thực tế và ghi chú cho từng item kiểm kê.
- [ ] Xác nhận item kiểm kê và kiểm tra trạng thái lưu thành công.
- [ ] Hoàn tất/đóng đợt kiểm kê và kiểm tra không cho sửa tiếp.

---

## Sprint 7 - Hoàn thiện thanh lý

**Ưu tiên bảo vệ:** Cao

**Mục tiêu**

- Mở rộng module thanh lý từ trang xem danh sách thành quy trình nghiệp vụ đầy đủ.

**Checklist**

- [ ] Tạo đề nghị thanh lý cho thiết bị.
- [ ] Bổ sung lý do thanh lý, tình trạng hiện tại, giá trị còn lại.
- [ ] Bổ sung quy trình duyệt thanh lý.
- [ ] Tạo biên bản thanh lý / mã hồ sơ thanh lý.
- [ ] Cập nhật trạng thái `CHO_THANH_LY` và `DA_THANH_LY` đúng lifecycle.
- [ ] Chặn mượn, phân bổ, sửa nghiệp vụ với thiết bị đã thanh lý.
- [ ] Hiển thị danh sách thanh lý kèm thống kê tổng giá trị, số lượng, theo khoa/phòng.
- [ ] Bổ sung file đính kèm cho thanh lý nếu cần.
- [ ] Hiển thị lịch sử thanh lý trong timeline thiết bị.
- [ ] Ghi `AuditLog` đầy đủ cho tạo, duyệt, hoàn tất thanh lý.

**Kết quả mong đợi**

- Thanh lý trở thành một quy trình có kiểm soát, truy vết được và không gây sai lệch dữ liệu tài sản.

**Case có thể test demo**

- [ ] Tạo một đề nghị thanh lý cho thiết bị hỏng hoặc không còn sử dụng.
- [ ] Duyệt thanh lý và kiểm tra trạng thái thiết bị đổi đúng lifecycle.
- [ ] Kiểm tra thiết bị đã thanh lý không còn mượn hoặc điều chuyển được.
- [ ] Mở trang thanh lý và xác nhận thống kê/danh sách hiển thị đúng.
- [ ] Mở chi tiết thiết bị và xác nhận có lịch sử thanh lý.

---

## Sprint 8 - Báo cáo, dashboard và audit

**Ưu tiên bảo vệ:** Cao

**Mục tiêu**

- Hoàn thiện lớp quản trị để theo dõi toàn bộ vòng đời tài sản.

**Checklist**

- [ ] Bổ sung dashboard KPI: tổng thiết bị, đang sử dụng, bảo trì, hỏng, chờ thanh lý, đã thanh lý.
- [ ] Bổ sung báo cáo theo khoa, phòng, danh mục, nhà cung cấp.
- [ ] Bổ sung báo cáo chi phí bảo trì theo thời gian.
- [ ] Bổ sung báo cáo thiết bị quá hạn mượn trả.
- [ ] Bổ sung báo cáo chênh lệch kiểm kê.
- [ ] Bổ sung export báo cáo ra Excel/CSV.
- [ ] Hoàn thiện `AuditLog` với bộ lọc theo thời gian, tài khoản, hành động, đối tượng.
- [ ] Nếu cần, bổ sung export nhật ký hoạt động.
- [ ] Xây dựng timeline hợp nhất cho từng thiết bị.
- [ ] Kiểm tra lại toàn bộ phân quyền xem báo cáo và nhật ký.

**Kết quả mong đợi**

- Người quản lý có đủ dữ liệu để ra quyết định và truy vết được mọi biến động quan trọng.

**Case có thể test demo**

- [ ] Mở dashboard và kiểm tra các KPI chính hiển thị đúng dữ liệu hiện tại.
- [ ] Lọc báo cáo theo khoa/phòng/danh mục và kiểm tra kết quả thay đổi đúng.
- [ ] Xuất báo cáo ra Excel/CSV nếu chức năng đã hoàn thành.
- [ ] Mở nhật ký hoạt động và lọc theo tài khoản hoặc hành động.
- [ ] Chọn một thiết bị và kiểm tra timeline tổng hợp đầy đủ các biến động.

---

## Sprint 9 - Bảo mật, vận hành và chất lượng hệ thống

**Ưu tiên bảo vệ:** Thấp

**Mục tiêu**

- Nâng cấp hệ thống để sẵn sàng vận hành thực tế và an toàn hơn.

**Checklist**

- [ ] Hoàn thiện auth flow và thông điệp lỗi cho login, logout, đổi mật khẩu, 2FA.
- [ ] Bổ sung khóa tài khoản tạm thời sau nhiều lần đăng nhập sai.
- [ ] Bổ sung reset 2FA cho admin hoặc quy trình an toàn tự phục hồi.
- [ ] Kiểm tra phân quyền ở tất cả API, không chỉ UI.
- [ ] Bổ sung optimistic locking hoặc kiểm tra `updatedAt` để tránh ghi đè dữ liệu.
- [ ] Bổ sung logging lỗi hệ thống và thông báo thân thiện cho người dùng.
- [ ] Hoàn thiện test cho các flow nghiệp vụ chính.
- [ ] Bổ sung seed/demo data cho test nghiệp vụ.
- [ ] Chuẩn hóa tài liệu hướng dẫn sử dụng và hướng dẫn vận hành.
- [ ] Tổng rà soát các route, page, action và migration còn đang tạm hoặc placeholder.

**Kết quả mong đợi**

- Hệ thống đạt mức sẵn sàng cao hơn để demo, nghiệm thu hoặc đưa vào vận hành nội bộ.

**Case có thể test demo**

- [ ] Đăng nhập sai nhiều lần và kiểm tra cơ chế khóa tạm thời nếu đã triển khai.
- [ ] Đăng nhập với tài khoản có 2FA và xác nhận luồng nhập mã hoạt động đúng.
- [ ] Kiểm tra tài khoản không có quyền bị chặn ở cả UI và API.
- [ ] Chạy một flow nghiệp vụ chính và xác nhận có log/audit tương ứng.
- [ ] Kiểm tra dữ liệu không bị ghi đè sai khi hai thao tác cập nhật gần nhau.

---

## Backlog bổ sung

- [ ] File đính kèm cho tài sản và chứng từ.
- [ ] In tem QR hàng loạt.
- [ ] Saved filters cho bảng dữ liệu.
- [ ] Notification trong app.
- [ ] Phân quyền chi tiết theo action.
- [ ] API docs cho các route chính.
- [ ] Test E2E cho flow tài sản.
- [ ] Chuẩn hóa naming và encoding tiếng Việt toàn repo.

---

## Mẫu cập nhật tiến độ

Bạn có thể cập nhật bên dưới mỗi sprint theo mẫu:

```md
### Tiến độ Sprint X

- Hoàn thành:
  - ...
- Đang làm:
  - ...
- Vướng mắc:
  - ...
```


