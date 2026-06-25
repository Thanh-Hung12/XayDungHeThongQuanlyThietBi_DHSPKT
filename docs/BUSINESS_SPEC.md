# DHSPKT Asset Hub — Sổ tay nghiệp vụ

> **Dự án**: Hệ thống Quản lý Thiết bị — Trường Đại học Sư phạm Kỹ thuật  
> **Mục đích**: Quản lý thiết bị từ lúc mua về cho đến khi thanh lý  
> **Phiên bản**: 0.1.0

---

## 1. Ai sử dụng hệ thống? (Phân quyền)

Có **5 nhóm người dùng**, mỗi nhóm được làm những việc khác nhau:

| Nhóm | Quyền làm gì? |
|------|---------------|
| **Quản trị viên** (ADMIN) | Được làm tất cả — quản lý người dùng, xem báo cáo, duyệt phiếu |
| **Trưởng khoa** (TRUONG_KHOA) | Quyền cơ bản + xem báo cáo thống kê |
| **Thủ kho** (THU_KHO) | Quyền cơ bản + lập phiếu nhập thiết bị |
| **Giảng viên** (GIANG_VIEN) | Quyền cơ bản — có thể mượn thiết bị |
| **Sinh viên** (SINH_VIEN) | Quyền cơ bản — có thể mượn thiết bị |

> **Quyền cơ bản** gồm: xem tổng quan, quản lý thiết bị, bảo trì, kiểm kê, thanh lý, phân bổ, mượn trả, nhật ký, cài đặt.

---

## 2. Các trang trong hệ thống

### 2.1 Trang đăng nhập & bảo mật
- **Đăng nhập** (/login): Dùng email + mật khẩu. Có thể bật thêm bảo mật 2 lớp qua ứng dụng Google Authenticator.
- **Quên mật khẩu** (/forgot-password): Gửi email để đặt lại mật khẩu.

### 2.2 Bảng điều khiển (/dashboard)
📍 Ai cũng xem được.
- Xem nhanh số liệu: tổng thiết bị, thiết bị đang bảo trì, phiếu mượn chờ duyệt, tổng giá trị tài sản.
- Danh sách bảo trì gần đây.

### 2.3 Quản lý thiết bị (/dashboard/thiet-bi)
📍 Ai cũng dùng được.
- **Thêm / Sửa / Xoá** thông tin thiết bị: mã, tên, mô tả, thông số kỹ thuật, số serial, năm nhập, giá trị, bảo hành, danh mục, nhà cung cấp, khoa, phòng.
- **Nhập từ Excel**: Tải file mẫu, điền dữ liệu, upload lên hệ thống (có kiểm tra lỗi).
- **Xuất Excel**: Tải danh sách thiết bị ra Excel.
- Bảng có thể lọc và sắp xếp.

### 2.4 Phiếu nhập (/dashboard/phieu-nhap)
📍 Ai cũng xem được, nhưng **chỉ Quản trị viên và Thủ kho** mới được tạo/sửa.
- Tạo phiếu nhập khi mua thiết bị mới: chọn nhà cung cấp, nhập danh sách thiết bị kèm số lượng, đơn giá.
- Trạng thái phiếu: Chờ duyệt → Đã duyệt / Từ chối → Hoàn tất.

### 2.5 Phân bổ (/dashboard/phan-bo)
📍 Ai cũng dùng được.
- Điều chuyển thiết bị giữa các khoa, phòng ban.
- Xem lịch sử di chuyển của từng thiết bị.

### 2.6 Bảo trì (/dashboard/bao-tri)
📍 Ai cũng dùng được.
- Tạo phiếu bảo trì: chọn thiết bị, loại bảo trì, mô tả vấn đề, gán kỹ thuật viên, ngày bắt đầu, chi phí.
- Đánh dấu hoàn thành khi sửa xong.
- Xem tổng quan: bao nhiêu phiếu đang xử lý, đã hoàn thành.

### 2.7 Kiểm kê (/dashboard/kiem-ke)
📍 Ai cũng dùng được.
- Tạo đợt kiểm kê: hệ thống tự động liệt kê tất cả thiết bị chưa thanh lý.
- Từng người kiểm tra thực tế: chọn trạng thái (Tốt / Hỏng / Đang bảo trì / Đã thanh lý), ghi chú, xác nhận.
- Khi xác nhận hết thì đóng đợt kiểm kê.

### 2.8 Thanh lý (/dashboard/thanh-ly)
📍 Ai cũng dùng được.
- Đánh dấu thiết bị đã thanh lý (không còn sử dụng).

### 2.9 Mượn trả (/dashboard/muon-tra)
📍 Ai cũng mượn được. **Quản trị viên, Thủ kho, Trưởng khoa** mới có quyền duyệt.
- Người dùng tạo phiếu mượn: chọn thiết bị, ghi mục đích, ngày mượn, ngày trả dự kiến.
- Cán bộ duyệt (chấp nhận hoặc từ chối).
- Khi trả, ghi nhận tình trạng thiết bị.
- Trạng thái phiếu: Chờ duyệt → Đã duyệt / Từ chối → Đã mượn → Đã trả / Quá hạn.

### 2.10 Nhật ký hoạt động (/dashboard/nhat-ky-hoat-dong)
📍 Ai cũng xem được (chỉ xem, không sửa được).
- Ghi lại tất cả hành động quan trọng: ai làm gì, lúc nào, từ đâu (IP).
- Giúp truy vết khi có vấn đề.

### 2.11 Báo cáo (/dashboard/bao-cao)
📍 **Chỉ Quản trị viên và Trưởng khoa** mới xem được.
- Biểu đồ, thống kê: tình trạng thiết bị, phân bổ theo khoa, danh mục.

### 2.12 Quản trị người dùng (/dashboard/quan-tri)
📍 **Chỉ Quản trị viên** mới vào được.
- Tạo tài khoản mới, gán vai trò.
- Khoá / Mở tài khoản.
- Đặt lại mật khẩu cho người khác.

### 2.13 Cài đặt cá nhân (/dashboard/cai-dat)
📍 Ai cũng dùng được.
- Xem thông tin tài khoản (tên, email, vai trò, mã số).
- Đổi mật khẩu.
- Bật/tắt bảo mật 2 lớp (2FA).

---

## 3. Các loại dữ liệu chính

| Dữ liệu | Ý nghĩa |
|---------|---------|
| Người dùng | Tài khoản của cán bộ, giảng viên, sinh viên |
| Khoa | Các khoa trong trường (VD: Khoa CNTT, Khoa Điện) |
| Phòng | Các phòng ban, phòng học, phòng thí nghiệm |
| Danh mục thiết bị | Nhóm thiết bị (VD: Máy tính, Máy chiếu, Máy in) |
| Nhà cung cấp | Đơn vị bán thiết bị cho trường |
| Thiết bị | Từng thiết bị cụ thể: mã, tên, serial, vị trí, tình trạng |
| Lịch sử di chuyển | Ghi lại mỗi lần thiết bị được chuyển đi nơi khác |
| Phiếu mượn | Ghi nhận việc mượn / trả thiết bị |
| Phiếu bảo trì | Ghi nhận việc bảo trì, sửa chữa thiết bị |
| Đợt kiểm kê | Đợt kiểm tra toàn bộ thiết bị định kỳ |
| Phiếu nhập | Ghi nhận khi mua thiết bị mới về nhập kho |
| Nhật ký hoạt động | Sổ theo dõi mọi hành động trong hệ thống |

---

## 4. Vòng đời của thiết bị

Mới nhập → Tốt ──→ Bảo trì ──→ Tốt (sửa xong)
                 │
                 └──→ Hỏng ──────→ Thanh lý
                 │
                 └──→ Chờ duyệt (khi nhập mới)

---

## 5. Quy tắc nghiệp vụ chính

1. **Mượn thiết bị**: Người dùng tạo phiếu → Cán bộ duyệt / từ chối → Khi trả thì ghi nhận tình trạng.
2. **Bảo trì**: Lập phiếu → Gán kỹ thuật viên → Hoàn thành + ghi nhận chi phí.
3. **Kiểm kê**: Quản trị viên tạo đợt → Hệ thống tự động kéo danh sách thiết bị → Nhân viên kiểm tra từng cái → Đóng đợt.
4. **Nhập kho**: Thủ kho / Quản trị viên lập phiếu nhập → Duyệt qua các bước → Hoàn tất.
5. **Nhật ký**: Mọi hành động quan trọng đều được ghi lại để dễ truy vết.
6. **Bảo mật 2 lớp**: Người dùng có thể bật xác thực qua ứng dụng điện thoại; nếu bật thì khi đăng nhập phải nhập thêm mã.
