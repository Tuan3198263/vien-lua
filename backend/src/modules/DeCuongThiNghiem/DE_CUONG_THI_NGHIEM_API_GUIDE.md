# HƯỚNG DẪN TEST API - MODULE ĐỀ CƯƠNG THÍ NGHIỆM

## 📋 Mục lục

1. [Thông tin chung](#thông-tin-chung)
2. [API Đề cương thí nghiệm (Chính)](#api-đề-cương-thí-nghiệm-chính)
3. [API Danh sách số lượng thí nghiệm (Sub-module)](#api-danh-sách-số-lượng-thí-nghiệm-sub-module)
4. [Test Flow Hoàn chỉnh](#test-flow-hoàn-chỉnh)

---

## Thông tin chung

### Base URL

```
http://localhost:3000/api
```

### Authentication

Tất cả API đều yêu cầu Bearer Token:

```
Authorization: Bearer <your_jwt_token>
```

### Permissions Required

- **Xem dữ liệu**: Module `DE_CUONG_THI_NGHIEM`, Action `XEM`
- **Thao tác (Thêm/Sửa/Xóa)**: Module `DE_CUONG_THI_NGHIEM`, Action `THAO_TAC`

---

## API Đề cương thí nghiệm (Chính)

### 1. Tạo đề cương thí nghiệm mới (có file)

**Endpoint:** `POST /de-cuong-thi-nghiem`

**Content-Type:** `multipart/form-data`

**Permission:** `DE_CUONG_THI_NGHIEM:THAO_TAC`

#### Request Body (Form-data):

| Field                    | Type   | Required | Description                         |
| ------------------------ | ------ | -------- | ----------------------------------- |
| de_tai_id                | number | ✅       | ID đề tài                           |
| ten_thi_nghiem           | string | ✅       | Tên thí nghiệm (max 255)            |
| loai_hinh_thi_nghiem     | string | ✅       | Loại hình thí nghiệm (max 255)      |
| ngay_bat_dau             | date   | ✅       | Ngày bắt đầu (YYYY-MM-DD)           |
| ngay_ket_thuc            | date   | ✅       | Ngày kết thúc (YYYY-MM-DD)          |
| mua_vu                   | string | ✅       | Mùa vụ (max 255)                    |
| nguoi_thuc_hien          | string | ✅       | Người thực hiện (max 255)           |
| kinh_phi_ky_thuat        | number | ✅       | Kinh phí kỹ thuật (≥0)              |
| kinh_phi_lao_dong        | number | ✅       | Kinh phí lao động (≥0)              |
| kinh_phi_nguyen_vat_lieu | number | ✅       | Kinh phí nguyên vật liệu (≥0)       |
| file                     | file   | ❌       | File đề cương (PDF, Word, Excel...) |

#### Postman Setup:

1. Method: `POST`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```
4. Body → form-data:
   ```
   de_tai_id: 1
   ten_thi_nghiem: Thí nghiệm năng suất lúa lai
   loai_hinh_thi_nghiem: Thí nghiệm đồng ruộng
   ngay_bat_dau: 2026-02-01
   ngay_ket_thuc: 2026-06-30
   mua_vu: Vụ Xuân 2026
   nguoi_thuc_hien: TS. Nguyễn Văn A, ThS. Trần Thị B
   kinh_phi_ky_thuat: 50000000
   kinh_phi_lao_dong: 30000000
   kinh_phi_nguyen_vat_lieu: 20000000
   file: [Select File] (optional)
   ```

#### cURL Example:

```bash
curl --location 'http://localhost:3000/api/de-cuong-thi-nghiem' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--form 'de_tai_id="1"' \
--form 'ten_thi_nghiem="Thí nghiệm năng suất lúa lai"' \
--form 'loai_hinh_thi_nghiem="Thí nghiệm đồng ruộng"' \
--form 'ngay_bat_dau="2026-02-01"' \
--form 'ngay_ket_thuc="2026-06-30"' \
--form 'mua_vu="Vụ Xuân 2026"' \
--form 'nguoi_thuc_hien="TS. Nguyễn Văn A, ThS. Trần Thị B"' \
--form 'kinh_phi_ky_thuat="50000000"' \
--form 'kinh_phi_lao_dong="30000000"' \
--form 'kinh_phi_nguyen_vat_lieu="20000000"' \
--form 'file=@"/path/to/de-cuong.pdf"'
```

#### Response Success (200):

```json
{
  "success": true,
  "message": "Tạo đề cương thí nghiệm thành công",
  "data": {
    "id": 1,
    "de_tai_id": 1,
    "ten_thi_nghiem": "Thí nghiệm năng suất lúa lai",
    "loai_hinh_thi_nghiem": "Thí nghiệm đồng ruộng",
    "ngay_bat_dau": "2026-02-01",
    "ngay_ket_thuc": "2026-06-30",
    "mua_vu": "Vụ Xuân 2026",
    "nguoi_thuc_hien": "TS. Nguyễn Văn A, ThS. Trần Thị B",
    "kinh_phi_ky_thuat": 50000000,
    "kinh_phi_lao_dong": 30000000,
    "kinh_phi_nguyen_vat_lieu": 20000000,
    "nguoi_cap_nhat_id": 5,
    "ngay_tao": "2026-01-12T10:30:00.000Z",
    "ngay_cap_nhat": "2026-01-12T10:30:00.000Z",
    "nguoi_cap_nhat": {
      "id": 5,
      "ho_ten": "Nguyễn Văn X"
    },
    "deTai": {
      "id": 1,
      "ten_de_tai": "Nghiên cứu giống lúa lai...",
      "don_vi_phe_duyet": "Bộ Nông nghiệp",
      "cap_quan_ly_de_tai": "Cấp Nhà nước",
      "chu_nhiem_de_tai": "GS.TS. Nguyễn Văn Y"
    },
    "file_de_cuong": {
      "id": 123,
      "ten_goc": "de-cuong.pdf",
      "url_xem": "https://s3.amazonaws.com/bucket/de-cuong.pdf?X-Amz-..."
    }
  }
}
```

---

### 2. Lấy danh sách đề cương thí nghiệm (có filter & phân trang)

**Endpoint:** `GET /de-cuong-thi-nghiem`

**Permission:** `DE_CUONG_THI_NGHIEM:XEM`

#### Query Parameters:

| Parameter            | Type   | Required | Description                         |
| -------------------- | ------ | -------- | ----------------------------------- |
| page                 | number | ❌       | Số trang (default: 1)               |
| limit                | number | ❌       | Số item/trang (default: 10)         |
| sortBy               | string | ❌       | Field để sort (vd: ngay_tao)        |
| sortOrder            | string | ❌       | Chiều sort: ASC hoặc DESC           |
| ten_thi_nghiem       | string | ❌       | Filter theo tên thí nghiệm (LIKE)   |
| loai_hinh_thi_nghiem | string | ❌       | Filter theo loại hình (LIKE)        |
| ten_de_tai           | string | ❌       | Filter theo tên đề tài (LIKE)       |
| cap_quan_ly_de_tai   | string | ❌       | Filter theo cấp quản lý (LIKE)      |
| don_vi_phe_duyet     | string | ❌       | Filter theo đơn vị phê duyệt (LIKE) |
| kinh_phi_ky_thuat    | number | ❌       | Filter kinh phí kỹ thuật (equals)   |
| kinh_phi_lao_dong    | number | ❌       | Filter kinh phí lao động (equals)   |

#### Postman Setup:

1. Method: `GET`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem?page=1&limit=10&ten_thi_nghiem=lúa&sortBy=ngay_tao&sortOrder=DESC`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```

#### cURL Example:

```bash
curl --location 'http://localhost:3000/api/de-cuong-thi-nghiem?page=1&limit=10&ten_thi_nghiem=lúa&ten_de_tai=nghiên%20cứu' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

#### Response Success (200):

```json
{
  "data": [
    {
      "id": 1,
      "ten_thi_nghiem": "Thí nghiệm năng suất lúa lai",
      "loai_hinh_thi_nghiem": "Thí nghiệm đồng ruộng",
      "ngay_bat_dau": "2026-02-01",
      "ngay_ket_thuc": "2026-06-30",
      "mua_vu": "Vụ Xuân 2026",
      "nguoi_thuc_hien": "TS. Nguyễn Văn A",
      "kinh_phi_ky_thuat": 50000000,
      "kinh_phi_lao_dong": 30000000,
      "kinh_phi_nguyen_vat_lieu": 20000000,
      "ngay_tao": "2026-01-12T10:30:00.000Z",
      "nguoi_cap_nhat": {
        "id": 5,
        "ho_ten": "Nguyễn Văn X"
      },
      "deTai": {
        "id": 1,
        "ten_de_tai": "Nghiên cứu giống lúa lai..."
      },
      "file_de_cuong": {
        "id": 123,
        "ten_goc": "de-cuong.pdf",
        "url_xem": "https://s3.amazonaws.com/bucket/de-cuong.pdf?X-Amz-..."
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  },
  "success": true
}
```

---

### 3. Lấy chi tiết đề cương thí nghiệm

**Endpoint:** `GET /de-cuong-thi-nghiem/:id`

**Permission:** `DE_CUONG_THI_NGHIEM:XEM`

#### Postman Setup:

1. Method: `GET`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```

#### cURL Example:

```bash
curl --location 'http://localhost:3000/api/de-cuong-thi-nghiem/1' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

#### Response Success (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "de_tai_id": 1,
    "ten_thi_nghiem": "Thí nghiệm năng suất lúa lai",
    "loai_hinh_thi_nghiem": "Thí nghiệm đồng ruộng",
    "ngay_bat_dau": "2026-02-01",
    "ngay_ket_thuc": "2026-06-30",
    "mua_vu": "Vụ Xuân 2026",
    "nguoi_thuc_hien": "TS. Nguyễn Văn A, ThS. Trần Thị B",
    "kinh_phi_ky_thuat": 50000000,
    "kinh_phi_lao_dong": 30000000,
    "kinh_phi_nguyen_vat_lieu": 20000000,
    "nguoi_cap_nhat_id": 5,
    "ngay_tao": "2026-01-12T10:30:00.000Z",
    "ngay_cap_nhat": "2026-01-12T10:30:00.000Z",
    "nguoi_cap_nhat": {
      "id": 5,
      "ho_ten": "Nguyễn Văn X"
    },
    "deTai": {
      "id": 1,
      "ten_de_tai": "Nghiên cứu giống lúa lai...",
      "don_vi_phe_duyet": "Bộ Nông nghiệp",
      "cap_quan_ly_de_tai": "Cấp Nhà nước",
      "chu_nhiem_de_tai": "GS.TS. Nguyễn Văn Y"
    },
    "file_de_cuong": {
      "id": 123,
      "ten_goc": "de-cuong.pdf",
      "url_xem": "https://s3.amazonaws.com/bucket/de-cuong.pdf?X-Amz-..."
    },
    "danh_sach_so_luong": [
      {
        "id": 1,
        "dia_diem": "Huyện A, Tỉnh B",
        "vi_tri": "Xã C, thôn D",
        "dien_tich": 1000.5
      }
    ]
  }
}
```

#### Response Error - Not Found (404):

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy đề cương thí nghiệm với id 999",
  "error": "Not Found"
}
```

---

### 4. Cập nhật đề cương thí nghiệm (có file)

**Endpoint:** `PATCH /de-cuong-thi-nghiem/:id`

**Content-Type:** `multipart/form-data`

**Permission:** `DE_CUONG_THI_NGHIEM:THAO_TAC`

#### Request Body (Form-data):

Tất cả fields đều **optional**. Chỉ gửi fields cần update.

#### Postman Setup:

1. Method: `PATCH`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```
4. Body → form-data (các trường hợp sử dụng):

   **Case 1: Chỉ update thông tin (giữ nguyên file):**

   ```
   ten_thi_nghiem: Thí nghiệm năng suất lúa lai (Cập nhật)
   kinh_phi_ky_thuat: 55000000
   ```

   **Case 2: Update thông tin + thay file mới:**

   ```
   ten_thi_nghiem: Thí nghiệm năng suất lúa lai (Cập nhật)
   file: [Select New File]
   ```

   **Case 3: Update thông tin + xóa file:**

   ```
   ten_thi_nghiem: Thí nghiệm năng suất lúa lai (Cập nhật)
   xoa_file: true
   ```

#### cURL Examples:

**1. Update thông tin + thay file mới:**

```bash
curl --location --request PATCH 'http://localhost:3000/api/de-cuong-thi-nghiem/1' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--form 'ten_thi_nghiem="Thí nghiệm năng suất lúa lai (Cập nhật)"' \
--form 'kinh_phi_ky_thuat="55000000"' \
--form 'file=@"/path/to/new-file.pdf"'
```

**2. Update thông tin + xóa file:**

```bash
curl --location --request PATCH 'http://localhost:3000/api/de-cuong-thi-nghiem/1' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--form 'ten_thi_nghiem="Thí nghiệm năng suất lúa lai (Cập nhật)"' \
--form 'xoa_file="true"'
```

#### Response Success (200):

```json
{
  "success": true,
  "message": "Cập nhật đề cương thí nghiệm thành công",
  "data": {
    "id": 1,
    "ten_thi_nghiem": "Thí nghiệm năng suất lúa lai (Cập nhật)",
    "kinh_phi_ky_thuat": 55000000,
    "ngay_cap_nhat": "2026-01-12T15:20:00.000Z",
    "file_de_cuong": {
      "id": 124,
      "ten_goc": "new-file.pdf",
      "url_xem": "https://s3.amazonaws.com/bucket/new-file.pdf?X-Amz-..."
    }
  }
}
```

**Lưu ý:**

- **Giữ nguyên file**: KHÔNG truyền `file` và `xoa_file`
- **Thay file mới**: Truyền `file` mới → File cũ tự động xóa
- **Xóa file (không upload mới)**: Truyền `xoa_file: true`
- **Ưu tiên**: Nếu truyền cả `file` và `xoa_file`, `file` mới sẽ được ưu tiên (xóa file cũ → upload file mới)
- Có thể chỉ update 1 vài fields mà không cần gửi tất cả

**Test Cases trong Postman:**

```
// Case 1: Giữ nguyên file
Body → form-data:
  ten_thi_nghiem: "Thí nghiệm mới"
  kinh_phi_ky_thuat: 55000000

// Case 2: Thay file mới
Body → form-data:
  ten_thi_nghiem: "Thí nghiệm mới"
  file: [Select File]

// Case 3: Xóa file
Body → form-data:
  ten_thi_nghiem: "Thí nghiệm mới"
  xoa_file: true
```

---

### 5. Xóa đề cương thí nghiệm

**Endpoint:** `DELETE /de-cuong-thi-nghiem/:id`

**Permission:** `DE_CUONG_THI_NGHIEM:THAO_TAC`

#### Postman Setup:

1. Method: `DELETE`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```

#### cURL Example:

```bash
curl --location --request DELETE 'http://localhost:3000/api/de-cuong-thi-nghiem/1' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

#### Response Success (200):

```json
{
  "success": true,
  "message": "Xóa đề cương thí nghiệm thành công"
}
```

**Lưu ý:**

- Cascade delete: Xóa tất cả `danh_sach_so_luong` con
- File đề cương (nếu có) cũng được xóa khỏi S3
- Không thể khôi phục sau khi xóa

---

## API Danh sách số lượng thí nghiệm (Sub-module)

### 1. Tạo danh sách số lượng thí nghiệm

**Endpoint:** `POST /de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong`

**Content-Type:** `application/json`

**Permission:** `DE_CUONG_THI_NGHIEM:THAO_TAC`

#### Request Body:

```json
{
  "dia_diem": "Huyện A, Tỉnh B",
  "vi_tri": "Xã C, thôn D",
  "dien_tich": 1000.5
}
```

#### Postman Setup:

1. Method: `POST`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1/danh-sach-so-luong`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   Content-Type: application/json
   ```
4. Body → raw (JSON):
   ```json
   {
     "dia_diem": "Huyện A, Tỉnh B",
     "vi_tri": "Xã C, thôn D",
     "dien_tich": 1000.5
   }
   ```

#### cURL Example:

```bash
curl --location 'http://localhost:3000/api/de-cuong-thi-nghiem/1/danh-sach-so-luong' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data '{
  "dia_diem": "Huyện A, Tỉnh B",
  "vi_tri": "Xã C, thôn D",
  "dien_tich": 1000.5
}'
```

#### Response Success (200):

```json
{
  "success": true,
  "message": "Thêm danh sách số lượng thí nghiệm thành công",
  "data": {
    "id": 1,
    "de_cuong_thi_nghiem_id": 1,
    "dia_diem": "Huyện A, Tỉnh B",
    "vi_tri": "Xã C, thôn D",
    "dien_tich": 1000.5
  }
}
```

---

### 2. Lấy danh sách số lượng thí nghiệm

**Endpoint:** `GET /de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong`

**Permission:** `DE_CUONG_THI_NGHIEM:XEM`

#### Postman Setup:

1. Method: `GET`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1/danh-sach-so-luong`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```

#### cURL Example:

```bash
curl --location 'http://localhost:3000/api/de-cuong-thi-nghiem/1/danh-sach-so-luong' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

#### Response Success (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "de_cuong_thi_nghiem_id": 1,
      "dia_diem": "Huyện A, Tỉnh B",
      "vi_tri": "Xã C, thôn D",
      "dien_tich": 1000.5
    },
    {
      "id": 2,
      "de_cuong_thi_nghiem_id": 1,
      "dia_diem": "Huyện E, Tỉnh F",
      "vi_tri": "Xã G, thôn H",
      "dien_tich": 500.25
    }
  ]
}
```

---

### 3. Lấy chi tiết danh sách số lượng

**Endpoint:** `GET /de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong/:id`

**Permission:** `DE_CUONG_THI_NGHIEM:XEM`

#### Postman Setup:

1. Method: `GET`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1/danh-sach-so-luong/1`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```

#### Response Success (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "de_cuong_thi_nghiem_id": 1,
    "dia_diem": "Huyện A, Tỉnh B",
    "vi_tri": "Xã C, thôn D",
    "dien_tich": 1000.5
  }
}
```

---

### 4. Cập nhật danh sách số lượng

**Endpoint:** `PATCH /de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong/:id`

**Content-Type:** `application/json`

**Permission:** `DE_CUONG_THI_NGHIEM:THAO_TAC`

#### Request Body (tất cả optional):

```json
{
  "dia_diem": "Huyện A, Tỉnh B (Cập nhật)",
  "dien_tich": 1200.75
}
```

#### Postman Setup:

1. Method: `PATCH`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1/danh-sach-so-luong/1`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   Content-Type: application/json
   ```
4. Body → raw (JSON):
   ```json
   {
     "dia_diem": "Huyện A, Tỉnh B (Cập nhật)",
     "dien_tich": 1200.75
   }
   ```

#### Response Success (200):

```json
{
  "success": true,
  "message": "Cập nhật danh sách số lượng thí nghiệm thành công",
  "data": {
    "id": 1,
    "dia_diem": "Huyện A, Tỉnh B (Cập nhật)",
    "dien_tich": 1200.75
  }
}
```

---

### 5. Xóa danh sách số lượng

**Endpoint:** `DELETE /de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong/:id`

**Permission:** `DE_CUONG_THI_NGHIEM:THAO_TAC`

#### Postman Setup:

1. Method: `DELETE`
2. URL: `{{baseUrl}}/de-cuong-thi-nghiem/1/danh-sach-so-luong/1`
3. Headers:
   ```
   Authorization: Bearer {{token}}
   ```

#### Response Success (200):

```json
{
  "success": true,
  "message": "Xóa danh sách số lượng thí nghiệm thành công"
}
```

---

## Test Flow Hoàn chỉnh

### Scenario 1: Tạo mới đề cương thí nghiệm có file + sub-module

```
1. POST /de-cuong-thi-nghiem (với file)
   → Backend tạo entity trước (với file_de_cuong_id = null)
   → Sau đó upload file và cập nhật file_de_cuong_id
   → Lưu lại ID (ví dụ: id = 5)
2. POST /de-cuong-thi-nghiem/5/danh-sach-so-luong (địa điểm 1)
3. POST /de-cuong-thi-nghiem/5/danh-sach-so-luong (địa điểm 2)
4. GET /de-cuong-thi-nghiem/5 → Verify data + file + danh sách con
```

### Scenario 2: Cập nhật đề cương + thay file

```
1. GET /de-cuong-thi-nghiem/5 → Check file cũ (id: 123)
2. PATCH /de-cuong-thi-nghiem/5 (upload file mới)
   → Backend set file_de_cuong_id = null
   → Save entity
   → Xóa file cũ (id: 123) khỏi S3 và DB
   → Upload file mới
   → Update file_de_cuong_id mới
3. GET /de-cuong-thi-nghiem/5 → Verify file mới (id: 124)
```

### Scenario 2.1: Cập nhật thông tin (giữ nguyên file)

```
1. GET /de-cuong-thi-nghiem/5 → Check file hiện tại (id: 123)
2. PATCH /de-cuong-thi-nghiem/5 (form-data)
   → ten_thi_nghiem: "Tên mới"
   → kinh_phi_ky_thuat: 60000000
   → KHÔNG truyền field "file" và "xoa_file"
3. GET /de-cuong-thi-nghiem/5 → Verify file vẫn là (id: 123)
```

### Scenario 2.2: Xóa file (không upload mới)

```
1. GET /de-cuong-thi-nghiem/5 → Check file hiện tại (id: 123)
2. PATCH /de-cuong-thi-nghiem/5 (form-data)
   → ten_thi_nghiem: "Tên mới"
   → xoa_file: true
   → Backend set file_de_cuong_id = null
   → Save entity
   → Xóa file (123) khỏi S3 và DB
3. GET /de-cuong-thi-nghiem/5 → Verify file_de_cuong = null
```

### Scenario 3: Filter và phân trang

```
1. GET /de-cuong-thi-nghiem?page=1&limit=5
2. GET /de-cuong-thi-nghiem?ten_thi_nghiem=lúa
3. GET /de-cuong-thi-nghiem?ten_de_tai=nghiên%20cứu&cap_quan_ly_de_tai=Cấp%20Nhà%20nước
4. GET /de-cuong-thi-nghiem?sortBy=ngay_tao&sortOrder=DESC
```

### Scenario 4: Xóa cascade

```
1. POST /de-cuong-thi-nghiem (tạo mới với file) → id = 10
2. POST /de-cuong-thi-nghiem/10/danh-sach-so-luong (thêm 3 danh sách con)
3. DELETE /de-cuong-thi-nghiem/10
   → Backend set file_de_cuong_id = null
   → Save entity
   → Service xóa file khỏi S3 và database
   → Cascade xóa 3 danh sách con (do onDelete: CASCADE)
   → Xóa entity chính
4. GET /de-cuong-thi-nghiem/10 → 404 Not Found
```

**Lưu ý về Foreign Key Constraint:**

- Phải set `file_de_cuong_id = null` trước khi xóa file
- Nếu không sẽ gặp lỗi: `ER_ROW_IS_REFERENCED_2: Cannot delete or update a parent row`
- Thứ tự quan trọng: NULL → Save → Delete file → Delete entity

---

## Validation Errors

### Thiếu trường bắt buộc (Create):

```json
{
  "statusCode": 400,
  "message": "Các trường bắt buộc không được để trống",
  "error": "Bad Request"
}
```

### Kinh phí âm:

```json
{
  "statusCode": 400,
  "message": ["Kinh phí kỹ thuật phải lớn hơn hoặc bằng 0"],
  "error": "Bad Request"
}
```

### Upload file lỗi:

```json
{
  "statusCode": 400,
  "message": "Lỗi upload file",
  "error": "Bad Request"
}
```

### Không có quyền:

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền truy cập vào tài nguyên này",
  "error": "Forbidden"
}
```

---

## Tips cho Postman Testing

### 1. Setup Environment Variables:

```
baseUrl: http://localhost:3000/api
token: <your_jwt_token>
deCuongId: <dynamic - lấy từ response>
```

### 2. Script tự động lưu ID (Tab "Tests"):

```javascript
// Sau khi POST thành công
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("deCuongId", response.data.id);
}
```

### 3. Pre-request Script để refresh token:

```javascript
// Nếu token hết hạn
const loginRequest = {
  url: pm.environment.get("baseUrl") + "/auth/login",
  method: "POST",
  header: "Content-Type: application/json",
  body: {
    mode: "raw",
    raw: JSON.stringify({
      email: "admin@test.com",
      password: "password123",
    }),
  },
};
// ...refresh logic
```

### 4. Collection Variables cho test data:

```
test_de_tai_id: 1
test_ten_thi_nghiem: "Thí nghiệm test"
test_kinh_phi: 10000000
```

---

## Checklist Testing đầy đủ

### ✅ CRUD Chính (Đề cương thí nghiệm):

- [ ] Tạo mới không có file
- [ ] Tạo mới có file
- [ ] Lấy danh sách (no filter)
- [ ] Lấy danh sách với filter theo tên thí nghiệm
- [ ] Lấy danh sách với filter theo tên đề tài
- [ ] Lấy danh sách với filter theo cấp quản lý
- [ ] Lấy danh sách với pagination
- [ ] Lấy danh sách với sort
- [ ] Lấy chi tiết
- [ ] Cập nhật (không đổi file)
- [ ] Cập nhật + thay file mới
- [ ] Cập nhật + xóa file
- [ ] Xóa

### ✅ CRUD Sub-module (Danh sách số lượng):

- [ ] Tạo mới
- [ ] Lấy danh sách
- [ ] Lấy chi tiết
- [ ] Cập nhật
- [ ] Xóa

### ✅ Edge Cases:

- [ ] Tạo với de_tai_id không tồn tại → 404
- [ ] Tạo với kinh phí âm → 400
- [ ] Tạo với ngày kết thúc < ngày bắt đầu
- [ ] Upload file quá lớn → 413
- [ ] Upload file sai định dạng
- [ ] Xóa entity đã có danh sách con → cascade OK
- [ ] Get entity không tồn tại → 404
- [ ] Update entity không tồn tại → 404
- [ ] Không có Bearer token → 401
- [ ] Token hết hạn → 401
- [ ] Không có permission → 403

---

## Notes

1. **File Upload Logic:**
   - POST: Tạo entity trước (file_de_cuong_id = null) → Upload file → Update file_de_cuong_id
   - PATCH: Upload file mới trước → Service tự động xóa file cũ bằng DeleteFileDto → Update entity
   - Sub-module không có file upload
   - **KHÔNG trả về `file_de_cuong_id` trong response** (field nội bộ)

2. **File Response:**
   - File được load động qua `FileHeThongService.layFile()`
   - Response bao gồm: `{ id, ten_goc, url_xem }`
   - `url_xem` là presigned URL có thời hạn (vd: 1 giờ)
   - Pattern giống module HopDong

3. **File Deletion:**
   - Sử dụng `DeleteFileDto` với 3 fields: `module`, `ban_ghi_id`, `ten_truong`
   - Service `xoaFile()` xóa file khỏi S3 và database
   - File cũ tự động xóa khi update file mới
   - **Quan trọng**: Trước khi xóa file, backend phải set `file_de_cuong_id = null` để tránh foreign key constraint error
   - Thứ tự xóa: Set NULL → Save entity → Xóa file từ file_he_thong

4. **File Update Logic (PATCH API):**
   - **Giữ nguyên file**: Không truyền `file` và `xoa_file`
   - **Thay file mới**: Truyền `file` mới → Backend tự động xóa file cũ
   - **Xóa file (không upload mới)**: Truyền `xoa_file: true` (hoặc `"true"`)
   - **Ưu tiên**: Nếu truyền cả `file` và `xoa_file`, `xoa_file` thực hiện trước, sau đó upload `file` mới
   - **Thứ tự xử lý**: 1) Update thông tin → 2) Xóa file (nếu có) → 3) Upload file mới (nếu có)

5. **Date Format:**
   - Gửi: `YYYY-MM-DD` (vd: 2026-02-01)
   - Nhận: ISO 8601 (vd: 2026-02-01T00:00:00.000Z)

6. **Decimal Numbers:**
   - Kinh phí: Hỗ trợ 15 chữ số, 2 chữ số thập phân (DECIMAL(15,2))
   - Diện tích: Hỗ trợ 10 chữ số, 2 chữ số thập phân (DECIMAL(10,2))

7. **Cascade Delete:**
   - Xóa đề cương → Tự động xóa danh sách số lượng con (onDelete: CASCADE)
   - File được xóa thủ công bằng service.xoaFile()

8. **File Management:**
   - File được lưu trữ trên AWS S3
   - Mỗi file có `url_xem` là presigned URL (có thời hạn)
   - FileHeThongService quản lý upload/delete với DeleteFileDto pattern
   - Không dùng eager loading, file được load động khi cần

---

**Tài liệu được tạo:** 2026-01-12  
**Module:** DE_CUONG_THI_NGHIEM  
**Version:** 1.0
