# Backend - Viện Lúa

Hệ thống backend API quản lý nghiên cứu và thí nghiệm lúa, xây dựng với NestJS + TypeORM + MySQL.

## 🛠️ Công nghệ

- **NestJS** - Framework backend
- **TypeORM** - ORM quản lý database
- **MySQL** - Database
- **AWS S3** - Lưu trữ file
- **JWT** - Authentication

## 📁 Cấu trúc chính

```
src/
├── modules/          # Các module chức năng
│   ├── NguoiDung/   # Quản lý người dùng
│   ├── VaiTro/      # Quản lý vai trò
│   ├── PhanQuyen/   # Phân quyền
│   ├── DeTai/       # Đề tài nghiên cứu
│   ├── DauThau/     # Đấu thầu
│   ├── DeCuongThiNghiem/ # Đề cương thí nghiệm
│   ├── HopDong/     # Hợp đồng
│   └── FileHeThong/ # Quản lý file
├── common/          # Guards, filters, decorators
├── config/          # Cấu hình database, S3
├── core/            # Database, logger
└── shared/          # Utils, constants, interfaces
```

## 🚀 Chạy dự án

**Development:**

```bash
npm install
npm run start:dev
```

API chạy tại: `http://localhost:3001/api`

**Production:**

```bash
npm run build
npm run start:prod
```

## 🔑 Cấu hình

Tạo file `.env` với các biến:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database
- `JWT_SECRET` - Bảo mật JWT
- `AWS_*` - Cấu hình S3 (region, bucket, access keys)

## 🎯 Tính năng chính

### Authentication & Authorization

- Đăng nhập/đăng xuất với JWT
- Phân quyền theo vai trò và module
- Guard bảo vệ API endpoints

### Quản lý nghiên cứu

- **Đề tài**: Thông tin, người tham gia, sản phẩm
- **Đấu thầu**: Gói thầu, tiến độ
- **Đề cương thí nghiệm**: Nhà lưới, sổ bề, số lượng thí nghiệm
- **Hợp đồng**: Theo dõi hợp đồng nghiên cứu
  ...

### File Management

- Upload/download files qua S3
- Phân loại theo module (DE_TAI, DAU_THAU, etc.)
- Xóa file cascade khi xóa record

### Query & Filter

- Pagination, sorting
- Tìm kiếm theo nhiều trường
- Filter theo danh mục, trạng thái

## 📝 API Documentation

Chi tiết API cho từng module:

- `DE_TAI_API_GUIDE.md` - API đề tài
- `DAU_THAU_API_GUIDE.md` - API đấu thầu
- `HOP_DONG_API_GUIDE.md` - API hợp đồng
- `PHAN_QUYEN_API_GUIDE.md` - API phân quyền
- `FILE_INTEGRATION_GUIDE.md` - Hướng dẫn upload file
  ...

## 🏗️ Kiến trúc

**Module pattern**: Mỗi chức năng là một module độc lập với:

- Entity (TypeORM) - Database model
- DTO - Validation và transfer data
- Service - Business logic
- Controller - API endpoints

**Global components**:

- Exception Filter - Xử lý lỗi database (max_questions, FK constraints)
- JWT Guard - Bảo vệ endpoints yêu cầu đăng nhập
- Roles Guard - Kiểm tra quyền truy cập

## 🔗 Links

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
