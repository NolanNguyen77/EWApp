# Java Security Checklist (OWASP Top 10)

Sử dụng checklist này để đối soát các file Java (Spring Boot) cần review.

## 1. SQL Injection (A1)
- [ ] KHÔNG dùng string concatenation để tạo query.
- [ ] Dùng `PreparedStatement` hoặc `JdbcTemplate` với tham số `?`.
- [ ] Với JPA/Hibernate: Dùng `Named Queries` hoặc `@Query` với `:paramName`.

## 2. Broken Authentication (A2)
- [ ] Tránh truyền mật khẩu/token qua query params trong URL.
- [ ] KHÔNG hard-code mật khẩu hoặc API Key.
- [ ] Dùng thư viện chuẩn như Spring Security để xử lý Auth.

## 3. Sensitive Data Exposure (A3)
- [ ] Dữ liệu nhạy cảm (PII, mật khẩu) phải được hash/encrypt khi lưu và mask khi log.
- [ ] Kiểm tra xem có dùng TLS cho mọi request nhạy cảm không.
- [ ] Tránh in dữ liệu nhạy cảm ra log (dùng tool masking hoặc annotation như `@ToString.Exclude`).

## 4. Cross-Site Scripting (XSS) (A7)
- [ ] Validate đầu vào người dùng: `StringEscapeUtils.escapeHtml4()` hoặc dùng template engine có auto-escape (như Thymeleaf).
- [ ] Thiết lập Header bảo mật như `Content-Security-Policy`.

## 5. Security Misconfiguration (A6)
- [ ] Kiểm tra xem có tắt thông tin lỗi chi tiết khi ở production không (không lộ stack trace cho user).
- [ ] Tắt các method không dùng (như TRACE, OPTIONS nếu không cần).
- [ ] Dùng đúng các annotation bảo mật `@EnableWebSecurity`, `@Configuration`.
