# Hướng Dẫn Test API Module Đấu Thầu

## 📋 Tổng Quan

Module **Đấu Thầu** quản lý thông tin đấu thầu của các đề tài, bao gồm:

- **Đấu Thầu chính**: Thông tin tổng quan đấu thầu (năm, nguồn kinh phí, tổng kinh phí)
- **Danh Sách Đấu Thầu**: Chi tiết các lần đấu thầu (có thể upload file đính kèm)

**Luồng hoạt động:**

1. Tạo đấu thầu cho 1 đề tài
2. Thêm các danh sách đấu thầu con (có thể kèm file)
3. Xem/sửa/xóa đấu thầu và danh sách con

---

## 🔐 Authentication

**Tất cả API đều yêu cầu JWT Token** (trừ login/register)

### Cách lấy token:

```http
POST http://localhost:3001/api/nguoi-dung/dang-nhap
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
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Sử dụng token:**
Thêm vào header của mọi request:

```
Authorization: Bearer <accessToken>
```

---

## 🎯 Quyền Truy Cập

Module **DAU_THAU** yêu cầu:

- **Xem**: Quyền `DAU_THAU` - `XEM`
- **Thao tác** (Thêm/Sửa/Xóa): Quyền `DAU_THAU` - `THAO_TAC`

### Cách gán quyền:

1. Vào module **Vai Trò** → Chọn vai trò cần gán quyền
2. Tick chọn quyền **Đấu thầu** - **Xem** và **Thao tác**
3. Lưu lại

---

## 📚 API Endpoints

### Base URL

```
http://localhost:3001/api
```

---

## 1️⃣ API ĐẤU THẦU CHÍNH

### 1.1. Tạo Đấu Thầu Mới

**Endpoint:**

```http
POST /dau-thau
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "de_tai_id": 1,
  "nam_thuc_hien": 2024,
  "nguon_kinh_phi": "Ngân sách nhà nước",
  "tong_kinh_phi": 5000000000
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Tạo đấu thầu thành công",
  "data": {
    "id": 1,
    "de_tai_id": 1,
    "nam_thuc_hien": 2024,
    "nguon_kinh_phi": "Ngân sách nhà nước",
    "tong_kinh_phi": 5000000000,
    "nguoi_cap_nhat_id": 1,
    "nguoi_cap_nhat": {
      "id": 1,
      "ho_ten": "Nguyễn Văn A"
    },
    "deTai": {
      "id": 1,
      "ten_de_tai": "Nghiên cứu...",
      "don_vi_phe_duyet": "...",
      "cap_quan_ly_de_tai": "...",
      "chu_nhiem_de_tai": "..."
    },
    "ngay_tao": "2024-01-10T10:00:00.000Z",
    "ngay_cap_nhat": "2024-01-10T10:00:00.000Z"
  }
}
```

**Lưu ý:**

- `de_tai_id` phải tồn tại trong bảng `de_tai`
- `nam_thuc_hien` >= 1900
- `tong_kinh_phi` >= 0

---

### 1.2. Lấy Danh Sách Đấu Thầu (Có Phân Trang)

**Endpoint:**

```http
GET /dau-thau?page=1&limit=10
```

**Query Parameters:**
| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|-------|----------|
| page | number | Trang hiện tại | 1 |
| limit | number | Số bản ghi mỗi trang | 10 |
| nam_thuc_hien | number | Filter theo năm | - |
| nguon_kinh_phi | string | Filter theo nguồn kinh phí (like) | - |
| ten_de_tai | string | Filter theo tên đề tài (like) | - |

**Ví dụ:**

```http
GET /dau-thau?page=1&limit=10&nam_thuc_hien=2024&ten_de_tai=nghiên cứu
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "de_tai_id": 1,
      "nam_thuc_hien": 2024,
      "nguon_kinh_phi": "Ngân sách nhà nước",
      "tong_kinh_phi": 5000000000,
      "nguoi_cap_nhat": {
        "id": 1,
        "ho_ten": "Nguyễn Văn A"
      },
      "deTai": {
        "id": 1,
        "ten_de_tai": "Nghiên cứu...",
        "don_vi_phe_duyet": "...",
        "cap_quan_ly_de_tai": "...",
        "chu_nhiem_de_tai": "..."
      },
      "ngay_tao": "2024-01-10T10:00:00.000Z",
      "ngay_cap_nhat": "2024-01-10T10:00:00.000Z"
    }
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

---

### 1.3. Lấy Chi Tiết Đấu Thầu

**Endpoint:**

```http
GET /dau-thau/:id
```

**Ví dụ:**

```http
GET /dau-thau/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "de_tai_id": 1,
    "nam_thuc_hien": 2024,
    "nguon_kinh_phi": "Ngân sách nhà nước",
    "tong_kinh_phi": 5000000000,
    "nguoi_cap_nhat": {
      "id": 1,
      "ho_ten": "Nguyễn Văn A"
    },
    "deTai": {
      "id": 1,
      "ten_de_tai": "Nghiên cứu...",
      "don_vi_phe_duyet": "...",
      "cap_quan_ly_de_tai": "...",
      "chu_nhiem_de_tai": "..."
    },
    "danh_sach_dau_thau": [
      {
        "id": 1,
        "nam": 2024,
        "kinh_phi": 1000000000,
        "hinh_thuc": "Đấu thầu rộng rãi",
        "buoc": "Bước 1",
        "trang_thai": "Đang thực hiện"
      }
    ],
    "ngay_tao": "2024-01-10T10:00:00.000Z",
    "ngay_cap_nhat": "2024-01-10T10:00:00.000Z"
  }
}
```

---

### 1.4. Cập Nhật Đấu Thầu

**Endpoint:**

```http
PATCH /dau-thau/:id
```

**Request Body (tất cả optional):**

```json
{
  "nam_thuc_hien": 2025,
  "nguon_kinh_phi": "Ngân sách địa phương",
  "tong_kinh_phi": 6000000000
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật đấu thầu thành công",
  "data": {
    "id": 1,
    "nam_thuc_hien": 2025,
    "nguon_kinh_phi": "Ngân sách địa phương",
    "tong_kinh_phi": 6000000000,
    ...
  }
}
```

---

### 1.5. Xóa Đấu Thầu

**Endpoint:**

```http
DELETE /dau-thau/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Xóa đấu thầu thành công"
}
```

**Lưu ý:**

- Xóa đấu thầu sẽ **cascade xóa** tất cả danh sách đấu thầu con
- Xóa luôn các **files** đính kèm trong danh sách con

---

## 2️⃣ API DANH SÁCH ĐẤU THẦU (SUB-MODULE)

### 2.1. Thêm Danh Sách Đấu Thầu (Kèm File)

**Endpoint:**

```http
POST /dau-thau/:dauThauId/danh-sach
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| nam | number | ✅ | Năm |
| kinh_phi | number | ✅ | Kinh phí |
| hinh_thuc | string | ✅ | Hình thức đấu thầu |
| buoc | string | ✅ | Bước (VD: Bước 1) |
| trang_thai | string | ✅ | Trạng thái |
| file | binary | ❌ | File đính kèm (PDF, Word, Excel...) |

**Ví dụ (Postman):**

1. Chọn method **POST**
2. URL: `http://localhost:3001/api/dau-thau/1/danh-sach`
3. Tab **Headers**: Thêm `Authorization: Bearer <token>`
4. Tab **Body** → Chọn **form-data**
5. Thêm các field:
   - `nam`: `2024`
   - `kinh_phi`: `1000000000`
   - `hinh_thuc`: `Đấu thầu rộng rãi`
   - `buoc`: `Bước 1`
   - `trang_thai`: `Đang thực hiện`
   - `file`: (Chọn type **File**, upload file từ máy)

**Response:**

```json
{
  "success": true,
  "message": "Thêm danh sách đấu thầu thành công",
  "data": {
    "id": 1,
    "dau_thau_id": 1,
    "nam": 2024,
    "kinh_phi": 1000000000,
    "hinh_thuc": "Đấu thầu rộng rãi",
    "buoc": "Bước 1",
    "trang_thai": "Đang thực hiện",
    "ten_file": "ho_so_dau_thau.pdf",
    "file_dau_thau": {
      "id": 5,
      "ten_goc": "ho_so_dau_thau.pdf",
      "duong_dan_s3": "DAU_THAU/1/file_dau_thau/ho_so_dau_thau_1705123456.pdf",
      "kich_thuoc": 524288,
      "loai_file": "application/pdf"
    },
    "ngay_tao": "2024-01-10T10:30:00.000Z",
    "ngay_cap_nhat": "2024-01-10T10:30:00.000Z"
  }
}
```

---

### 2.2. Lấy Danh Sách Đấu Thầu (Kèm File Info)

**Endpoint:**

```http
GET /dau-thau/:dauThauId/danh-sach
```

**Ví dụ:**

```http
GET /dau-thau/1/danh-sach
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dau_thau_id": 1,
      "nam": 2024,
      "kinh_phi": 1000000000,
      "hinh_thuc": "Đấu thầu rộng rãi",
      "buoc": "Bước 1",
      "trang_thai": "Đang thực hiện",
      "ten_file": "ho_so_dau_thau.pdf",
      "file_dau_thau": {
        "id": 5,
        "ten_goc": "ho_so_dau_thau.pdf",
        "url_xem": "https://presigned-url-to-s3..."
      },
      "ngay_tao": "2024-01-10T10:30:00.000Z",
      "ngay_cap_nhat": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

**Lưu ý:**

- `url_xem` là presigned URL có thời gian hết hạn (15 phút)
- Dùng URL này để tải file về hoặc xem trên browser

---

### 2.3. Cập Nhật Danh Sách Đấu Thầu (Kèm File)

**Endpoint:**

```http
PATCH /dau-thau/:dauThauId/danh-sach/:id
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data (tất cả optional):**
| Field | Type | Mô tả |
|-------|------|-------|
| nam | number | Năm mới |
| kinh_phi | number | Kinh phí mới |
| hinh_thuc | string | Hình thức mới |
| buoc | string | Bước mới |
| trang_thai | string | Trạng thái mới |
| xoa_file | boolean | `true` để xóa file hiện tại |
| file | binary | Upload file mới (ghi đè file cũ) |

**Ví dụ 1: Cập nhật thông tin không đổi file**

```
POST http://localhost:3001/api/dau-thau/1/danh-sach/1
Form-data:
  - trang_thai: "Hoàn thành"
```

**Ví dụ 2: Xóa file hiện tại**

```
POST http://localhost:3001/api/dau-thau/1/danh-sach/1
Form-data:
  - xoa_file: true
```

**Ví dụ 3: Thay file mới**

```
POST http://localhost:3001/api/dau-thau/1/danh-sach/1
Form-data:
  - file: (upload file mới)
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật danh sách đấu thầu thành công",
  "data": {
    "id": 1,
    "trang_thai": "Hoàn thành",
    ...
  }
}
```

---

### 2.4. Xóa Danh Sách Đấu Thầu

**Endpoint:**

```http
DELETE /dau-thau/:dauThauId/danh-sach/:id
```

**Ví dụ:**

```http
DELETE /dau-thau/1/danh-sach/1
```

**Response:**

```json
{
  "success": true,
  "message": "Xóa danh sách đấu thầu thành công"
}
```

**Lưu ý:**

- Xóa danh sách sẽ **tự động xóa file** đính kèm trên S3

---

## 🔍 Test Cases Quan Trọng

### Test Case 1: Tạo Đấu Thầu Đầy Đủ

1. Tạo đấu thầu mới
2. Thêm 3 danh sách đấu thầu con (có file)
3. Kiểm tra GET chi tiết → phải có đầy đủ 3 danh sách

### Test Case 2: Cập Nhật File

1. Thêm danh sách có file
2. GET danh sách → lấy `url_xem` → mở trong browser
3. PATCH để thay file mới
4. GET lại → `url_xem` phải khác → mở xem file mới

### Test Case 3: Xóa Cascade

1. Tạo đấu thầu có 3 danh sách con (có file)
2. DELETE đấu thầu chính
3. Kiểm tra danh sách con → phải bị xóa
4. Kiểm tra S3 → files phải bị xóa

### Test Case 4: Filter Tên Đề Tài

1. Tạo nhiều đấu thầu cho các đề tài khác nhau
2. GET `/dau-thau?ten_de_tai=nghiên cứu`
3. Kiểm tra kết quả chỉ trả về đấu thầu có đề tài chứa "nghiên cứu"

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Quyền Truy Cập

- Phải có quyền `DAU_THAU` - `XEM` để xem danh sách
- Phải có quyền `DAU_THAU` - `THAO_TAC` để thêm/sửa/xóa

### 2. Upload File

- Dùng `multipart/form-data` khi có file
- Max file size: 10MB (có thể config trong backend)
- File types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG

### 3. Xóa Dữ Liệu

- Xóa đấu thầu → cascade xóa danh sách con + files
- Không thể undo sau khi xóa

### 4. Validation

- `nam_thuc_hien` phải >= 1900
- `kinh_phi`, `tong_kinh_phi` phải >= 0
- `de_tai_id` phải tồn tại

---

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized

- Kiểm tra token đã hết hạn chưa
- Đăng nhập lại để lấy token mới

### Lỗi 403 Forbidden

- User chưa có quyền `DAU_THAU`
- Liên hệ admin để gán quyền

### Lỗi 404 Not Found

- ID không tồn tại
- Kiểm tra lại ID trong URL

### Lỗi 400 Bad Request (Validation)

- Thiếu field bắt buộc
- Giá trị không hợp lệ (VD: năm < 1900)

### File Upload Lỗi

- Kiểm tra Content-Type là `multipart/form-data`
- Kiểm tra field name là `file` (đúng tên)
- File size không vượt quá 10MB

---

## 📞 Liên Hệ

Nếu gặp vấn đề khi test API, liên hệ:

- **Backend Dev Team**
- Email: backend@vienlua.com
