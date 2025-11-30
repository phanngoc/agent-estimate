# Project Requirements

## 1. Init Project

Init Project(project structure, project configuration, ...)
Setup CI
Build layout component (include: overall layout, logo, page header, navigation, footer, etc.)
Build common components (include: button, input, selectbox, etc.)
Configure authentication/authorization (include token/ session management)
Configure app on VN DEV/STG environment
Devs and QAs confirm spec at the first stage
・Clear technical information
・Clear business information

## 2. Đăng nhập

- Điều kiện tiên quyết:
  - Đã đăng ký tài khoản
  - Sử dụng trình duyệt/thiết bị được hỗ trợ
- Trường nhập:
  - ID người dùng hoặc địa chỉ email
  - Mật khẩu
- Kiểm tra nhập liệu:
  - Bắt buộc nhập
  - Giới hạn số lần thử (5 lần)
  - Kiểm tra trạng thái khóa tài khoản
- Luồng xử lý:
  - Xác thực với cơ sở dữ liệu
  - Thành công → Chuyển đến trang chính
  - Thất bại → Hiển thị lỗi / Tăng số lần thử
  - Bị khóa → Hướng dẫn mở khóa
- Xuất/Thông báo:
  - Thông báo thành công / chuyển đến dashboard
  - Mã lỗi khi thất bại
- Ghi log/Giám sát:
  - Ghi lại log thành công/thất bại/khóa (IP, UserAgent, thời gian)
- Xử lý ngoại lệ:
  - Fail-safe khi hệ thống xác thực bên ngoài gặp sự cố

## 3. Đặt lại mật khẩu nếu quên

Điều kiện tiên quyết

- Người dùng đã có tài khoản hợp lệ.
- Truy cập từ thiết bị/trình duyệt được hỗ trợ.
- Địa chỉ email đăng ký còn hiệu lực để nhận liên kết khôi phục.

Trường nhập

- Email (đã đăng ký).
- Mật khẩu mới.
- Xác nhận mật khẩu mới.

Kiểm tra nhập liệu

- Email bắt buộc nhập, phải hợp lệ về định dạng.
- Kiểm tra email có tồn tại trong hệ thống hay không (nếu không, hiển thị thông báo chung chung, tránh lộ thông tin).
- Mật khẩu mới phải tuân thủ chính sách độ mạnh (độ dài tối thiểu, ký tự đặc biệt, chữ hoa/thường…).
- Giới hạn số lần yêu cầu gửi mail reset (ví dụ 3 lần/giờ).
- Link reset trong email chỉ có hiệu lực trong thời gian giới hạn (ví dụ 15 phút).

Luồng xử lý

- Người dùng chọn “Quên mật khẩu” tại màn hình đăng nhập.
- Nhập địa chỉ email.
- Hệ thống kiểm tra email, nếu hợp lệ thì gửi email chứa đường link đặt lại mật khẩu.
- Người dùng mở email, nhấn vào đường link.
- Nhập mật khẩu mới và xác nhận.
- Hệ thống kiểm tra hợp lệ → cập nhật DB.
- Thông báo thành công và điều hướng về màn hình đăng nhập.

Xuất/Thông báo

- Gửi email có đường link reset mật khẩu.
- Hiển thị thông báo thành công sau khi đổi mật khẩu.
- Nếu lỗi: hiển thị thông báo phù hợp (link hết hạn, link không hợp lệ, mật khẩu không đúng chính sách…).

Ghi log/Giám sát

- Ghi log mọi yêu cầu reset mật khẩu (IP, UserAgent, thời gian, trạng thái).
- Ghi nhật ký thay đổi mật khẩu (người dùng, thời gian thực hiện).

Xử lý ngoại lệ

- Nếu dịch vụ email gián đoạn → hiển thị hướng dẫn liên hệ CSKH.
- Nếu tài khoản đang bị khóa → gửi kèm thông báo hướng dẫn mở khóa.

## 4. Hiển thị màn hình chính

### MUST

- Điều kiện tiên quyết:
  - Đã xác thực
- Trường nhập:
  - Không có (có thể lọc/tìm kiếm tuỳ chọn)
- Kiểm tra nhập liệu:
  - Hiển thị tùy theo vai trò
  - Tài khoản ảo.
  - Thông tin cá nhân

- Luồng xử lý:
  - Lấy cấu hình widget theo vai trò
- Xuất/Thông báo:
  - Hiển thị số lượng chưa đọc
  - Hiển thị các hành động tiếp theo
- Ghi log/Giám sát:
  - Log lỗi phía client nếu tải widget thất bại
- Xử lý ngoại lệ:
  - Phát hiện sai khác trong quyền truy cập

### WANT

- Điều kiện tiên quyết:
  - Đã xác thực
- Trường nhập:
  - Không có (có thể lọc/tìm kiếm tuỳ chọn)
- Kiểm tra nhập liệu:
  - Hiển thị tùy theo vai trò
- Luồng xử lý:
  - Lấy cấu hình widget theo vai trò
  - Hiển thị thông báo, tin tức, lối tắt
  - Có chart
- Xuất/Thông báo:
  - Hiển thị số lượng chưa đọc
  - Hiển thị các hành động tiếp theo
- Ghi log/Giám sát:
  - Log lỗi phía client nếu tải widget thất bại
- Xử lý ngoại lệ:
  - Phát hiện sai khác trong quyền truy cập

## 5. Hiển thị thông báo

Điều kiện tiên quyết:

- Đã xác thực (không cho phép thông báo ẩn danh)

Mục nhập:

- Bộ lọc / Danh mục (tùy chọn)

Kiểm tra đầu vào:

- Thời gian công khai / Quyền xem

Luồng xử lý:

- Lấy danh sách → Hiển thị chi tiết → Cập nhật trạng thái đã đọc (thông báo)

Đầu ra / Thông báo:

- Xuất CSV (thông báo là tùy chọn)

Log / Giám sát:

- Giám sát việc xem / đã đọc

Xử lý ngoại lệ:

- Phân trang khi số lượng lớn

## 6. Hiển thị tin tức

1. Điều kiện tiên quyết (Preconditions)

- Người dùng phải được xác thực
- Thông báo không cho phép ẩn danh

2. Mục nhập (Input Items)

- Bộ lọc / Danh mục: Tùy chọn

3. Kiểm tra đầu vào (Input Validation)

- Thời gian công khai: phải nằm trong khoảng hợp lệ
- Quyền xem: chỉ những người dùng được cấp phép mới có thể truy cập

4. Luồng xử lý (Processing Flow)

- Lấy danh sách dữ liệu
- Hiển thị chi tiết
- Cập nhật trạng thái đã đọc (đồng thời phát sinh thông báo nếu có)

5. Đầu ra / Thông báo (Output / Notification)

- Cho phép xuất CSV (thông báo là tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận và kiểm toán các thao tác xem và đánh dấu đã đọc

7. Xử lý ngoại lệ (Exception Handling)

- Khi số lượng dữ liệu lớn, áp dụng cơ chế phân trang

8. Xuất CSV

## 7. Hiển thị nội dung cải thiện kỹ năng tài chính

1. Điều kiện tiên quyết (Preconditions)

- Người dùng phải được xác thực
- Thông báo không cho phép ẩn danh

2. Mục nhập (Input Items)

- Bộ lọc / Danh mục: Tùy chọn

3. Kiểm tra đầu vào (Input Validation)

- Thời gian công khai: phải nằm trong khoảng hợp lệ
- Quyền xem: chỉ những người dùng được cấp phép mới có thể truy cập

4. Luồng xử lý (Processing Flow)

- Lấy danh sách dữ liệu
- Hiển thị chi tiết
- Cập nhật trạng thái đã đọc (đồng thời phát sinh thông báo nếu có)

5. Đầu ra / Thông báo (Output / Notification)

- Dowload file or video

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận và kiểm toán các thao tác xem và đánh dấu đã đọc

7. Xử lý ngoại lệ (Exception Handling)

- Khi số lượng dữ liệu lớn, áp dụng cơ chế phân trang

## 8. Hiển thị thông tin hồ sơ cá nhân

- Điều kiện tiên quyết:
  - Đã xác thực
- Trường nhập:
  - Không có
- Kiểm tra nhập liệu:
  - Kiểm soát quyền hiển thị
- Luồng xử lý:
  - Đọc dữ liệu hồ sơ
  - Hiển thị avatar, họ tên, địa chỉ, liên hệ, ngày sinh, v.v.
- Xuất/Thông báo:
  - Ẩn một phần email / số điện thoại (masking)
- Ghi log/Giám sát:
  - Log truy cập dữ liệu cá nhân (PII)
- Xử lý ngoại lệ:
  - Hiển thị placeholder khi thiếu dữ liệu

## 9. Thay đổi thông tin hồ sơ cá nhân

- Điều kiện tiên quyết:
  - Đã xác thực
- Trường nhập:
  - Ảnh đại diện
  - Họ tên (có giới hạn)
  - Địa chỉ
  - Email
  - Số điện thoại
  - Liên hệ khẩn cấp
- Kiểm tra nhập liệu:
  - Bắt buộc / Định dạng / Số ký tự
  - Kiểm tra trùng email
  - Kích thước / định dạng ảnh
- Luồng xử lý:
  - Nhập → Xác nhận → Lưu
  - Sau khi lưu thì hiển thị ngay
- Xuất/Thông báo:
  - Gửi thông báo thay đổi (qua email)
- Ghi log/Giám sát:
  - Ghi lại lịch sử thay đổi (giá trị cũ/mới, người thực hiện, thời gian)
- Xử lý ngoại lệ:
  - Nếu email chưa xác nhận thì giữ trạng thái chờ hoặc khôi phục

## 10. Thay đổi mật khẩu

- Điều kiện tiên quyết:
  - Đã đăng nhập
- Trường nhập:
  - Mật khẩu hiện tại
  - Mật khẩu mới
  - Nhập lại mật khẩu mới
- Kiểm tra nhập liệu:
  - Khớp với mật khẩu hiện tại
  - Kiểm tra độ mạnh mật khẩu (độ dài, ký tự)
  - Không dùng lại mật khẩu cũ gần đây
- Luồng xử lý:
  - Kiểm tra → Cập nhật → Cấp lại phiên đăng nhập
- Xuất/Thông báo:
  - Thông báo thay đổi thành công / gửi email tùy chọn
- Ghi log/Giám sát:
  - Ghi lại lịch sử thay đổi, IP
- Xử lý ngoại lệ:
  - Tạm khóa nếu thất bại nhiều lần liên tiếp

## 11. Thay đổi địa chỉ email

- Điều kiện tiên quyết:
  - Đã đăng nhập
- Trường nhập:
  - Email mới
  - Xác nhận email mới
- Kiểm tra nhập liệu:
  - Định dạng / Trùng lặp / Chính sách tên miền
- Luồng xử lý:
  - Lưu tạm thời → Gửi email xác nhận → Nhấp URL → Cập nhật chính thức
- Xuất/Thông báo:
  - Thông báo hoàn tất kích hoạt
- Ghi log/Giám sát:
  - Ghi lại yêu cầu thay đổi và kích hoạt thành công
- Xử lý ngoại lệ:
  - Gửi lại nếu URL hết hạn

## 12. Tham gia quỹ (nộp đơn đăng ký)

Đăng ký tham gia (dành cho người chưa tham gia)

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách người chưa tham gia
  - Dữ liệu nhân viên liên quan đã được nhập từ cơ sở dữ liệu nhân sự

- Trường nhập:
  - Họ tên (chữ Hán / Katakana)
  - Ngày sinh
  - Giới tính
  - Địa chỉ
  - Email (công ty / cá nhân)
  - Số điện thoại
  - Hình thức tuyển dụng / Ngày vào làm
  - Thông tin lương cơ bản
  - Thông tin tài khoản nhận tiền
  - Liên hệ khẩn cấp

- Kiểm tra nhập liệu:
  - Bắt buộc / Đúng định dạng / Đúng số ký tự
  - Kiểm tra điều kiện đủ điều kiện tham gia (tuổi / số năm làm việc)
  - Kiểm tra trùng email
  - Kiểm tra tài khoản ngân hàng (số ký tự / tên chủ tài khoản)

- Luồng xử lý:
  - Nhập thông tin → Xác nhận → Gửi đăng ký
  - Đăng ký sẽ được lưu tạm thời
  - Khởi động quy trình phê duyệt (quản lý văn phòng)
  - Sau khi phê duyệt → Cập nhật trạng thái thành người tham gia
  - Liên kết thông tin với hệ thống CP
  - Gửi thông báo hoàn tất

- Xuất / Thông báo:
  - Gửi email xác nhận tham gia (bao gồm mã số thành viên)
  - Gửi thông báo cho quản trị viên (có đơn đăng ký mới)

- Ghi log / Giám sát:
  - Lưu toàn bộ dữ liệu nhập, người phê duyệt và thời gian phê duyệt vào hệ thống giám sát

- Xử lý ngoại lệ:
  - Nếu không đủ điều kiện → Không thể đăng ký
  - Nếu liên kết với hệ thống CP thất bại → Tự động thử lại và hiển thị cảnh báo

## 13. Hiển thị bảng điều khiển cá nhân

Bảng điều khiển cá nhân (dành cho người đã tham gia)

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách người tham gia

- Trường nhập:
  - Không có

- Kiểm tra nhập liệu:
  - Kiểm soát quyền hiển thị widget

- Luồng xử lý:
  - Thu thập và hiển thị thông tin tình trạng tham gia, khoản đóng góp, đơn đăng ký, và thông báo

- Xuất / Thông báo:
  - Hiển thị nút CTA (Call to Action) cho hành động tiếp theo

- Ghi log / Giám sát:
  - Ghi lại dữ liệu tải trang và số lần nhấp

- Xử lý ngoại lệ:
  - Hiển thị dự phòng khi thiếu dữ liệu

## 14. Hiển thị thông tin cơ sở dữ liệu cá nhân

1. Xem lịch sử tham gia và tài khoản cá nhân ảo

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách người tham gia

- Trường nhập:
  - Không có

- Kiểm tra nhập liệu:
  - Quyền truy cập thông tin cá nhân

- Luồng xử lý:
  - Lấy và hiển thị: lịch sử tham gia, lịch sử đóng góp, tài khoản cá nhân ảo

- Xuất / Thông báo:
  - Xuất file CSV (tùy chọn)

- Ghi log / Giám sát:
  - Ghi log truy cập (thông tin định danh cá nhân - PII)

- Xử lý ngoại lệ:
  - Tối ưu hiệu suất khi có quá nhiều dữ liệu lịch sử

## 15. Tham khảo khoản đóng góp

2. Xem thông tin lương cơ bản và mức đóng góp

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách người tham gia

- Trường nhập:
  - Không có

- Kiểm tra nhập liệu:
  - Kiểm soát quyền hiển thị

- Luồng xử lý:
  - Lấy và hiển thị: lương cơ bản, tỷ lệ đóng góp, số tiền, lịch sử thay đổi

- Xuất / Thông báo:
  - Cho phép tải xuống (PDF / CSV)

- Ghi log / Giám sát:
  - Ghi lại lịch sử truy cập

- Xử lý ngoại lệ:
  - Thông báo rõ thời điểm cập nhật dữ liệu mới nhất

- Có xuất CSV, PDF

## 16. Hiển thị danh sách nội dung đã đăng ký

3. Xem danh sách và chi tiết đơn đăng ký

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách người tham gia

- Trường nhập:
  - Loại đơn đăng ký / bộ lọc theo thời gian (tùy chọn)

- Kiểm tra nhập liệu:
  - Chỉ cho phép người dùng xem đơn của chính mình

- Luồng xử lý:
  - Lấy danh sách → Chuyển đến màn hình chi tiết

- Ghi log / Giám sát:
  - Ghi lại log truy cập

- Xử lý ngoại lệ:
  - Áp dụng phân trang khi có nhiều mục

## 17. Thay đổi khoản đóng góp

1. Thay đổi mức đóng góp

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách người tham gia
  - Đã có cài đặt khoản đóng góp hiện tại

- Trường nhập:
  - Tỷ lệ đóng góp mới hoặc số tiền mới

- Kiểm tra nhập liệu:
  - Kiểm tra theo mức lương tối thiểu / quy định nội bộ
  - Giới hạn mức thay đổi / số lần thay đổi
  - Chỉ cho phép chọn ngày áp dụng trong tương lai

- Luồng xử lý:
  - Nhập → Xác nhận → Gửi yêu cầu
  - Duyệt quy trình phê duyệt (quản lý văn phòng)
  - Sau phê duyệt → Cập nhật áp dụng từ kỳ lương kế tiếp
  - Liên kết với hệ thống CP

- Xuất / Thông báo:
  - Gửi email xác nhận nhận yêu cầu / kết quả phê duyệt

- Ghi log / Giám sát:
  - Ghi lịch sử đăng ký và phê duyệt

- Xử lý ngoại lệ:
  - Hiển thị lỗi nếu vượt quá giới hạn tối thiểu / tối đa

## 18. Rút khỏi quỹ

2. Rút khỏi quỹ do mất tư cách bảo hiểm

- Điều kiện tiên quyết:
  - Có xác nhận mất tư cách tham gia bảo hiểm hưu trí

- Trường nhập:
  - Lý do rút khỏi
  - Ngày mất tư cách

- Kiểm tra nhập liệu:
  - Kiểm tra giấy tờ chứng minh mất tư cách

- Luồng xử lý:
  - Gửi yêu cầu → Phê duyệt bởi quản lý → Cập nhật trạng thái → Liên kết với CP

- Xuất / Thông báo:
  - Gửi thông báo hoàn tất rút khỏi quỹ

- Ghi log / Giám sát:
  - Ghi lịch sử rút khỏi / log phê duyệt

- Xử lý ngoại lệ:
  - Trả lại yêu cầu nếu có sai lệch về ngày tháng

## 19. Mô phỏng phí bảo hiểm xã hội

### MUST

3. Mô phỏng phí bảo hiểm xã hội

- Điều kiện tiên quyết:
  - Đăng nhập (hoặc khách một phần)

- Trường nhập:
  - Mức lương cơ bản / Thu nhập dự kiến năm
  - Tỷ lệ đóng góp / số tiền
  - Điều kiện gia đình (tùy chọn)

- Kiểm tra nhập liệu:
  - Giới hạn tối đa / tối thiểu của các trường nhập

- Luồng xử lý:
  - Gửi dữ liệu tới công cụ tính toán → Nhận kết quả → Hiển thị biểu đồ

- Xuất / Thông báo:
  - View table theo dạng tháng năm (Giới hạn số năm)
  - Total số tiền
  - Cho phép lưu kết quả dưới dạng PDF / CSV (tùy chọn)

- Ghi log / Giám sát:
  - Tạm lưu điều kiện mô phỏng (nếu có đồng ý)

- Xử lý ngoại lệ:
  - Cảnh báo khi người dùng nhập giá trị quá cao hoặc quá thấp

### WANT

3. Mô phỏng phí bảo hiểm xã hội

- Điều kiện tiên quyết:
  - Đăng nhập (hoặc khách một phần)

- Trường nhập:
  - Mức lương cơ bản / Thu nhập dự kiến năm
  - Tỷ lệ đóng góp / số tiền
  - Điều kiện gia đình (tùy chọn)

- Kiểm tra nhập liệu:
  - Giới hạn tối đa / tối thiểu của các trường nhập

- Luồng xử lý:
  - Gửi dữ liệu tới công cụ tính toán → Nhận kết quả → Hiển thị biểu đồ

- Xuất / Thông báo:
  - View table theo dạng tháng năm
  - Total số tiền
  - Cho phép lưu kết quả dưới dạng PDF / CSV (tùy chọn)
  - Chart/ Filter/Report

- Ghi log / Giám sát:
  - Tạm lưu điều kiện mô phỏng (nếu có đồng ý)

- Xử lý ngoại lệ:
  - Cảnh báo khi người dùng nhập giá trị quá cao hoặc quá thấp

## 20. Mô phỏng mức giới hạn thu nhập năm

### MUST

4. Mô phỏng rào cản thu nhập hàng năm

- Điều kiện tiên quyết:
  - Đăng nhập (hoặc khách một phần)

- Trường nhập:
  - Mức lương cơ bản / Thu nhập dự kiến năm
  - Tỷ lệ đóng góp / số tiền
  - Điều kiện gia đình (tùy chọn)

- Kiểm tra nhập liệu:
  - Giới hạn tối đa / tối thiểu của các trường nhập

- Luồng xử lý:
  - Gửi dữ liệu tới công cụ tính toán → Nhận kết quả → Hiển thị biểu đồ

- Xuất / Thông báo:
  - View table theo dạng tháng năm (Giới hạn số năm)
  - Total số tiền
  - Cho phép lưu kết quả dưới dạng PDF / CSV (tùy chọn)

- Ghi log / Giám sát:
  - Tạm lưu điều kiện mô phỏng (nếu có đồng ý)

- Xử lý ngoại lệ:
  - Cảnh báo khi người dùng nhập giá trị quá cao hoặc quá thấp

### WANT

4. Mô phỏng rào cản thu nhập hàng năm

- Điều kiện tiên quyết:
  - Đăng nhập (hoặc khách một phần)

- Trường nhập:
  - Mức lương cơ bản / Thu nhập dự kiến năm
  - Tỷ lệ đóng góp / số tiền
  - Điều kiện gia đình (tùy chọn)

- Kiểm tra nhập liệu:
  - Giới hạn tối đa / tối thiểu của các trường nhập

- Luồng xử lý:
  - Gửi dữ liệu tới công cụ tính toán → Nhận kết quả → Hiển thị biểu đồ

- Xuất / Thông báo:
  - View table theo dạng tháng năm
  - Total số tiền
  - Cho phép lưu kết quả dưới dạng PDF / CSV (tùy chọn)
  - Chart/ Filter/Report

- Ghi log / Giám sát:
  - Tạm lưu điều kiện mô phỏng (nếu có đồng ý)

- Xử lý ngoại lệ:
  - Cảnh báo khi người dùng nhập giá trị quá cao hoặc quá thấp

## 21. Hiển thị bảng điều khiển quản trị

5. Trang tổng quan cho quản trị viên văn phòng

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên của doanh nghiệp

- Trường nhập:
  - Không có

- Kiểm tra nhập liệu:
  - Hiển thị dữ liệu tùy theo quyền truy cập

- Luồng xử lý:
  - Hiển thị số người tham gia / đơn đăng ký / khoản đóng góp
  - Cung cấp liên kết đi sâu vào chi tiết

- Xuất / Thông báo:
  - Cho phép xuất CSV hoặc hình ảnh (tùy chọn)

- Ghi log / Giám sát:
  - Ghi log xem và số lần nhấp

- Xử lý ngoại lệ:
  - Thông báo khi có chậm trễ trong xử lý dữ liệu thống kê

## 22. Hiển thị thông tin hồ sơ công ty

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Không có

- Kiểm tra nhập liệu:
  - Quyền xem thông tin

- Luồng xử lý:
  - Lấy và hiển thị thông tin như tên doanh nghiệp, địa chỉ, người đại diện

- Xuất / Thông báo:
  - Không có

- Ghi log / Giám sát:
  - Ghi log truy cập

- Xử lý ngoại lệ:
  - Hiển thị placeholder cho các giá trị chưa được cài đặt

## 23. Thay đổi thông tin hồ sơ công ty

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Địa chỉ
  - Số điện thoại
  - Người phụ trách

- Kiểm tra nhập liệu:
  - Bắt buộc / đúng định dạng
  - Kiểm tra tính nhất quán với hệ thống CP

- Luồng xử lý:
  - Nhập → Xác nhận → Lưu → Liên kết API với CP

- Xuất / Thông báo:
  - Gửi thông báo hoàn tất chỉnh sửa

- Ghi log / Giám sát:
  - Lưu lịch sử thay đổi

- Xử lý ngoại lệ:
  - Nếu lỗi từ hệ thống CP → Rollback dữ liệu

## 24. Hiển thị danh sách người tham gia

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Điều kiện tìm kiếm (họ tên / ID / thời gian)

- Kiểm tra nhập liệu:
  - Giới hạn trong phạm vi doanh nghiệp

- Luồng xử lý:
  - Lấy danh sách → Chuyển đến chi tiết / chỉnh sửa

- Xuất / Thông báo:
  - Có thể xuất CSV

- Ghi log / Giám sát:
  - Ghi log truy cập

- Xử lý ngoại lệ:
  - Tối ưu hóa khi số lượng lớn

## 25. Đăng ký / Thay đổi thông tin người tham gia

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Họ tên / Địa chỉ / Thông tin liên lạc
  - Loại hợp đồng / Mức lương
  - Ngày tham gia

- Kiểm tra nhập liệu:
  - Bắt buộc / đúng định dạng / kiểm tra tính nhất quán
  - Tránh đăng ký trùng lặp

- Luồng xử lý:
  - Nhập → Xác nhận → Lưu → Phản ánh vào hệ thống CP

- Xuất / Thông báo:
  - Gửi thông báo hoàn tất đăng ký

- Ghi log / Giám sát:
  - Lưu lịch sử thay đổi

- Xử lý ngoại lệ:
  - Gửi lại khi hệ thống CP gặp lỗi

## 26. Hiển thị danh sách người dùng

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Họ tên / Email / Quyền hạn

- Kiểm tra nhập liệu:
  - Định dạng email / kiểm tra trùng
  - Kiểm tra quyền hạn hợp lệ

- Luồng xử lý:
  - Đăng ký hoặc chỉnh sửa → Gửi email kích hoạt → Kích hoạt hoàn tất

- Xuất / Thông báo:
  - Thông báo mật khẩu khởi tạo / hướng dẫn kích hoạt

- Ghi log / Giám sát:
  - Ghi lại người tạo và thời điểm

- Xử lý ngoại lệ:
  - Xử lý khi email không gửi được

## 27. Đăng ký / Thay đổi thông tin người dùng

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Họ tên / Email / Quyền hạn

- Kiểm tra nhập liệu:
  - Định dạng email / kiểm tra trùng
  - Kiểm tra quyền hạn hợp lệ

- Luồng xử lý:
  - Đăng ký hoặc chỉnh sửa → Gửi email kích hoạt → Kích hoạt hoàn tất

- Xuất / Thông báo:
  - Thông báo mật khẩu khởi tạo / hướng dẫn kích hoạt

- Ghi log / Giám sát:
  - Ghi lại người tạo và thời điểm

- Xử lý ngoại lệ:
  - Xử lý khi email không gửi được

## 28. Tải lên thông tin người dùng hàng loạt

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Tệp CSV hoặc Excel

- Kiểm tra nhập liệu:
  - Kiểm tra tiêu đề, kiểu dữ liệu, trường bắt buộc, trùng lặp

- Luồng xử lý:
  - Tải lên → Xác minh → Nhập → Xuất báo cáo kết quả

- Xuất / Thông báo:
  - Xuất file lỗi (CSV)

- Ghi log / Giám sát:
  - Ghi job ID, người thực hiện, số lượng bản ghi

- Xử lý ngoại lệ:
  - Cho phép khôi phục khi bị gián đoạn

## 29. Hiển thị danh sách thông báo (cho văn phòng)

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Khoảng thời gian / trạng thái hiển thị

- Kiểm tra nhập liệu:
  - Kiểm tra quyền xem

- Luồng xử lý:
  - Lấy danh sách → Xem chi tiết

- Xuất / Thông báo:
  - Không có

- Ghi log / Giám sát:
  - Ghi log truy cập

- Xử lý ngoại lệ:
  - Không có

## 30. Đăng ký / Thay đổi thông báo (cho văn phòng)

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Tiêu đề / Nội dung / Phạm vi hiển thị / Thời gian công khai

- Kiểm tra nhập liệu:
  - Bắt buộc nhập
  - Kiểm tra mã độc (XSS)
  - Kiểm tra tính hợp lệ của thời gian hiển thị

- Luồng xử lý:
  - Tạo mới hoặc chỉnh sửa → Công khai → Phát hành

- Xuất / Thông báo:
  - Gửi thông báo khi công khai

- Ghi log / Giám sát:
  - Ghi lại lịch sử chỉnh sửa / phiên bản

- Xử lý ngoại lệ:
  - Hướng dẫn xử lý sau khi đã công khai

## 31. Hiển thị danh sách đơn đăng ký

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Loại đơn / Khoảng thời gian / Bộ lọc trạng thái

- Kiểm tra nhập liệu:
  - Không có

- Luồng xử lý:
  - Lấy danh sách → Xem chi tiết → Màn hình phê duyệt

- Xuất / Thông báo:
  - Xuất CSV

- Ghi log / Giám sát:
  - Ghi log truy cập

- Xử lý ngoại lệ:
  - Không có

## 32. Xem chi tiết nội dung đơn đăng ký

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Không có

- Kiểm tra nhập liệu:
  - Kiểm tra tự động theo mức lương tối thiểu

- Luồng xử lý:
  - Lấy chi tiết → Hiển thị kết quả → Hỗ trợ nhập lý do trả lại

- Xuất / Thông báo:
  - Không có

- Ghi log / Giám sát:
  - Ghi log truy cập / đánh giá

- Xử lý ngoại lệ:
  - Hỗ trợ kiểm tra thủ công nếu AI đánh giá thất bại

## 33. Phê duyệt / Từ chối / Trả lại đơn đăng ký

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Chọn phê duyệt / từ chối / trả lại
  - Ghi chú nhận xét

- Kiểm tra nhập liệu:
  - Kiểm tra quyền / ngăn phê duyệt trùng lặp

- Luồng xử lý:
  - Thực hiện phê duyệt → Liên kết với CP → Cập nhật kết quả

- Xuất / Thông báo:
  - Gửi thông báo kết quả cho người đăng ký

- Ghi log / Giám sát:
  - Ghi lịch sử quy trình phê duyệt (workflow)

- Xử lý ngoại lệ:
  - Phát hiện xung đột do cập nhật đồng thời

## 34. Hiển thị các loại báo cáo

### MUST

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp
  - Check các loại báo cáo:  Báo cáo tỉ lệ tham gia/ out quỹ

- Trường nhập:
  - Khoảng thời gian / Văn phòng / Chỉ số

- Kiểm tra nhập liệu:
  - Không có

- Luồng xử lý:
  - Tổng hợp → Hiển thị bảng → Xuất file

- Xuất / Thông báo:
  - Xuất CSV

- Ghi log / Giám sát:
  - Ghi lịch sử xuất dữ liệu

- Xử lý ngoại lệ:
  - Thực hiện tổng hợp bất đồng bộ với dữ liệu lớn

### WANT

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp
  - Check các loại báo cáo: Báo cáo tham gia/out quỹ, thống kê thay đổi theo năm, tháng....

- Trường nhập:
  - Khoảng thời gian / Văn phòng / Chỉ số

- Kiểm tra nhập liệu:
  - Không có

- Luồng xử lý:
  - Tổng hợp → Hiển thị biểu đồ / bảng → Xuất file

- Xuất / Thông báo:
  - Xuất CSV / Excel / (Chart)

- Ghi log / Giám sát:
  - Ghi lịch sử xuất dữ liệu

- Xử lý ngoại lệ:
  - Thực hiện tổng hợp bất đồng bộ với dữ liệu lớn

## 35. Xuất dữ liệu khoản đóng góp

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Tháng cần xuất
  - Chọn định dạng

- Kiểm tra nhập liệu:
  - Phù hợp với chuẩn Zengin / giao diện nhập lương

- Luồng xử lý:
  - Trích xuất → Xác minh → Tạo file CSV → Phân phối

- Xuất / Thông báo:
  - Tạo file CSV để nhập vào hệ thống lương

- Ghi log / Giám sát:
  - Ghi job, số lượng bản ghi, CRC

- Xử lý ngoại lệ:
  - Hỗ trợ tạo lại hoặc tạo bản khác biệt

## 36. Quản lý các tài liệu như điều khoản

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Tiêu đề
  - Loại tài liệu
  - Ngày hiệu lực
  - Tập tin đính kèm

- Kiểm tra nhập liệu:
  - Kiểm tra định dạng tệp (đuôi file)
  - Kiểm tra kích thước tệp
  - Quét virus

- Luồng xử lý:
  - Đăng ký tài liệu → Cài đặt quyền công khai → Phân phối

- Xuất / Thông báo:
  - Tạo đường dẫn công khai để người dùng truy cập

- Ghi log / Giám sát:
  - Quản lý phiên bản
  - Ghi lại lịch sử thay đổi

- Xử lý ngoại lệ:
  - Tự động ẩn tài liệu khi đến ngày hết hiệu lực

## 37. Đăng ký / Thay đổi tài liệu liên quan

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên doanh nghiệp

- Trường nhập:
  - Tiêu đề
  - Loại tài liệu
  - Ngày hiệu lực
  - Tập tin đính kèm

- Kiểm tra nhập liệu:
  - Kiểm tra định dạng tệp (đuôi file)
  - Kiểm tra kích thước tệp
  - Quét virus

- Luồng xử lý:
  - Đăng ký tài liệu → Cài đặt quyền công khai → Phân phối

- Xuất / Thông báo:
  - Tạo đường dẫn công khai để người dùng truy cập

- Ghi log / Giám sát:
  - Quản lý phiên bản
  - Ghi lại lịch sử thay đổi

- Xử lý ngoại lệ:
  - Tự động ẩn tài liệu khi đến ngày hết hiệu lực

## 38. Đăng nhập với tư cách quản trị viên

- Điều kiện tiên quyết:
  - Đăng nhập với tư cách quản trị viên hệ thống PF

- Trường nhập:
  - Email hoặc ID
  - Mật khẩu
  - Mã xác thực đa yếu tố (MFA)

- Kiểm tra nhập liệu:
  - Bắt buộc xác thực MFA
  - Giới hạn địa chỉ IP

- Luồng xử lý:
  - Xác thực → Nhập mã MFA → Kiểm soát quyền truy cập

- Xuất / Thông báo:
  - Hiển thị dashboard quản trị

- Ghi log / Giám sát:
  - Ghi lại toàn bộ các lần đăng nhập/thử đăng nhập

- Xử lý ngoại lệ:
  - Cung cấp phương án dự phòng khi MFA bị trễ

## 39. Hiển thị danh sách dữ liệu thuế cư trú

- Điều kiện tiên quyết:
  - Đăng nhập hệ thống với vai trò PF管理者
  - Có quyền truy cập dữ liệu quản lý thuế cư trú

- Trường nhập:
  - Không có bắt buộc (có thể có bộ lọc như năm, khu vực, loại thuế)

- Kiểm tra nhập liệu:
  - Kiểm soát quyền truy cập và hiển thị thông tin thuế

- Luồng xử lý:
  - Gửi yêu cầu truy vấn dữ liệu thuế cư trú
  - Hệ thống trả về danh sách các bản ghi từ cơ sở dữ liệu
  - Hiển thị theo định dạng bảng, có phân trang nếu cần
  - Hỗ trợ sắp xếp và lọc theo khu vực, năm, loại thuế

- Kết quả / Xuất dữ liệu:
  - Hiển thị bảng danh sách thuế cư trú
  - Không hỗ trợ xuất file (nếu không cấu hình)

- Ghi log / Giám sát:
  - Lưu lại nhật ký truy cập (thời gian, người thực hiện, IP)

- Xử lý ngoại lệ:
  - Trường hợp không có dữ liệu phù hợp → Hiển thị thông báo “Không tìm thấy”
  - Trường hợp lỗi hệ thống → Hiển thị thông báo lỗi chung và đề nghị thử lại

## 40. Đăng ký / Cập nhật dữ liệu thuế cư trú

- Điều kiện tiên quyết:
  - Đăng nhập với quyền PF管理者
  - Có quyền chỉnh sửa dữ liệu hệ thống

- Trường nhập:
  - Năm tài chính (bắt buộc)
  - Tên khu vực / tỉnh thành (bắt buộc)
  - Mức thuế (cố định hoặc tỷ lệ phần trăm)
  - Ngày bắt đầu hiệu lực
  - Ngày kết thúc hiệu lực (nếu có)

- Kiểm tra nhập liệu:
  - Trường bắt buộc không được để trống
  - Kiểm tra định dạng số (thuế suất, số tiền)
  - Không trùng lặp bản ghi đã tồn tại (năm + khu vực)
  - Kiểm tra phạm vi giá trị (ví dụ: thuế suất không vượt quá 20%)
  - Đảm bảo không có xung đột ngày hiệu lực với các bản ghi khác

- Luồng xử lý:
  - Nhập thông tin → Kiểm tra hợp lệ → Xác nhận → Lưu vào DB
  - Nếu là chỉnh sửa: hệ thống ghi đè hoặc tạo bản ghi mới theo phiên bản

- Kết quả / Xuất dữ liệu:
  - Hiển thị thông báo “Đăng ký/Cập nhật thành công”
  - Có thể quay lại danh sách để xác nhận

- Ghi log / Giám sát:
  - Lưu lịch sử chỉnh sửa (ai thực hiện, khi nào, dữ liệu cũ và mới)

- Xử lý ngoại lệ:
  - Nếu phát hiện trùng bản ghi → Hiển thị lỗi "Bản ghi đã tồn tại"
  - Nếu dữ liệu không hợp lệ → Chỉ rõ trường sai và yêu cầu sửa lại
  - Nếu lỗi lưu DB → Hiển thị lỗi hệ thống và không ghi nhận dữ liệu

## 41. Cập nhật dữ liệu thuế cư trú hàng loạt

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- File CSV hoặc Excel

3. Kiểm tra đầu vào (Input Validation)

- Cấu trúc header, kiểm tra sự tồn tại của các trường bắt buộc
- Kiểm tra tính hợp lệ định dạng số
- Kiểm tra trùng lặp năm và khu vực

4. Luồng xử lý (Processing Flow)

- Tải file → Kiểm chứng nội dung → Nhập dữ liệu thành công → Hiển thị kết quả

5. Đầu ra / Thông báo (Output / Notification)

- Nếu có lỗi: xuất file CSV chứa log lỗi
- Hiển thị số bản ghi thành công / thất bại trên màn hình

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận người thực thi, thời gian, Job ID, số lượng bản ghi

7. Xử lý ngoại lệ (Exception Handling)

- Thiết kế cho phép tiếp tục từ điểm dừng khi lỗi file hoặc gián đoạn giữa chừng (cơ chế khôi phục)

## 42. Hiển thị danh sách dữ liệu lương tối thiểu

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Không có (bộ lọc tùy chọn)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm soát quyền hạn (có quyền tham chiếu hay không)

4. Luồng xử lý (Processing Flow)

- Lấy thông tin mức lương tối thiểu từ DB → Hiển thị dạng bảng
- Có thể sắp xếp / tìm kiếm theo khu vực, năm, số tiền

5. Đầu ra / Thông báo (Output / Notification)

- Chỉ hiển thị trên màn hình (xuất CSV là tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận log truy cập (ai, khi nào, xem dữ liệu gì)

7. Xử lý ngoại lệ (Exception Handling)

- Nếu chưa có dữ liệu: hiển thị “Không có dữ liệu tương ứng”

## 43. Đăng ký / Cập nhật dữ liệu lương tối thiểu

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Năm, khu vực, mức lương tối thiểu, ngày bắt đầu áp dụng, ngày kết thúc áp dụng (tùy chọn)

3. Kiểm tra đầu vào (Input Validation)

- Bắt buộc nhập các trường cần thiết
- Kiểm tra định dạng số tiền (số học, số chữ số)
- Kiểm tra trùng lặp (kết hợp năm + khu vực)

4. Luồng xử lý (Processing Flow)

- Nhập dữ liệu → Kiểm chứng → Đăng ký hoặc cập nhật → Hiển thị hoàn tất

5. Đầu ra / Thông báo (Output / Notification)

- Hiển thị thông báo xác nhận trên màn hình (ví dụ: “Đăng ký hoàn tất”)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận lịch sử chỉnh sửa (giá trị cũ, giá trị mới, người thực hiện, thời gian)

7. Xử lý ngoại lệ (Exception Handling)

- Nếu giá trị nhập không hợp lệ hoặc trùng lặp: hiển thị thông báo lỗi

## 44. Cập nhật dữ liệu lương tối thiểu hàng loạt

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- File CSV hoặc Excel

3. Kiểm tra đầu vào (Input Validation)

- Các trường bắt buộc, định dạng file, tính hợp lệ của số tiền
- Kiểm tra trùng lặp kết hợp Khu vực + Năm

4. Luồng xử lý (Processing Flow)

- Tải file → Kiểm chứng → Đăng ký → Hiển thị báo cáo kết quả

5. Đầu ra / Thông báo (Output / Notification)

- Chi tiết lỗi có thể xuất ra file CSV
- Hiển thị số bản ghi thành công / thất bại trên màn hình

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận lịch sử thực thi, Job ID, số bản ghi đăng ký, người phụ trách

7. Xử lý ngoại lệ (Exception Handling)

- Khi nhập thất bại, cho phép khôi phục và thực thi lại

## 45. Hiển thị danh sách văn phòng tham gia

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Không có (tìm kiếm / bộ lọc tùy chọn)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm soát quyền hạn (có quyền tham chiếu thông tin doanh nghiệp hay không)

4. Luồng xử lý (Processing Flow)

- Lấy dữ liệu doanh nghiệp đã đăng ký → Hiển thị dạng bảng

5. Đầu ra / Thông báo (Output / Notification)

- Chỉ hiển thị trên màn hình (xuất CSV là tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Log truy cập (ai, khi nào, đã xem dữ liệu nào)

7. Xử lý ngoại lệ (Exception Handling)

- Nếu không có dữ liệu: hiển thị thông báo “Không có dữ liệu”

## 46. Đăng ký / Cập nhật văn phòng tham gia

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Tên doanh nghiệp, địa chỉ, số điện thoại, người phụ trách, email, v.v.

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra các trường bắt buộc
- Kiểm tra định dạng email, số điện thoại
- Kiểm tra tính hợp lệ với dữ liệu hiện có (ví dụ: trùng mã doanh nghiệp)

4. Luồng xử lý (Processing Flow)

- Nhập dữ liệu → Kiểm chứng → Màn hình xác nhận → Đăng ký / Cập nhật

5. Đầu ra / Thông báo (Output / Notification)

- Hiển thị thông báo thành công
- Khi cần, gửi thêm email thông báo

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận lịch sử chỉnh sửa (người thay đổi, thời gian, nội dung)

7. Xử lý ngoại lệ (Exception Handling)

- Khi phát sinh lỗi trùng lặp hoặc không hợp lệ: hiển thị cảnh báo lỗi

## 47. Hiển thị danh sách người dùng đã đăng ký

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Không có (bộ lọc tìm kiếm tùy chọn: Họ tên, Email, Quyền hạn, Doanh nghiệp trực thuộc, …)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra quyền truy cập đối với người dùng được hiển thị

4. Luồng xử lý (Processing Flow)

- Lấy danh sách người dùng đã đăng ký → Hiển thị dạng bảng (có phân trang, sắp xếp, lọc)

5. Đầu ra / Thông báo (Output / Notification)

- Dữ liệu hiển thị có thể xuất ra CSV (tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận log truy cập (thời gian, người thao tác, địa chỉ IP)

7. Xử lý ngoại lệ (Exception Handling)

- Khi không có dữ liệu: hiển thị thông báo “Không tồn tại người dùng”

## 48. Đăng ký / Cập nhật người dùng

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Họ tên, Email, Quyền hạn, Doanh nghiệp trực thuộc, …

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra định dạng email và trùng lặp
- Kiểm tra tính hợp lệ giữa quyền hạn và doanh nghiệp
- Xác nhận các trường bắt buộc đã nhập

4. Luồng xử lý (Processing Flow)

- Nhập dữ liệu → Kiểm chứng → Đăng ký hoặc Cập nhật
- Khi đăng ký mới: gửi email kích hoạt (bao gồm mật khẩu tạm)

5. Đầu ra / Thông báo (Output / Notification)

- Hiển thị thông báo thành công
- Gửi email kích hoạt đến người dùng

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận lịch sử thao tác (người tạo, người cập nhật, thời gian, nội dung thay đổi)

7. Xử lý ngoại lệ (Exception Handling)

- Khi email trùng lặp: hiển thị thông báo lỗi
- Khi email gửi thất bại: cho phép sử dụng chức năng gửi lại

## 49. Hiển thị danh sách thông báo (toàn hệ thống / văn phòng)

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Không có (bộ lọc tùy chọn: Thời gian, Trạng thái công khai, Doanh nghiệp, …)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra quyền hiển thị

4. Luồng xử lý (Processing Flow)

- Lấy danh sách thông báo → Hiển thị kèm trạng thái công khai và phạm vi áp dụng

5. Đầu ra / Thông báo (Output / Notification)

- Nội dung danh sách có thể xuất CSV (tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận lịch sử xem (người dùng, thời gian, số lượng bản ghi)

7. Xử lý ngoại lệ (Exception Handling)

- Khi không có dữ liệu: hiển thị thông báo “Không có thông báo nào để hiển thị”

## 50. Đăng ký / Thay đổi thông báo (toàn hệ thống / văn phòng)

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Tiêu đề, nội dung, đối tượng (toàn hệ thống hoặc doanh nghiệp cụ thể), thời gian công khai, tệp đính kèm (tùy chọn)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra nhập các trường bắt buộc
- Kiểm tra tính hợp lệ của thời gian công khai
- Biện pháp chống XSS (vô hiệu hóa script)

4. Luồng xử lý (Processing Flow)

- Nhập dữ liệu → Xác nhận → Đăng ký hoặc Cập nhật → Công khai
- Sau khi công khai: gửi thông báo tới người dùng mục tiêu (popup hoặc email)

5. Đầu ra / Thông báo (Output / Notification)

- Thông báo công khai được tự động gửi (tùy theo thiết lập)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận lịch sử chỉnh sửa phiên bản (phiên bản gốc, nội dung thay đổi, thời gian, người phụ trách)

7. Xử lý ngoại lệ (Exception Handling)

- Tự động ẩn sau khi hết thời gian công khai
- Khi chỉnh sửa sau công khai: hiển thị hướng dẫn chỉnh sửa

## 51. Quản lý tài liệu như điều khoản

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Tiêu đề, loại tài liệu, ngày hiệu lực, tệp đính kèm (khuyến nghị PDF)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra phần mở rộng, dung lượng file, quét virus
- Thiết lập để chỉ hiển thị từ ngày hiệu lực trở đi

4. Luồng xử lý (Processing Flow)

- Đăng ký mới hoặc Cập nhật → Thiết lập công khai → Phân phối

5. Đầu ra / Thông báo (Output / Notification)

- Sinh liên kết công khai
- Khi cập nhật: có thể gửi lại thông báo cho người dùng mục tiêu (tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Quản lý phiên bản, lưu lịch sử thay đổi

7. Xử lý ngoại lệ (Exception Handling)

- Tài liệu hết hạn sẽ tự động bị ẩn

## 52. Đăng ký / Thay đổi tài liệu liên quan

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Tiêu đề, loại, quy định liên quan, file, phạm vi công khai

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra phần mở rộng, dung lượng file, quét an toàn
- Xác nhận rằng tài liệu liên quan để liên kết tồn tại

4. Luồng xử lý (Processing Flow)

- Nhập dữ liệu → Đăng ký hoặc Cập nhật → Thiết lập công khai → Phân phối (tùy chọn)

5. Đầu ra / Thông báo (Output / Notification)

- Sinh liên kết công khai (trong màn quản trị hoặc màn người dùng)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Lưu lịch sử đăng ký, ghi nhận phiên bản

7. Xử lý ngoại lệ (Exception Handling)

- Khi lỗi liên kết tài liệu liên quan: không cho phép đăng ký

## 53. Quản lý nội dung nâng cao kỹ năng tài chính (danh sách) - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Đã đăng nhập với quyền PF quản trị viên

2. Mục nhập (Input Items)

- Không có (bộ lọc tùy chọn: danh mục, trạng thái công khai, …)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra quyền hạn (quyền quản lý nội dung FL)

4. Luồng xử lý (Processing Flow)

- Lấy danh sách nội dung FL đã đăng ký → Hiển thị theo trạng thái công khai và phân loại theo người dùng mục tiêu

5. Đầu ra / Thông báo (Output / Notification)

- Hiển thị trên màn hình
- Cho phép xuất CSV (tùy chọn)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận log xem (người dùng, thời gian, điều kiện tìm kiếm)

7. Xử lý ngoại lệ (Exception Handling)

- Khi không có dữ liệu: hiển thị thông báo “Không có nội dung đã đăng ký”

## 54. Đăng ký / Cập nhật nội dung - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Đăng nhập với quyền PF quản trị viên có quyền quản lý nội dung FL

2. Mục nhập (Input Items)

- Tiêu đề, danh mục, nội dung, người dùng mục tiêu, thời gian công khai, file đính kèm (tùy chọn)

3. Kiểm tra đầu vào (Input Validation)

- Nhập đủ trường bắt buộc
- Kiểm tra định dạng file, giới hạn dung lượng
- Kiểm tra tính hợp lệ của thời gian công khai
- Biện pháp chống XSS (loại bỏ script)

4. Luồng xử lý (Processing Flow)

- Nhập dữ liệu → Xác nhận → Đăng ký hoặc Cập nhật → Công khai

5. Đầu ra / Thông báo (Output / Notification)

- Sau khi công khai: gửi thông báo cho người dùng mục tiêu (qua email hoặc thông báo trong ứng dụng)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Lưu lịch sử chỉnh sửa phiên bản (ai, khi nào, thay đổi gì)

7. Xử lý ngoại lệ (Exception Handling)

- Nếu công khai thất bại: hiển thị thông báo lỗi kèm hướng dẫn thử lại

## 55. Liên kết thông tin người muốn tham gia với hệ thống CP - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Bộ lập lịch đã khởi động
- Các master cần thiết đang ở trạng thái mới nhất

2. Mục nhập (Input Items)

- Tham số trích xuất từ DB nhân sự (phạm vi đối tượng / ngày cơ sở cho dữ liệu chênh lệch)

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra trường bắt buộc, kiểu dữ liệu, NULL, mã ký tự

4. Luồng xử lý (Processing Flow)

- Trích xuất → Chuyển đổi (theo đặc tả CP) → Kiểm chứng → Gửi đi → Nhận phản hồi

5. Đầu ra / Thông báo (Output / Notification)

- Báo cáo thực thi (số lượng / thành công / thất bại)

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận Job ID, thời gian bắt đầu – kết thúc, số lượng, chi tiết lỗi

7. Xử lý ngoại lệ (Exception Handling)

- Cho phép retry hoặc cách ly các bản ghi thất bại

## 56. Liên kết khoản đóng góp đã được phê duyệt / thông tin thay đổi với CP - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Bộ lập lịch đã khởi động
- Các master cần thiết đang ở trạng thái mới nhất

2. Mục nhập (Input Items)

- Tháng mục tiêu / dữ liệu chênh lệch

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra phạm vi số tiền, trường bắt buộc, tính nhất quán

4. Luồng xử lý (Processing Flow)

- Trích xuất dữ liệu đã phê duyệt → Chuyển đổi → Gửi → Xử lý phản hồi

5. Đầu ra / Thông báo (Output / Notification)

- Báo cáo kết quả nhập dữ liệu

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận log giám sát job

7. Xử lý ngoại lệ (Exception Handling)

- Thử lại khi có độ trễ phản hồi từ CP

## 57. Liên kết thông tin người bị mất quyền tham gia với hệ thống CP - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Bộ lập lịch đã khởi động
- Các master cần thiết đang ở trạng thái mới nhất

2. Mục nhập (Input Items)

- Thời gian mất tư cách tham gia / mã lý do

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra phạm vi ngày, trường bắt buộc

4. Luồng xử lý (Processing Flow)

- Trích xuất → Chuyển đổi → Gửi → Phản ánh kết quả

5. Đầu ra / Thông báo (Output / Notification)

- Báo cáo hoàn tất

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận log giám sát job

7. Xử lý ngoại lệ (Exception Handling)

- Loại bỏ trường hợp dữ liệu ngày tháng mâu thuẫn

## 58. Liên kết thông báo kết quả xử lý từ hệ thống CP - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Bộ lập lịch đã khởi động
- Các master cần thiết đang ở trạng thái mới nhất

2. Mục nhập (Input Items)

- IF nhận thông báo từ CP → PF

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra chữ ký, xác minh định dạng

4. Luồng xử lý (Processing Flow)

- Nhận dữ liệu → Kiểm chứng → Phản ánh kết quả → Phát thông báo

5. Đầu ra / Thông báo (Output / Notification)

- Danh sách lỗi / số lượng thành công

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi nhận log tiếp nhận / log áp dụng

7. Xử lý ngoại lệ (Exception Handling)

- Kiểm soát loại trừ khi nhận trùng lặp

## 59. Liên kết các dữ liệu điện tử từ hệ thống CP - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Bộ lập lịch đã khởi động
- Các master cần thiết đang ở trạng thái mới nhất

2. Mục nhập (Input Items)

- Loại báo cáo / kỳ hạn áp dụng

3. Kiểm tra đầu vào (Input Validation)

- Kích thước file, phần mở rộng, chữ ký

4. Luồng xử lý (Processing Flow)

- Nhận file → Lưu trữ → Phân phối cho người dùng liên quan (kèm thông báo)

5. Đầu ra / Thông báo (Output / Notification)

- Liên kết lưu trữ / kết quả phân phối

6. Nhật ký / Kiểm toán (Logging / Audit)

- Ghi log lưu trữ / log phân phối

7. Xử lý ngoại lệ (Exception Handling)

- Cách ly file bị hỏng

## 60. Liên kết thông tin nhân viên từ cơ sở dữ liệu nhân sự - Sử dụng Batch Job

1. Điều kiện tiên quyết (Preconditions)

- Bộ lập lịch đã khởi động
- Các master cần thiết đang ở trạng thái mới nhất

2. Mục nhập (Input Items)

- Thông tin kết nối / điều kiện trích xuất

3. Kiểm tra đầu vào (Input Validation)

- Kiểm tra kết nối, tính đồng nhất của schema, kiểu dữ liệu

4. Luồng xử lý (Processing Flow)

- Trích xuất → Chuyển đổi → Nhập dữ liệu → Áp dụng dữ liệu chênh lệch

5. Đầu ra / Thông báo (Output / Notification)

- Báo cáo tóm tắt kết quả nhập dữ liệu

6. Nhật ký / Kiểm toán (Logging / Audit)

- Giám sát job / số lượng bản ghi chênh lệch

7. Xử lý ngoại lệ (Exception Handling)

- Chiến lược hợp nhất khi có bản ghi trùng lặp
