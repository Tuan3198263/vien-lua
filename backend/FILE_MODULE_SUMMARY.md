# Module Quản Lý File Hệ Thống - Tóm Tắt Triển Khai

## ✅ ĐÃ HOÀN THÀNH

### 📦 1. Cài Đặt Packages

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer @types/multer uuid @types/uuid
```

**Packages đã cài:**

- `@aws-sdk/client-s3`: SDK AWS S3 chính thức
- `@aws-sdk/s3-request-presigner`: Tạo presigned URL
- `multer` + `@types/multer`: Xử lý upload multipart
- `uuid` + `@types/uuid`: Tạo tên file unique

---

### ⚙️ 2. Cấu Hình

#### **File `.env`**

Đã thêm các biến AWS S3:

```env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_S3_BUCKET_NAME=vien-lua-files
```

> ⚠️ **Bạn cần:**
>
> 1. Đăng ký AWS Account
> 2. Tạo S3 Bucket
> 3. Tạo IAM User và lấy Access Key
> 4. Điền thông tin vào `.env`
>
> → Xem chi tiết: `AWS_S3_SETUP_GUIDE.md`

#### **File `src/config/s3.config.ts`**

Config class để khởi tạo S3 Client:

- `getS3Client()`: Lấy S3 client instance
- `getBucketName()`: Lấy tên bucket

---

### 🗄️ 3. Database

#### **Table: `file_he_thong`**

| Field            | Type                | Description                   |
| ---------------- | ------------------- | ----------------------------- |
| `id`             | INT (PK)            | ID tự tăng                    |
| `ten_goc`        | VARCHAR(255)        | Tên file gốc                  |
| `ten_luu_tru`    | VARCHAR(255) UNIQUE | Tên file trên S3              |
| `duong_dan_s3`   | VARCHAR(500)        | Full path S3                  |
| `kich_thuoc`     | INT                 | Kích thước (bytes)            |
| `loai_file`      | VARCHAR(100)        | MIME type                     |
| `module`         | VARCHAR(100)        | Tên module (HOP_DONG...)      |
| `ban_ghi_id`     | INT                 | ID bản ghi trong module       |
| `ten_truong`     | VARCHAR(100)        | Tên trường (file_hop_dong...) |
| `nguoi_cap_nhat` | INT                 | ID người upload               |
| `ngay_tao`       | DATETIME            | Ngày tạo                      |
| `ngay_cap_nhat`  | DATETIME            | Ngày cập nhật                 |

**Constraints:**

- UNIQUE: `(module, ban_ghi_id, ten_truong)` → 1 trường chỉ có 1 file
- INDEX: `(module, ban_ghi_id)` → Tăng tốc query

**Cách tạo table:**

- Tự động tạo khi chạy backend (do `synchronize: true` trong development)
- Hoặc chạy migration nếu production

---

### 📁 4. Cấu Trúc Module

```
backend/src/modules/FileHeThong/
├── file-he-thong.entity.ts        # Entity (table file_he_thong)
├── file-he-thong.service.ts       # Business logic + AWS S3
├── file-he-thong.controller.ts    # REST API endpoints
├── file-he-thong.module.ts        # Module config
└── dto/
    └── file-he-thong.dto.ts       # DTOs (Upload, Get, Delete...)
```

**Các file khác:**

- `src/config/s3.config.ts`: Config AWS S3
- `src/shared/utils/file.utils.ts`: Helper xử lý file
- `src/config/database.config.ts`: ✅ Đã thêm FileHeThong entity
- `src/app.module.ts`: ✅ Đã import FileHeThongModule

---

### 🔧 5. Các Chức Năng Chính

#### **5.1. Upload File (Service)**

```typescript
await fileHeThongService.uploadFile(
  file, // File từ multer
  {
    module: "HOP_DONG",
    ban_ghi_id: 5,
    ten_truong: "file_hop_dong",
  },
  nguoi_cap_nhat_id
);
```

**Logic:**

1. Validate file (type, size)
2. Kiểm tra file cũ → Xóa nếu có
3. Tạo tên unique
4. Upload lên S3
5. Lưu metadata vào database
6. Trả về presigned URL

#### **5.2. Lấy File**

```typescript
const file = await fileHeThongService.layFile({
  module: "HOP_DONG",
  ban_ghi_id: 5,
  ten_truong: "file_hop_dong",
});
```

**Return:** `{ id, ten_goc, url_xem, ... }` hoặc `null`

#### **5.3. Xóa File**

```typescript
await fileHeThongService.xoaFile({
  module: "HOP_DONG",
  ban_ghi_id: 5,
  ten_truong: "file_hop_dong",
});
```

**Logic:** Xóa khỏi S3 + Database

#### **5.4. Xóa Tất Cả File Của Bản Ghi**

```typescript
await fileHeThongService.xoaFileCuaBanGhi({
  module: "HOP_DONG",
  ban_ghi_id: 5,
});
```

**Dùng khi:** Xóa bản ghi trong module (cascade delete)

---

### 🌐 6. REST APIs

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| POST   | `/api/file-he-thong/upload`   | Upload file                                |
| GET    | `/api/file-he-thong/lay-file` | Lấy file theo module/ban_ghi_id/ten_truong |
| GET    | `/api/file-he-thong/:id`      | Lấy file theo ID                           |
| GET    | `/api/file-he-thong`          | Danh sách file (admin)                     |
| DELETE | `/api/file-he-thong/xoa`      | Xóa file                                   |
| DELETE | `/api/file-he-thong/:id`      | Xóa file theo ID (admin)                   |

**Tất cả API đều require JWT token!**

---

### 📚 7. Tài Liệu Hướng Dẫn

#### **File `AWS_S3_SETUP_GUIDE.md`**

Hướng dẫn chi tiết:

- Đăng ký AWS Account
- Tạo S3 Bucket
- Tạo IAM User và lấy Access Key
- Cấu hình CORS
- Test module

#### **File `FILE_INTEGRATION_GUIDE.md`**

Hướng dẫn tích hợp vào module khác:

- Import module và service
- Implement CRUD có file
- Flow frontend
- Ví dụ cụ thể với module HopDong

---

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Setup AWS S3

Làm theo `AWS_S3_SETUP_GUIDE.md`:

1. Đăng ký AWS
2. Tạo bucket `vien-lua-files`
3. Lấy Access Key
4. Điền vào `.env`

### Bước 2: Chạy Backend

```bash
cd backend
npm run start:dev
```

Backend sẽ tự động tạo table `file_he_thong` trong database.

### Bước 3: Test API (Postman)

```
POST http://localhost:3001/api/file-he-thong/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
  file: <chọn file>
  module: "TEST"
  ban_ghi_id: 1
  ten_truong: "file_test"
```

### Bước 4: Tích Hợp Vào Module

Làm theo `FILE_INTEGRATION_GUIDE.md`:

```typescript
// 1. Import module
import { FileHeThongModule } from '../FileHeThong/file-he-thong.module';

// 2. Inject service
constructor(private fileHeThongService: FileHeThongService) {}

// 3. Gọi uploadFile() khi create/update
await this.fileHeThongService.uploadFile(file, { ... }, userId);
```

---

## 📋 CHECKLIST TRIỂN KHAI

- [x] Cài đặt packages AWS S3
- [x] Thêm biến môi trường `.env`
- [x] Tạo S3 config
- [x] Tạo File utils
- [x] Tạo Entity FileHeThong
- [x] Tạo DTOs
- [x] Tạo Service (upload/delete S3)
- [x] Tạo Controller (REST APIs)
- [x] Tạo Module
- [x] Cập nhật database config
- [x] Import vào app module
- [x] Viết hướng dẫn setup AWS
- [x] Viết hướng dẫn tích hợp
- [ ] Setup AWS S3 account (người dùng tự làm)
- [ ] Test API upload (sau khi setup AWS)
- [ ] Tích hợp vào module khác (khi cần)

---

## 🎯 ƯU ĐIỂM THIẾT KẾ

✅ **Đơn giản:** Chỉ 1 table, logic rõ ràng
✅ **Reusable:** Dùng được cho mọi module
✅ **Tự động:** Xóa file cũ khi upload mới
✅ **An toàn:** Presigned URL có thời hạn
✅ **Chuẩn:** Tuân theo style guide của dự án
✅ **Mở rộng:** Dễ thêm tính năng sau này

---

## 📝 GHI CHÚ QUAN TRỌNG

### File Size Limit

- Hiện tại: **4MB** mỗi file
- Có thể thay đổi trong `FileInterceptor` options

### Allowed File Types

- PDF, Word, TXT, Images (JPG, PNG, GIF, WEBP)
- Có thể thay đổi trong `FileUtils.isAllowedFileType()`

### Presigned URL

- Có hiệu lực: **1 giờ**
- Sau 1 giờ cần gọi lại API để lấy URL mới

### AWS Free Tier

- 5GB storage
- 20,000 GET requests/tháng
- 2,000 PUT requests/tháng
- **→ Đủ cho dự án nhỏ/vừa hoàn toàn miễn phí!**

---

## 🔗 LINKS THAM KHẢO

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Multer Documentation](https://github.com/expressjs/multer)

---

**Module đã sẵn sàng sử dụng! 🎉**

Chỉ cần setup AWS S3 và có thể bắt đầu upload file ngay!
