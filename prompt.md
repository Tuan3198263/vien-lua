Hãy đóng vai một backend/fullstack developer có kinh nghiệm triển khai dự án thực tế.

Khởi tạo một dự án (boilerplate, chưa có nghiệp vụ) cho web app (dashboard quản lý) đơn giản.

Mục tiêu:

- Làm mẫu kiến trúc cho dự án cá nhân / học tập
- Có thể mở rộng thành dự án thật sau này

Stack công nghệ:

1. Frontend

   - React + TypeScript (sử dụng Vite)
   - UI framework: Ant Design
   - Chỉ cần 1 trang demo (Dashboard)

2. Backend

   - NestJS
   - Kiến trúc: Modular Architecture (chia theo module/feature)
   - Có ít nhất 1 module mẫu (ví dụ: User)
   - Sử dụng TypeORM kết nối MySQL
   - Chưa cần triển khai logic nghiệp vụ

3. Database

   - MySQL
   - thông tin kết nối (host: sql.freedb.tech, 3306, db_name: freedb_vien_lua, db_user: freedb_tuanle2901, password: 8KWDRXuY!AbwG%S)

4. Triển khai
   - Docker hoá frontend và backend
   - Docker Compose để chạy toàn bộ hệ thống
   - CI/CD bằng GitHub Actions
   - Deploy lên AWS EC2 bằng SSH (có thể triển khai sau)

Phạm vi & ràng buộc:

- Khởi tạo cấu trúc thư mục chuẩn thực tế cho frontend và backend (có thể chưa cần khởi tạo file)
- KHÔNG triển khai CRUD hay business logic
- Code ngắn gọn, dễ hiểu, có comment tiếng Việt
- Chỉ cung cấp nội dung cho các file quan trọng
- Tách rõ frontend / backend / docker / ci-cd
- Cần các file .md cho cả frontend và backend

Kết quả cần trả về:

- Sơ đồ kiến trúc tổng thể
- Cấu trúc thư mục của toàn bộ repo
- Nội dung các file quan trọng:
  - Frontend: main.tsx, App.tsx, Dockerfile ...
  - Backend: main.ts, app.module.ts, database config, module mẫu..
  - Kiểm tra kết nối tới csdl
  - Docker: docker-compose.yml..
  - CI/CD: deploy.yml..
- Giải thích ngắn gọn vai trò của từng phần
- Lưu ý: luôn trả lời prompt bằng tiếng Việt.
