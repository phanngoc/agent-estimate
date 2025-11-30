# Important Notes

1. **Phạm vi công việc**

   * **Chỉ phát triển Backend API** (không bao gồm frontend).
   * Bao gồm cả **Batch Job implementation**.
   * **Không tính thời gian code review** trong từng task.

2. **Công nghệ**

   * Framework: **NestJS** (Node.js, TypeScript).
   * Thiết kế API theo **RESTful conventions** và **NestJS best practices**.

3. **Cách estimate**

   * **Chỉ tính Backend API development** (bao gồm server-side logic, xử lý dữ liệu, batch jobs, tích hợp với hệ thống ngoài).
   * **Dùng giờ chính xác** (exact hours), **không dùng khoảng giờ**.
   * 1 ngày làm việc = **7 giờ**.
   * Estimate dựa trên **độ phức tạp thực tế của từng requirement**
   * Estimate chi tiết cho từng endpoint, không gộp chung.
   * Complex workflows có thể cần thêm **guidance từ Senior Developer**, nhưng chỉ tính effort của Junior Engineer.

4. **Đối tượng developer**

   * **Junior Engineer** (2 năm kinh nghiệm).

5. **Đầu ra mong muốn**
   * Mỗi task cần:
     * **Mô tả chi tiết API endpoint** (path bằng tiếng Anh, method, RESTful conventions).
     * Liệt kê logic server-side chính.
     * Estimate số **giờ chính xác**.
   * Tạo **section title bằng tiếng Việt** (ví dụ: `### Đặc tả API cho Requirement 01`).
   * Có **mục riêng cho Batch Jobs**.
   * Bao gồm tích hợp với **External Corporate Pension System** (nếu có trong yêu cầu).
