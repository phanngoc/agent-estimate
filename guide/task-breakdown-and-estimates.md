# Project: Task Breakdown and Estimates

## Tổng quan dự án

- **Framework**: NestJS (Node.js, TypeScript)
- **Scope**: Backend API development only (không bao gồm frontend)
- **Developer level**: Junior Engineer (2 năm kinh nghiệm)
- **Work day**: 8 giờ
- **API Design**: RESTful conventions và NestJS best practices

---

## I. INITIALIZATION & SETUP

### Đặc tả API cho Requirement 01 - Init Project

**API Endpoints**:

- `GET /health` - Health check endpoint
- `GET /api/info` - Application information endpoint

**Server-side Logic**:

- Setup project structure theo NestJS best practices
- Configure CI/CD pipeline
- Implement authentication/authorization với JWT
- Setup database connection và migrations
- Configure app cho VN DEV/STG environment
- Build common components và utilities
- Setup logging và monitoring

**Estimate**: 40 giờ

---

## II. AUTHENTICATION & USER MANAGEMENT

### Đặc tả API cho Requirement 02 - Đăng nhập

**API Endpoints**:

- `POST /auth/login` - User login

**Request Body**:

```json
{
  "identifier": "string", // email hoặc user ID
  "password": "string"
}
```

**Response**:

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Server-side Logic**:

- Validate input data
- Authenticate với database
- Implement login attempt limiting (5 lần)
- Check account lock status
- Generate JWT tokens
- Log authentication events (IP, UserAgent, timestamp)
- Handle fail-safe khi external auth system down

**Estimate**: 16 giờ

### Đặc tả API cho Requirement 03 - Đặt lại mật khẩu nếu quên

**API Endpoints**:

- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password với token

**Request Body (forgot-password)**:

```json
{
  "email": "string"
}
```

**Request Body (reset-password)**:

```json
{
  "token": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Server-side Logic**:

- Validate email format và existence
- Generate secure reset token (15 phút expiry)
- Send email với reset link
- Rate limiting (3 lần/giờ)
- Validate password strength policy
- Update password trong database
- Log reset attempts và success

**Estimate**: 20 giờ

### Đặc tả API cho Requirement 10 - Thay đổi mật khẩu

**API Endpoints**:

- `PUT /auth/change-password` - Change password

**Request Body**:

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmNewPassword": "string"
}
```

**Server-side Logic**:

- Verify current password
- Validate new password strength
- Check password history (không dùng lại mật khẩu cũ)
- Update password trong database
- Invalidate existing sessions
- Log password change events
- Temporary lock sau nhiều attempts thất bại

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 11 - Thay đổi địa chỉ email

**API Endpoints**:

- `PUT /auth/change-email` - Request email change
- `POST /auth/verify-email-change` - Verify email change

**Request Body (change-email)**:

```json
{
  "newEmail": "string",
  "confirmNewEmail": "string"
}
```

**Server-side Logic**:

- Validate email format và domain policy
- Check email duplication
- Save temporary email change request
- Send verification email
- Verify email change với URL token
- Update email officially sau verification
- Log email change events

**Estimate**: 14 giờ

---

## III. DASHBOARD & PROFILE MANAGEMENT

### Đặc tả API cho Requirement 04 - Hiển thị màn hình chính (MUST & WANT)

**API Endpoints**:

- `GET /dashboard` - Get dashboard data
- `GET /dashboard/widgets` - Get widgets by role

**Response**:

```json
{
  "widgets": [
    {
      "type": "string",
      "data": "object",
      "permissions": ["string"]
    }
  ],
  "notifications": {
    "unreadCount": "number",
    "recentItems": ["object"]
  },
  "shortcuts": ["object"],
  "charts": ["object"] // WANT only
}
```

**Server-side Logic**:

- Get user role và permissions
- Load widget configuration theo role
- Fetch unread notifications count
- Get personal account info
- Generate charts data (for WANT version)
- Handle role-based access control
- Log widget loading failures

**Estimate**: 18 giờ (MUST) + 8 giờ (WANT) = 26 giờ

### Đặc tả API cho Requirement 08 - Hiển thị thông tin hồ sơ cá nhân

**API Endpoints**:

- `GET /profile` - Get user profile

**Response**:

```json
{
  "avatar": "string",
  "fullName": "string",
  "email": "string", // masked
  "phone": "string", // masked
  "address": "object",
  "dateOfBirth": "string",
  "emergencyContact": "object"
}
```

**Server-side Logic**:

- Fetch user profile data
- Apply data masking cho sensitive info
- Handle missing data với placeholders
- Log PII access events
- Control display permissions

**Estimate**: 8 giờ

### Đặc tả API cho Requirement 09 - Thay đổi thông tin hồ sơ cá nhân

**API Endpoints**:

- `PUT /profile` - Update user profile
- `POST /profile/avatar` - Upload avatar

**Request Body**:

```json
{
  "fullName": "string",
  "address": "object",
  "phone": "string",
  "emergencyContact": "object"
}
```

**Server-side Logic**:

- Validate input data (required fields, formats, character limits)
- Check email duplication nếu update email
- Handle file upload cho avatar (size, format validation)
- Update database
- Send notification email về changes
- Log change history (old/new values, user, timestamp)
- Handle email verification pending state

**Estimate**: 16 giờ

---

## IV. CONTENT MANAGEMENT

### Đặc tả API cho Requirement 05 - Hiển thị thông báo

**API Endpoints**:

- `GET /notifications` - Get notifications list
- `GET /notifications/:id` - Get notification detail
- `PUT /notifications/:id/read` - Mark as read
- `GET /notifications/export` - Export to CSV

**Query Parameters**:

```
?category=string&page=number&limit=number
```

**Server-side Logic**:

- Fetch notifications với pagination
- Apply role-based filtering
- Update read status
- Generate CSV export
- Log view events
- Handle large datasets với pagination

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 06 - Hiển thị tin tức

**API Endpoints**:

- `GET /news` - Get news list
- `GET /news/:id` - Get news detail
- `PUT /news/:id/read` - Mark as read
- `GET /news/export` - Export to CSV

**Server-side Logic**:

- Fetch news với publication time filtering
- Check view permissions
- Update read status
- Generate notifications nếu cần
- Export CSV functionality
- Audit view events
- Pagination cho large datasets

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 07 - Hiển thị nội dung cải thiện kỹ năng tài chính

**API Endpoints**:

- `GET /financial-learning` - Get learning content list
- `GET /financial-learning/:id` - Get content detail
- `GET /financial-learning/:id/download` - Download file/video
- `PUT /financial-learning/:id/read` - Mark as read

**Server-side Logic**:

- Fetch learning content với category filtering
- Check view permissions
- Handle file/video downloads
- Update read status
- Audit view và download events
- Pagination support

**Estimate**: 14 giờ

---

## V. FUND PARTICIPATION MANAGEMENT

### Đặc tả API cho Requirement 12 - Tham gia quỹ (nộp đơn đăng ký)

**API Endpoints**:

- `POST /fund/registration` - Submit fund registration
- `GET /fund/registration/eligibility` - Check eligibility

**Request Body**:

```json
{
  "personalInfo": {
    "fullName": "object", // Kanji/Katakana
    "dateOfBirth": "string",
    "gender": "string",
    "address": "object",
    "email": "string",
    "phone": "string"
  },
  "employmentInfo": {
    "employmentType": "string",
    "startDate": "string",
    "baseSalary": "number"
  },
  "bankInfo": {
    "accountNumber": "string",
    "accountHolder": "string",
    "bankName": "string"
  },
  "emergencyContact": "object"
}
```

**Server-side Logic**:

- Validate required fields và formats
- Check eligibility (age, work years)
- Validate bank account info
- Save registration temporarily
- Start approval workflow
- Integrate với Corporate Pension system
- Send confirmation emails
- Log registration events

**Estimate**: 24 giờ

### Đặc tả API cho Requirement 13 - Hiển thị bảng điều khiển cá nhân

**API Endpoints**:

- `GET /participant/dashboard` - Get participant dashboard

**Response**:

```json
{
  "participationStatus": "object",
  "contributionInfo": "object",
  "registrations": ["object"],
  "notifications": ["object"],
  "ctaButtons": ["object"]
}
```

**Server-side Logic**:

- Fetch participation status
- Get contribution information
- Load pending registrations
- Get notifications
- Generate CTA buttons based on status
- Handle fallback khi missing data
- Log dashboard access events

**Estimate**: 14 giờ

### Đặc tả API cho Requirement 17 - Thay đổi khoản đóng góp

**API Endpoints**:

- `POST /fund/contribution/change` - Request contribution change
- `GET /fund/contribution/limits` - Get contribution limits

**Request Body**:

```json
{
  "newContributionRate": "number",
  "newContributionAmount": "number",
  "effectiveDate": "string",
  "reason": "string"
}
```

**Server-side Logic**:

- Validate contribution limits theo salary policy
- Check change frequency limits
- Validate future effective date
- Start approval workflow
- Integrate với CP system
- Send approval emails
- Log contribution change history
- Handle limit exceeded errors

**Estimate**: 18 giờ

### Đặc tả API cho Requirement 18 - Rút khỏi quỹ

**API Endpoints**:

- `POST /fund/withdrawal` - Request fund withdrawal
- `POST /fund/withdrawal/documents` - Upload proof documents

**Request Body**:

```json
{
  "withdrawalReason": "string",
  "disqualificationDate": "string",
  "proofDocuments": ["string"] // file IDs
}
```

**Server-side Logic**:

- Validate proof documents
- Check disqualification status
- Start approval workflow
- Update participant status
- Integrate với CP system
- Send completion notifications
- Log withdrawal history
- Handle date inconsistency errors

**Estimate**: 16 giờ

---

## VI. PERSONAL DATA & HISTORY

### Đặc tả API cho Requirement 14 - Hiển thị thông tin cơ sở dữ liệu cá nhân

**API Endpoints**:

- `GET /participant/history` - Get participation history
- `GET /participant/virtual-account` - Get virtual account info
- `GET /participant/export` - Export to CSV

**Response**:

```json
{
  "participationHistory": ["object"],
  "contributionHistory": ["object"],
  "virtualAccount": "object"
}
```

**Server-side Logic**:

- Fetch participation và contribution history
- Get virtual personal account data
- Generate CSV export
- Log PII access
- Optimize performance cho large history data

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 15 - Tham khảo khoản đóng góp

**API Endpoints**:

- `GET /participant/contribution-info` - Get contribution details
- `GET /participant/contribution-info/export` - Export PDF/CSV

**Response**:

```json
{
  "baseSalary": "number",
  "contributionRate": "number",
  "contributionAmount": "number",
  "changeHistory": ["object"],
  "lastUpdated": "string"
}
```

**Server-side Logic**:

- Fetch base salary và contribution rate
- Get contribution amount calculations
- Load change history
- Generate PDF/CSV exports
- Log access history
- Show last update timestamp

**Estimate**: 10 giờ

### Đặc tả API cho Requirement 16 - Hiển thị danh sách nội dung đã đăng ký

**API Endpoints**:

- `GET /participant/registrations` - Get registration list
- `GET /participant/registrations/:id` - Get registration detail

**Query Parameters**:

```
?type=string&dateFrom=string&dateTo=string&page=number
```

**Server-side Logic**:

- Fetch user's registrations với filtering
- Apply self-access only restriction
- Get registration details
- Pagination cho multiple items
- Log access events

**Estimate**: 8 giờ

---

## VII. SIMULATION TOOLS

### Đặc tả API cho Requirement 19 - Mô phỏng phí bảo hiểm xã hội (MUST & WANT)

**API Endpoints**:

- `POST /simulation/social-insurance` - Calculate social insurance
- `GET /simulation/social-insurance/export` - Export results

**Request Body**:

```json
{
  "baseSalary": "number",
  "expectedAnnualIncome": "number",
  "contributionRate": "number",
  "contributionAmount": "number",
  "familyConditions": "object"
}
```

**Response**:

```json
{
  "monthlyResults": ["object"],
  "totalAmount": "number",
  "charts": ["object"], // WANT only
  "tableData": ["object"],
  "filters": ["object"] // WANT only
}
```

**Server-side Logic**:

- Validate input ranges (min/max limits)
- Send data tới calculation engine
- Generate monthly/yearly tables
- Create charts (WANT version)
- Save simulation conditions (if agreed)
- Export PDF/CSV
- Warning cho extreme values

**Estimate**: 20 giờ (MUST) + 10 giờ (WANT) = 30 giờ

### Đặc tả API cho Requirement 20 - Mô phỏng mức giới hạn thu nhập năm (MUST & WANT)

**API Endpoints**:

- `POST /simulation/income-barrier` - Calculate annual income barrier
- `GET /simulation/income-barrier/export` - Export results

**Request Body**: Similar to requirement 19

**Server-side Logic**:

- Validate input ranges
- Calculate income barrier simulation
- Generate results table
- Create charts và filters (WANT version)
- Save simulation conditions
- Export functionality
- Handle extreme value warnings

**Estimate**: 20 giờ (MUST) + 10 giờ (WANT) = 30 giờ

---

## VIII. OFFICE ADMINISTRATION

### Đặc tả API cho Requirement 21 - Hiển thị bảng điều khiển quản trị

**API Endpoints**:

- `GET /admin/dashboard` - Get admin dashboard
- `GET /admin/dashboard/export` - Export dashboard data

**Response**:

```json
{
  "participantCount": "number",
  "registrationCount": "number",
  "contributionSummary": "object",
  "deepLinks": ["object"],
  "statistics": "object"
}
```

**Server-side Logic**:

- Check enterprise admin role
- Fetch participant statistics
- Get registration counts
- Calculate contribution summaries
- Generate deep links tới details
- Export CSV/images
- Log view và click events
- Handle delayed statistics processing

**Estimate**: 16 giờ

### Đặc tả API cho Requirement 22 - Hiển thị thông tin hồ sơ công ty

**API Endpoints**:

- `GET /admin/company-profile` - Get company profile

**Response**:

```json
{
  "companyName": "string",
  "address": "object",
  "representative": "object",
  "phone": "string",
  "registrationInfo": "object"
}
```

**Server-side Logic**:

- Check enterprise admin permissions
- Fetch company information
- Show placeholders cho unset values
- Log access events

**Estimate**: 6 giờ

### Đặc tả API cho Requirement 23 - Thay đổi thông tin hồ sơ công ty

**API Endpoints**:

- `PUT /admin/company-profile` - Update company profile

**Request Body**:

```json
{
  "address": "object",
  "phone": "string",
  "representative": "object"
}
```

**Server-side Logic**:

- Validate required fields và formats
- Check consistency với CP system
- Update database
- Integrate với CP API
- Send completion notifications
- Log change history
- Rollback nếu CP system error

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 24 - Hiển thị danh sách người tham gia

**API Endpoints**:

- `GET /admin/participants` - Get participants list
- `GET /admin/participants/export` - Export to CSV

**Query Parameters**:

```
?name=string&id=string&dateFrom=string&dateTo=string&page=number
```

**Server-side Logic**:

- Restrict to enterprise scope
- Search by name/ID/time
- Pagination cho large datasets
- Export CSV functionality
- Log access events
- Optimize performance

**Estimate**: 10 giờ

### Đặc tả API cho Requirement 25 - Đăng ký / Thay đổi thông tin người tham gia

**API Endpoints**:

- `POST /admin/participants` - Register new participant
- `PUT /admin/participants/:id` - Update participant
- `GET /admin/participants/:id` - Get participant detail

**Request Body**:

```json
{
  "personalInfo": "object",
  "contractType": "string",
  "salary": "number",
  "joinDate": "string"
}
```

**Server-side Logic**:

- Validate required fields và formats
- Check consistency
- Prevent duplicate registrations
- Integrate với CP system
- Send completion notifications
- Log change history
- Retry logic cho CP system errors

**Estimate**: 18 giờ

---

## IX. USER MANAGEMENT

### Đặc tả API cho Requirement 26 - Hiển thị danh sách người dùng

**API Endpoints**:

- `GET /admin/users` - Get users list

**Query Parameters**:

```
?name=string&email=string&role=string&page=number
```

**Response**:

```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "pagination": "object"
}
```

**Server-side Logic**:

- Filter by name/email/role
- Pagination support
- Export CSV option
- Log access events

**Estimate**: 8 giờ

### Đặc tả API cho Requirement 27 - Đăng ký / Thay đổi thông tin người dùng

**API Endpoints**:

- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `POST /admin/users/:id/activate` - Send activation email

**Request Body**:

```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "permissions": ["string"]
}
```

**Server-side Logic**:

- Validate email format và uniqueness
- Validate role permissions
- Send activation email với temporary password
- Log creation events
- Handle email delivery failures

**Estimate**: 14 giờ

### Đặc tả API cho Requirement 28 - Tải lên thông tin người dùng hàng loạt

**API Endpoints**:

- `POST /admin/users/bulk-upload` - Upload CSV/Excel
- `GET /admin/users/bulk-upload/:jobId/status` - Check upload status
- `GET /admin/users/bulk-upload/:jobId/errors` - Download error report

**Request Body**: File upload (multipart/form-data)

**Server-side Logic**:

- Validate file headers và data types
- Check required fields và duplicates
- Process upload asynchronously
- Generate error report CSV
- Log job execution details
- Recovery mechanism cho interrupted uploads

**Estimate**: 16 giờ

---

## X. CONTENT ADMINISTRATION

### Đặc tả API cho Requirement 29 - Hiển thị danh sách thông báo (cho văn phòng)

**API Endpoints**:

- `GET /admin/notifications` - Get notifications list

**Query Parameters**:

```
?dateFrom=string&dateTo=string&status=string&page=number
```

**Server-side Logic**:

- Filter by time range và publication status
- Check view permissions
- Pagination support
- Log access events

**Estimate**: 6 giờ

### Đặc tả API cho Requirement 30 - Đăng ký / Thay đổi thông báo (cho văn phòng)

**API Endpoints**:

- `POST /admin/notifications` - Create notification
- `PUT /admin/notifications/:id` - Update notification
- `POST /admin/notifications/:id/publish` - Publish notification

**Request Body**:

```json
{
  "title": "string",
  "content": "string",
  "scope": "string",
  "publishTime": "string",
  "attachments": ["string"]
}
```

**Server-side Logic**:

- Validate required fields
- XSS protection (sanitize scripts)
- Validate publication time
- Handle publish workflow
- Send notifications when published
- Version control cho edits
- Handle post-publication edits

**Estimate**: 14 giờ

---

## XI. APPLICATION MANAGEMENT

### Đặc tả API cho Requirement 31 - Hiển thị danh sách đơn đăng ký

**API Endpoints**:

- `GET /admin/applications` - Get applications list
- `GET /admin/applications/export` - Export to CSV

**Query Parameters**:

```
?type=string&dateFrom=string&dateTo=string&status=string&page=number
```

**Server-side Logic**:

- Filter by application type, date range, status
- Get applications list với details
- Export CSV functionality
- Pagination support
- Log access events

**Estimate**: 8 giờ

### Đặc tả API cho Requirement 32 - Xem chi tiết nội dung đơn đăng ký

**API Endpoints**:

- `GET /admin/applications/:id` - Get application detail
- `POST /admin/applications/:id/auto-validate` - Auto validation

**Response**:

```json
{
  "applicationData": "object",
  "validationResults": "object",
  "autoValidation": "object",
  "returnReasons": ["string"]
}
```

**Server-side Logic**:

- Fetch application details
- Auto-validate against minimum salary rules
- Display validation results
- Support manual check input for return reasons
- Log access và evaluation events
- Fallback to manual check khi AI fails

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 33 - Phê duyệt / Từ chối / Trả lại đơn đăng ký

**API Endpoints**:

- `POST /admin/applications/:id/approve` - Approve application
- `POST /admin/applications/:id/reject` - Reject application
- `POST /admin/applications/:id/return` - Return for revision

**Request Body**:

```json
{
  "action": "approve|reject|return",
  "comments": "string",
  "reason": "string"
}
```

**Server-side Logic**:

- Check approval permissions
- Prevent duplicate approvals
- Integrate với CP system
- Update application status
- Send result notifications tới applicant
- Log approval workflow
- Handle concurrent update conflicts

**Estimate**: 16 giờ

---

## XII. REPORTING & ANALYTICS

### Đặc tả API cho Requirement 34 - Hiển thị các loại báo cáo (MUST & WANT)

**API Endpoints**:

- `GET /admin/reports/types` - Get available report types
- `POST /admin/reports/generate` - Generate report
- `GET /admin/reports/:id/download` - Download report

**Request Body**:

```json
{
  "reportType": "string",
  "dateRange": "object",
  "office": "string",
  "metrics": ["string"]
}
```

**Response**:

```json
{
  "reportData": "object",
  "charts": ["object"], // WANT only
  "tableData": ["object"],
  "summary": "object"
}
```

**Server-side Logic**:

- Generate participation/withdrawal reports
- Support statistics by year/month (WANT)
- Async processing cho large datasets
- Export CSV/Excel/Charts
- Log data export history
- Handle large data processing

**Estimate**: 20 giờ (MUST) + 12 giờ (WANT) = 32 giờ

### Đặc tả API cho Requirement 35 - Xuất dữ liệu khoản đóng góp

**API Endpoints**:

- `POST /admin/contribution-export` - Export contribution data
- `GET /admin/contribution-export/:jobId/download` - Download export file

**Request Body**:

```json
{
  "month": "string",
  "format": "zengin|payroll",
  "options": "object"
}
```

**Server-side Logic**:

- Extract contribution data for specific month
- Format theo Zengin standard hoặc payroll interface
- Generate CSV file
- Verify data integrity với CRC
- Log export jobs với record counts
- Support regeneration hoặc differential exports

**Estimate**: 14 giờ

---

## XIII. DOCUMENT MANAGEMENT

### Đặc tả API cho Requirement 36 - Quản lý các tài liệu như điều khoản

**API Endpoints**:

- `GET /admin/documents` - Get documents list
- `POST /admin/documents` - Upload document
- `PUT /admin/documents/:id` - Update document
- `DELETE /admin/documents/:id` - Delete document

**Request Body**:

```json
{
  "title": "string",
  "documentType": "string",
  "effectiveDate": "string",
  "expiryDate": "string"
}
```

**Server-side Logic**:

- Validate file format (extension) và size
- Virus scanning
- Set publication permissions
- Generate public access links
- Version management
- Auto-hide expired documents
- Log document changes

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 37 - Đăng ký / Thay đổi tài liệu liên quan

**API Endpoints**: Same as Requirement 36

**Server-side Logic**: Similar to Requirement 36 với additional:

- Link to related documents validation
- Prevent registration khi related docs không tồn tại

**Estimate**: 8 giờ

---

## XIV. SYSTEM ADMINISTRATION

### Đặc tả API cho Requirement 38 - Đăng nhập với tư cách quản trị viên

**API Endpoints**:

- `POST /admin/auth/login` - PF system admin login
- `POST /admin/auth/mfa-verify` - MFA verification

**Request Body**:

```json
{
  "identifier": "string",
  "password": "string",
  "mfaCode": "string"
}
```

**Server-side Logic**:

- Require MFA authentication
- IP address restrictions
- Enhanced logging for admin access
- Fallback mechanism khi MFA delayed
- Generate admin dashboard access token

**Estimate**: 16 giờ

---

## XV. TAX & SALARY DATA MANAGEMENT

### Đặc tả API cho Requirement 39 - Hiển thị danh sách dữ liệu thuế cư trú

**API Endpoints**:

- `GET /admin/residential-tax` - Get residential tax data

**Query Parameters**:

```
?year=number&region=string&taxType=string&page=number
```

**Server-side Logic**:

- Filter by year, region, tax type
- Pagination support
- Access control for tax data
- Log access events
- Handle no data scenarios

**Estimate**: 8 giờ

### Đặc tả API cho Requirement 40 - Đăng ký / Cập nhật dữ liệu thuế cư trú

**API Endpoints**:

- `POST /admin/residential-tax` - Create tax data
- `PUT /admin/residential-tax/:id` - Update tax data

**Request Body**:

```json
{
  "fiscalYear": "number",
  "region": "string",
  "taxRate": "number",
  "effectiveDate": "string",
  "expiryDate": "string"
}
```

**Server-side Logic**:

- Validate required fields và number formats
- Check duplicate records (year + region)
- Validate value ranges (tax rate <= 20%)
- Prevent effective date conflicts
- Version management
- Log change history

**Estimate**: 12 giờ

### Đặc tả API cho Requirement 41 - Cập nhật dữ liệu thuế cư trú hàng loạt

**API Endpoints**:

- `POST /admin/residential-tax/bulk-upload` - Bulk upload
- `GET /admin/residential-tax/bulk-upload/:jobId/status` - Job status

**Server-side Logic**:

- Validate CSV/Excel structure
- Check data types và required fields
- Duplicate year+region detection
- Async processing với progress tracking
- Generate error report CSV
- Recovery mechanism cho interrupted jobs

**Estimate**: 14 giờ

### Đặc tả API cho Requirement 42-44 - Dữ liệu lương tối thiểu

**API Endpoints**:

- `GET /admin/minimum-wage` - List minimum wage data
- `POST /admin/minimum-wage` - Create minimum wage data
- `PUT /admin/minimum-wage/:id` - Update minimum wage data
- `POST /admin/minimum-wage/bulk-upload` - Bulk upload

**Server-side Logic**: Similar to residential tax management với:

- Region + Year combination validation
- Salary amount format validation
- Bulk upload processing
- Error reporting

**Estimate**: 8 + 10 + 12 = 30 giờ

---

## XVI. OFFICE & USER SYSTEM MANAGEMENT

### Đặc tả API cho Requirement 45-48 - Quản lý văn phòng & người dùng hệ thống

**API Endpoints**:

- `GET /admin/offices` - List participating offices
- `POST /admin/offices` - Register/Update office
- `GET /admin/system-users` - List registered users
- `POST /admin/system-users` - Register/Update system user

**Server-side Logic**:

- Office management với company validation
- User management với role permissions
- Email activation workflow
- Bulk operations support
- Access logging

**Estimate**: 6 + 12 + 8 + 12 = 38 giờ

---

## XVII. SYSTEM NOTIFICATIONS & DOCUMENTS

### Đặc tả API cho Requirement 49-52 - Quản lý thông báo & tài liệu hệ thống

**API Endpoints**:

- `GET /admin/system-notifications` - System notifications
- `POST /admin/system-notifications` - Create/Update system notification
- `GET /admin/system-documents` - Document management
- `POST /admin/system-documents` - Register/Update documents

**Server-side Logic**:

- System-wide vs office-specific notifications
- Document version management
- Auto-publish/hide based on dates
- File security scanning
- Public link generation

**Estimate**: 6 + 12 + 10 + 8 = 36 giờ

---

## XVIII. FINANCIAL LITERACY CONTENT MANAGEMENT

### Đặc tả API cho Requirement 53-54 - Quản lý nội dung FL (Batch Job)

**API Endpoints**:

- `GET /admin/fl-content` - List FL content
- `POST /admin/fl-content` - Create/Update FL content
- `POST /admin/fl-content/:id/publish` - Publish content

**Server-side Logic**:

- Content categorization và targeting
- File attachment handling
- Publication workflow
- User notification system
- Version control

**Estimate**: 8 + 14 = 22 giờ

---

## XIX. BATCH JOBS - EXTERNAL SYSTEM INTEGRATION

### Đặc tả Batch Job cho Requirement 55 - Liên kết thông tin người muốn tham gia với hệ thống CP

**Batch Job**: `SyncParticipantDataJob`

**Schedule**: Daily (configured in cron)

**Logic**:

- Extract employee data from HR database
- Transform data theo CP system specification
- Validate required fields, data types, character encoding
- Send to Corporate Pension system API
- Process response và update status
- Generate execution report
- Retry mechanism cho failed records
- Error isolation để avoid job failure

**Estimate**: 20 giờ

### Đặc tả Batch Job cho Requirement 56 - Liên kết khoản đóng góp đã được phê duyệt với CP

**Batch Job**: `SyncApprovedContributionsJob`

**Schedule**: Monthly hoặc on-demand

**Logic**:

- Extract approved contribution changes
- Validate amount ranges và consistency
- Transform data format cho CP system
- Send contribution data to CP API
- Process acknowledgment responses
- Generate import result reports
- Retry logic cho CP system delays

**Estimate**: 16 giờ

### Đặc tả Batch Job cho Requirement 57 - Liên kết thông tin người bị mất quyền với CP

**Batch Job**: `SyncDisqualifiedParticipantsJob`

**Schedule**: Weekly

**Logic**:

- Extract disqualification records
- Validate disqualification dates và reasons
- Transform data cho CP system format
- Send disqualification notifications to CP
- Update participant status based on response
- Handle date inconsistency filtering

**Estimate**: 14 giờ

### Đặc tả Batch Job cho Requirement 58 - Liên kết thông báo kết quả từ CP

**Batch Job**: `ReceiveCPNotificationsJob`

**Schedule**: Continuous polling hoặc webhook

**Logic**:

- Receive notifications from CP system
- Validate digital signatures
- Verify data format integrity
- Update application status
- Send notifications to users
- Duplicate detection và prevention
- Log reception và application events

**Estimate**: 18 giờ

### Đặc tả Batch Job cho Requirement 59 - Liên kết dữ liệu điện tử từ CP

**Batch Job**: `ReceiveCPElectronicDataJob`

**Schedule**: As needed

**Logic**:

- Receive electronic files from CP system
- Validate file size, format, digital signatures
- Store files securely
- Distribute to relevant users với notifications
- Generate public access links
- Quarantine corrupted files
- Log storage và distribution events

**Estimate**: 16 giờ

### Đặc tả Batch Job cho Requirement 60 - Liên kết thông tin nhân viên từ DB nhân sự

**Batch Job**: `SyncHRDatabaseJob`

**Schedule**: Daily

**Logic**:

- Connect to HR database
- Extract employee information với incremental updates
- Validate schema consistency và data types
- Transform data cho internal format
- Apply differential updates to avoid conflicts
- Handle duplicate record merging strategies
- Monitor job performance và data volume

**Estimate**: 20 giờ

---

## XX. TỔNG KẾT ESTIMATES

### Breakdown theo loại công việc

**Authentication & User Management**: 62 giờ

- Login: 16 giờ
- Password reset: 20 giờ
- Change password: 12 giờ
- Change email: 14 giờ

**Dashboard & Profile**: 50 giờ

- Main dashboard (MUST + WANT): 26 giờ
- Profile display: 8 giờ
- Profile update: 16 giờ

**Content Management**: 38 giờ

- Notifications: 12 giờ
- News: 12 giờ
- Financial learning: 14 giờ

**Fund Participation**: 72 giờ

- Registration: 24 giờ
- Dashboard: 14 giờ
- Contribution change: 18 giờ
- Withdrawal: 16 giờ

**Personal Data & History**: 30 giờ

- Database info: 12 giờ
- Contribution info: 10 giờ
- Registration list: 8 giờ

**Simulation Tools**: 60 giờ

- Social insurance (MUST + WANT): 30 giờ
- Income barrier (MUST + WANT): 30 giờ

**Office Administration**: 44 giờ

- Admin dashboard: 16 giờ
- Company profile: 18 giờ (6+12)
- Participants management: 28 giờ (10+18)

**User Management**: 38 giờ

- User list: 8 giờ
- User CRUD: 14 giờ
- Bulk upload: 16 giờ

**Content Administration**: 20 giờ

- Notification management: 20 giờ (6+14)

**Application Management**: 36 giờ

- Application list: 8 giờ
- Application detail: 12 giờ
- Approval workflow: 16 giờ

**Reporting & Analytics**: 46 giờ

- Reports (MUST + WANT): 32 giờ
- Contribution export: 14 giờ

**Document Management**: 20 giờ

- Terms documents: 12 giờ
- Related documents: 8 giờ

**System Administration**: 16 giờ

- Admin login with MFA: 16 giờ

**Tax & Salary Data**: 64 giờ

- Residential tax: 34 giờ (8+12+14)
- Minimum wage: 30 giờ

**System Management**: 74 giờ

- Office management: 18 giờ
- System user management: 20 giờ
- System notifications: 18 giờ
- System documents: 18 giờ

**Financial Literacy**: 22 giờ

- Content management: 22 giờ

**Batch Jobs**: 104 giờ

- Participant sync: 20 giờ
- Contribution sync: 16 giờ
- Disqualified sync: 14 giờ
- CP notifications: 18 giờ
- Electronic data: 16 giờ
- HR database sync: 20 giờ

**Project Setup**: 40 giờ

- Initial setup: 40 giờ

### **TỔNG CỘNG: 796 giờ**

### **Tính theo ngày làm việc (8 giờ/ngày): ~100 ngày**

---

## XXI. GHI CHÚ QUAN TRỌNG

1. **Estimates không bao gồm code review time** theo yêu cầu
2. **Tất cả estimates dành cho Junior Engineer** với 2 năm kinh nghiệm
3. **Complex workflows có thể cần guidance từ Senior**, nhưng chỉ tính effort của Junior
4. **Integration với External Corporate Pension System** được tính trong các batch jobs
5. **Mỗi API endpoint tuân thủ RESTful conventions và NestJS best practices**
6. **Batch jobs sử dụng NestJS Schedule module và proper error handling**
