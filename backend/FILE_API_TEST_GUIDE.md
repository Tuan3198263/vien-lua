# Hướng Dẫn Test API Module File Hệ Thống

## 📋 Tổng Quan

File này hướng dẫn test các API của module File Hệ Thống để hiểu rõ luồng hoạt động.

**Tool test:** Postman, Thunder Client, hoặc curl

**Base URL:** `http://localhost:3001/api/file-he-thong`

---

## 🔑 Chuẩn Bị

### 1. Đăng Nhập Lấy Token

```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "tai_khoan": "admin",
  "mat_khau": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**→ Copy `access_token` để dùng cho các API sau**

---

## 📤 TEST API 1: UPLOAD FILE

### Request

```http
POST http://localhost:3001/api/file-he-thong/upload
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

Body (form-data):
  file: <chọn file từ máy>
  module: "TEST"
  ban_ghi_id: 1
  ten_truong: "file_test"
```

### Cách Test Trên Postman

1. Chọn method **POST**
2. URL: `http://localhost:3001/api/file-he-thong/upload`
3. Tab **Authorization**:
   - Type: **Bearer Token**
   - Token: Paste token từ bước login
4. Tab **Body**:
   - Chọn **form-data**
   - Thêm các field:
     ```
     file       | File      | <Click Select Files>
     module     | Text      | TEST
     ban_ghi_id | Text      | 1
     ten_truong | Text      | file_test
     ```
5. Click **Send**

### Response Mong Đợi

```json
{
  "success": true,
  "message": "Upload file thành công",
  "data": {
    "id": 1,
    "ten_goc": "test.pdf",
    "ten_luu_tru": "test_1767180707448_c627a3f7.pdf",
    "duong_dan_s3": "vien-lua-file/test_1767180707448_c627a3f7.pdf",
    "kich_thuoc": 71627,
    "loai_file": "application/pdf",
    "module": "TEST",
    "ban_ghi_id": 1,
    "ten_truong": "file_test",
    "nguoi_cap_nhat": 7,
    "ngay_tao": "2025-12-31T04:31:49.833Z",
    "ngay_cap_nhat": "2025-12-31T04:31:49.833Z",
    "url_xem": "https://vien-lua-file.s3.ap-southeast-2.amazonaws.com/test_1767180707448_c627a3f7.pdf?X-Amz-Algorithm=..."
  }
}
```

### Kiểm Tra

- ✅ Status code: **201 Created**
- ✅ `success: true`
- ✅ Có `id` file
- ✅ Có `url_xem` → Copy URL này vào browser để xem file

### Lưu Ý

- **Lưu lại `id` của file** để dùng cho các test sau
- URL `url_xem` có hiệu lực **1 giờ**
- Mỗi lần upload cùng `module + ban_ghi_id + ten_truong` → File cũ bị thay thế

---

## 🔄 TEST API 2: UPLOAD LẠI (REPLACE FILE CŨ)

### Request

```http
POST http://localhost:3001/api/file-he-thong/upload
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

Body (form-data):
  file: <chọn file KHÁC>
  module: "TEST"
  ban_ghi_id: 1
  ten_truong: "file_test"
```

### Kết Quả Mong Đợi

- File cũ trên S3 **bị xóa**
- File mới được upload lên
- `id` trong database **giữ nguyên** (update record)
- `ten_luu_tru` mới
- `url_xem` mới

### Response

```json
{
  "success": true,
  "message": "Upload file thành công",
  "data": {
    "id": 1, // ← Vẫn là 1 (update, không tạo mới)
    "ten_goc": "new-file.pdf",
    "ten_luu_tru": "new-file_1767181000000_d738b4c8.pdf", // ← Khác
    "url_xem": "https://..." // ← URL mới
  }
}
```

---

## 📥 TEST API 3: LẤY THÔNG TIN FILE THEO MODULE/BẢN GHI/TRƯỜNG

### Request

```http
GET http://localhost:3001/api/file-he-thong/lay-file?module=TEST&ban_ghi_id=1&ten_truong=file_test
Authorization: Bearer <your_token>
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_goc": "test.pdf",
    "kich_thuoc": 71627,
    "loai_file": "application/pdf",
    "url_xem": "https://..." // ← URL mới được tạo
  }
}
```

### Use Case

- Dùng khi **xem chi tiết bản ghi** (ví dụ: xem chi tiết hợp đồng có file)
- Frontend call API này để lấy file và hiển thị

---

## 📥 TEST API 4: LẤY FILE THEO ID

### Request

```http
GET http://localhost:3001/api/file-he-thong/1
Authorization: Bearer <your_token>
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_goc": "test.pdf",
    "ten_luu_tru": "test_1767180707448_c627a3f7.pdf",
    "kich_thuoc": 71627,
    "loai_file": "application/pdf",
    "module": "TEST",
    "ban_ghi_id": 1,
    "ten_truong": "file_test",
    "url_xem": "https://..."
  }
}
```

### Use Case

- Dùng khi biết `id` file (từ danh sách hoặc bản ghi khác)
- Click "Xem" trong table danh sách file

---

## 📋 TEST API 5: LẤY DANH SÁCH FILE (PHÂN TRANG)

### Request Cơ Bản

```http
GET http://localhost:3001/api/file-he-thong?page=1&limit=10
Authorization: Bearer <your_token>
```

### Request Có Filter

```http
GET http://localhost:3001/api/file-he-thong?page=1&limit=10&module=TEST&loai_file=application/pdf
Authorization: Bearer <your_token>
```

### Response

```json
{
  "data": [
    {
      "id": 1,
      "ten_goc": "test.pdf",
      "kich_thuoc": 71627,
      "loai_file": "application/pdf",
      "module": "TEST",
      "ban_ghi_id": 1,
      "ten_truong": "file_test",
      "ngay_tao": "2025-12-31T04:31:49.833Z",
      "url_xem": "https://..." // ← Có URL để xem ngay
    }
    // ... các file khác
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "total_pages": 3,
    "has_previous": false,
    "has_next": true
  }
}
```

### Các Filter Có Thể Dùng

| Param       | Ví Dụ             | Mô Tả                    |
| ----------- | ----------------- | ------------------------ |
| `page`      | `1`               | Trang hiện tại           |
| `limit`     | `10`              | Số bản ghi/trang         |
| `module`    | `TEST`            | Lọc theo module          |
| `loai_file` | `application/pdf` | Lọc theo loại file       |
| `ten_goc`   | `test`            | Tìm theo tên file (LIKE) |

### Use Case

- Hiển thị table "Tài liệu hệ thống"
- Admin xem tổng quan file
- Filter file theo module/loại

---

## 🗑️ TEST API 6: XÓA FILE (THEO QUERY)

### Request

```http
DELETE http://localhost:3001/api/file-he-thong/xoa?module=TEST&ban_ghi_id=1&ten_truong=file_test
Authorization: Bearer <your_token>
```

### Response

```json
{
  "success": true,
  "message": "Xóa file thành công"
}
```

### Kết Quả

- File trên **S3 bị xóa**
- Record trong **database bị xóa**
- Nếu query lại → `data: null`

---

## 🗑️ TEST API 7: XÓA FILE THEO ID

### Request

```http
DELETE http://localhost:3001/api/file-he-thong/1
Authorization: Bearer <your_token>
```

### Response

```json
{
  "success": true,
  "message": "Xóa file thành công"
}
```

---

## 🔄 LUỒNG HOẠT ĐỘNG THỰC TẾ

### Scenario 1: User Thêm Hợp Đồng (Có File)

```
1. Frontend: User chọn file + điền form hợp đồng
2. Frontend → Backend: POST /api/hop-dong
   Body: { so_hop_dong: "HD001", file: <File> }
3. Backend HopDongService:
   - Tạo bản ghi hop_dong → id = 5
   - Gọi FileHeThongService.uploadFile()
     → Upload lên S3
     → Lưu vào file_he_thong:
       { module: "HOP_DONG", ban_ghi_id: 5, ten_truong: "file_hop_dong" }
4. Frontend ← Backend: Response với thông tin hợp đồng
```

### Scenario 2: User Xem Chi Tiết Hợp Đồng

```
1. Frontend → Backend: GET /api/hop-dong/5
2. Backend HopDongService:
   - Lấy thông tin hop_dong (id=5)
   - Gọi FileHeThongService.layFile({
       module: "HOP_DONG",
       ban_ghi_id: 5,
       ten_truong: "file_hop_dong"
     })
   - Trả về: { ...hop_dong, file_hop_dong: { id, ten_goc, url_xem, ... } }
3. Frontend:
   - Hiển thị thông tin hợp đồng
   - Hiển thị tên file + button "Xem"
   - Click "Xem" → window.open(file.url_xem)
```

### Scenario 3: User Sửa Hợp Đồng (Đổi File)

```
1. Frontend: User chọn file mới
2. Frontend → Backend: PATCH /api/hop-dong/5
   Body: { ..., file: <NewFile> }
3. Backend HopDongService:
   - Update thông tin hop_dong
   - Gọi FileHeThongService.uploadFile()
     → File cũ trên S3 bị xóa
     → File mới được upload
     → Update record trong file_he_thong
4. Frontend ← Backend: Response
```

### Scenario 4: User Xóa Hợp Đồng

```
1. Frontend → Backend: DELETE /api/hop-dong/5
2. Backend HopDongService:
   - Gọi FileHeThongService.xoaFileCuaBanGhi({
       module: "HOP_DONG",
       ban_ghi_id: 5
     })
     → Xóa tất cả file liên quan khỏi S3
     → Xóa records trong file_he_thong
   - Xóa bản ghi hop_dong
3. Frontend ← Backend: Success
```

---

## 🧪 TEST CASES QUAN TRỌNG

### Test 1: Upload File Lớn (>4MB)

**Kết quả mong đợi:** Lỗi 400 Bad Request

```http
POST /api/file-he-thong/upload
Body: file > 4MB

Response:
{
  "statusCode": 400,
  "message": "Kích thước file không được vượt quá 4MB"
}
```

### Test 2: Upload File Sai Định Dạng

**Kết quả mong đợi:** Lỗi 400 Bad Request

```http
POST /api/file-he-thong/upload
Body: file.exe (executable)

Response:
{
  "statusCode": 400,
  "message": "Định dạng file không hợp lệ. Chỉ cho phép: PDF, Word, TXT, Image"
}
```

### Test 3: Upload Không Có Token

**Kết quả mong đợi:** Lỗi 401 Unauthorized

```http
POST /api/file-he-thong/upload
(Không có Authorization header)

Response:
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Test 4: Lấy File Không Tồn Tại

**Kết quả mong đợi:** Lỗi 404 Not Found

```http
GET /api/file-he-thong/999

Response:
{
  "statusCode": 404,
  "message": "Không tìm thấy file"
}
```

### Test 5: Lấy File Theo Query Không Có

**Kết quả mong đợi:** Success nhưng data = null

```http
GET /api/file-he-thong/lay-file?module=TEST&ban_ghi_id=999&ten_truong=abc

Response:
{
  "success": true,
  "data": null
}
```

---

## 📊 BẢNG TÓM TẮT APIs

| API                | Method | Endpoint        | Use Case                     |
| ------------------ | ------ | --------------- | ---------------------------- |
| **Upload**         | POST   | `/upload`       | Tạo mới hoặc thay thế file   |
| **Lấy theo query** | GET    | `/lay-file?...` | Xem chi tiết bản ghi có file |
| **Lấy theo ID**    | GET    | `/:id`          | Click xem trong danh sách    |
| **Danh sách**      | GET    | `/`             | Table tài liệu hệ thống      |
| **Xóa theo query** | DELETE | `/xoa?...`      | Xóa file trong form edit     |
| **Xóa theo ID**    | DELETE | `/:id`          | Admin xóa file               |

---

## 🎯 CHECKLIST TEST

Sau khi test, kiểm tra:

- [ ] Upload file thành công → File xuất hiện trên S3
- [ ] Upload lại → File cũ bị xóa, file mới thay thế
- [ ] Lấy file theo query → Có url_xem
- [ ] Lấy file theo ID → Có url_xem
- [ ] Click url_xem → Mở được file trên browser
- [ ] Danh sách có phân trang → Có meta
- [ ] Filter theo module → Đúng kết quả
- [ ] Xóa file → File biến mất khỏi S3 và database
- [ ] Upload file >4MB → Lỗi
- [ ] Upload file sai định dạng → Lỗi
- [ ] Không có token → Lỗi 401

---

## 🚀 TIPS

1. **Test trên Postman:** Dễ hơn curl, có UI
2. **Lưu Environment:** Tạo environment lưu token, không phải paste mãi
3. **Test S3:** Vào S3 Console check file có đúng không
4. **Copy URL:** Mở url_xem trên browser để xem file thật
5. **Check Database:** Vào database xem record trong `file_he_thong`

---

**Chúc bạn test thành công! 🎉**
