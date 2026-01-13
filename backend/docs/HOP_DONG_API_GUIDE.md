# HỢP ĐỒNG API GUIDE

## Tổng quan

Module Hợp Đồng cung cấp 5 API endpoints để quản lý hợp đồng và file đính kèm.

**Lưu ý quan trọng:**

- **File là một phần của hợp đồng**, không có API riêng để thao tác file
- Khi tạo/sửa/xóa hợp đồng, bạn cũng đang tạo/sửa/xóa file của hợp đồng đó
- Tất cả API đều yêu cầu JWT token trong header Authorization
- Tất cả API đều kiểm tra quyền HOP_DONG module

---

## 1. Tạo hợp đồng mới (kèm file nếu có)

**Endpoint:** `POST /api/hop-dong`  
**Content-Type:** `multipart/form-data`  
**Quyền:** HOP_DONG - THAO_TAC

### Request

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

```
so_hop_dong: "HD-2024-001" (required, unique, max 50 chars)
doi_tac: "Công ty ABC" (required, max 100 chars)
ghi_chu: "Hợp đồng cung cấp dịch vụ" (optional, max 255 chars)
file: [select binary file] (optional)
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "so_hop_dong": "HD-2024-001",
    "doi_tac": "Công ty ABC",
    "ghi_chu": "Hợp đồng cung cấp dịch vụ",
    "nguoi_cap_nhat_id": 1,
    "ngay_tao": "2024-12-31T10:00:00.000Z",
    "ngay_cap_nhat": "2024-12-31T10:00:00.000Z",
    "file_hop_dong": {
      "id": 5,
      "ten_file": "HD-2024-001.pdf",
      "duong_dan": "HOP_DONG/2024/12/abc123.pdf",
      "presigned_url": "https://s3.amazonaws.com/...",
      "kich_thuoc": 1024567,
      "loai_file": "application/pdf"
    }
  }
}
```

**Lưu ý:**

- Nếu không upload file, `file_hop_dong` sẽ là `null`
- Nếu upload file lỗi, vẫn trả về hợp đồng đã tạo nhưng `file_hop_dong` là `null`

### Response Error

**400 Bad Request - Thiếu thông tin:**

```json
{
  "success": false,
  "message": "Số hợp đồng và đối tác không được để trống"
}
```

**409 Conflict - Số hợp đồng đã tồn tại:**

```json
{
  "success": false,
  "message": "Số hợp đồng đã tồn tại"
}
```

---

## 2. Lấy danh sách hợp đồng

**Endpoint:** `GET /api/hop-dong`  
**Quyền:** HOP_DONG - XEM

### Request

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
page: 1 (default: 1)
limit: 10 (default: 10)
filter[so_hop_dong]: "HD-2024" (optional, contains search)
filter[doi_tac]: "ABC" (optional, contains search)
filter[ghi_chu]: "dịch vụ" (optional, contains search)
sort: "ngay_tao" (optional, field name)
order: "DESC" (optional, ASC or DESC)
```

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "so_hop_dong": "HD-2024-001",
      "doi_tac": "Công ty ABC",
      "ghi_chu": "Hợp đồng cung cấp dịch vụ",
      "nguoi_cap_nhat_id": 1,
      "ngay_tao": "2024-12-31T10:00:00.000Z",
      "ngay_cap_nhat": "2024-12-31T10:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

## 3. Lấy chi tiết hợp đồng

**Endpoint:** `GET /api/hop-dong/:id`  
**Quyền:** HOP_DONG - XEM

### Request

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

```
id: 1 (hợp đồng ID)
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "so_hop_dong": "HD-2024-001",
    "doi_tac": "Công ty ABC",
    "ghi_chu": "Hợp đồng cung cấp dịch vụ",
    "nguoi_cap_nhat_id": 1,
    "ngay_tao": "2024-12-31T10:00:00.000Z",
    "ngay_cap_nhat": "2024-12-31T10:00:00.000Z",
    "nguoi_cap_nhat": {
      "id": 1,
      "ho_ten": "Tuấn Lê"
    },
    "file_hop_dong": {
      "id": 5,
      "ten_file": "HD-2024-001.pdf",
      "duong_dan": "HOP_DONG/2024/12/abc123.pdf",
      "presigned_url": "https://s3.amazonaws.com/...",
      "kich_thuoc": 1024567,
      "loai_file": "application/pdf"
    }
  }
}
```

**Lưu ý:**

- API này trả về cả thông tin người cập nhật và file (nếu có)
- `presigned_url` có hiệu lực 1 giờ để tải file

### Response Error

**404 Not Found:**

```json
{
  "success": false,
  "message": "Hợp đồng không tồn tại"
}
```

---

## 4. Cập nhật hợp đồng (kèm file nếu có)

**Endpoint:** `PATCH /api/hop-dong/:id`  
**Content-Type:** `multipart/form-data`  
**Quyền:** HOP_DONG - THAO_TAC

### Request

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**URL Parameters:**

```
id: 1 (hợp đồng ID)
```

**Form Data (tất cả optional):**

```
so_hop_dong: "HD-2024-001-V2" (optional)
doi_tac: "Công ty ABC Updated" (optional)
ghi_chu: "Hợp đồng đã sửa" (optional)
file: [select binary file] (optional, upload file mới sẽ ghi đè file cũ)
xoa_file: true (optional, xóa file hiện tại nếu có)
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "so_hop_dong": "HD-2024-001-V2",
    "doi_tac": "Công ty ABC Updated",
    "ghi_chu": "Hợp đồng đã sửa",
    "nguoi_cap_nhat_id": 1,
    "ngay_tao": "2024-12-31T10:00:00.000Z",
    "ngay_cap_nhat": "2024-12-31T11:30:00.000Z",
    "file_hop_dong": {
      "id": 6,
      "ten_file": "HD-2024-001-V2.pdf",
      "presigned_url": "https://s3.amazonaws.com/..."
    }
  }
}
```

**Các trường hợp sử dụng:**

1. **Chỉ sửa thông tin hợp đồng:**

```
so_hop_dong: "HD-2024-001-V2"
doi_tac: "Công ty ABC Updated"
```

2. **Chỉ upload file mới (thay thế file cũ):**

```
file: [select new file]
```

3. **Chỉ xóa file:**

```
xoa_file: true
```

4. **Sửa thông tin + upload file mới:**

```
so_hop_dong: "HD-2024-001-V2"
file: [select new file]
```

5. **Xóa file cũ + upload file mới:**

```
xoa_file: true
file: [select new file]
```

### Response Error

**404 Not Found:**

```json
{
  "success": false,
  "message": "Hợp đồng không tồn tại"
}
```

**409 Conflict:**

```json
{
  "success": false,
  "message": "Số hợp đồng đã tồn tại"
}
```

---

## 5. Xóa hợp đồng (bao gồm cả file)

**Endpoint:** `DELETE /api/hop-dong/:id`  
**Quyền:** HOP_DONG - THAO_TAC

### Request

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

```
id: 1 (hợp đồng ID)
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "message": "Xóa hợp đồng thành công"
  }
}
```

**Lưu ý:**

- Xóa hợp đồng sẽ **tự động xóa file** đính kèm (nếu có)
- File sẽ bị xóa khỏi AWS S3 và database

### Response Error

**404 Not Found:**

```json
{
  "success": false,
  "message": "Hợp đồng không tồn tại"
}
```

---

## Testing Workflow

### Workflow 1: Tạo hợp đồng có file

1. **Tạo hợp đồng + upload file:**

```bash
POST /api/hop-dong
Form data:
- so_hop_dong: "HD-2024-001"
- doi_tac: "Công ty ABC"
- file: [chọn file]
```

2. **Xem chi tiết:**

```bash
GET /api/hop-dong/1
```

3. **Download file:**

- Sử dụng `presigned_url` trong response để tải file

### Workflow 2: Cập nhật hợp đồng

1. **Sửa thông tin + thay file:**

```bash
PATCH /api/hop-dong/1
Form data:
- doi_tac: "Công ty ABC Updated"
- file: [chọn file mới]
```

2. **Xóa file của hợp đồng:**

```bash
PATCH /api/hop-dong/1
Form data:
- xoa_file: true
```

### Workflow 3: Quản lý file

**LƯU Ý:** File là một phần của hợp đồng, vì vậy:

- Muốn thêm file → PATCH /api/hop-dong/:id với `file`
- Muốn sửa file → PATCH /api/hop-dong/:id với `file` mới (ghi đè)
- Muốn xóa file → PATCH /api/hop-dong/:id với `xoa_file: true`
- Muốn xóa hợp đồng + file → DELETE /api/hop-dong/:id

**KHÔNG CÓ** API riêng để thao tác file độc lập!

---

## Troubleshooting

### 1. Upload file lỗi nhưng hợp đồng vẫn được tạo

**Nguyên nhân:** AWS S3 không khả dụng hoặc cấu hình sai  
**Giải pháp:** Kiểm tra AWS credentials và S3 bucket

### 2. Không thể sửa số hợp đồng

**Nguyên nhân:** Số hợp đồng mới đã tồn tại (unique constraint)  
**Giải pháp:** Dùng số hợp đồng khác

### 3. Presigned URL hết hạn

**Nguyên nhân:** URL có hiệu lực 1 giờ  
**Giải pháp:** Gọi lại API GET /api/hop-dong/:id để lấy URL mới

### 4. File không bị xóa khi xóa hợp đồng

**Nguyên nhân:** Lỗi kết nối S3  
**Giải pháp:** File sẽ bị xóa trong database nhưng có thể còn trên S3 (cần cleanup manual)

---

## Câu hỏi về Entity Linking

**Có cần thêm field trong entity để liên kết với bảng file không?**

**Trả lời: KHÔNG CẦN**

Hệ thống sử dụng **soft linking** thông qua 3 trường:

- `module`: "HOP_DONG"
- `ban_ghi_id`: ID của hợp đồng
- `ten_truong`: "file_hop_dong"

**Ưu điểm của soft linking:**

- Không cần foreign key constraint
- Dễ mở rộng cho nhiều module khác
- Không ảnh hưởng đến performance khi JOIN
- Dễ migrate data khi cần

**Cách lấy file của hợp đồng:**

```typescript
// Trong service
const fileInfo = await this.fileHeThongService.layFile({
  module: "HOP_DONG",
  ban_ghi_id: hopDong.id,
  ten_truong: "file_hop_dong",
});
```

**Constraint trong database:**

```sql
UNIQUE(module, ban_ghi_id, ten_truong)
```

→ Đảm bảo mỗi hợp đồng chỉ có 1 file

---

## Commit Message

```bash
git add .
git commit -m "feat(HopDong): Implement CRUD APIs with integrated file management

- POST /api/hop-dong: Create contract with optional file upload
- GET /api/hop-dong: List contracts with pagination and filter
- GET /api/hop-dong/:id: Get contract detail with file info
- PATCH /api/hop-dong/:id: Update contract with file operations (upload/delete)
- DELETE /api/hop-dong/:id: Delete contract and associated file

Changes:
- File operations integrated into contract CRUD (no separate file APIs)
- AWS S3 integration via FileHeThong service
- Soft linking via (module, ban_ghi_id, ten_truong) without foreign key
- Unique constraint on so_hop_dong field
- Auto delete files when deleting contract
- Support multipart/form-data for file upload in create/update operations"
```
