# HƯỚNG DẪN TEST API - NHÀ LƯỚI

## 📋 Tổng Quan

Module **Nhà Lưới** quản lý thông tin nhà lưới trong hệ thống, bao gồm:

- Tên nhà lưới
- Khu vực
- Số bể
- Diện tích
- Địa điểm

**Base URL**: `http://localhost:3000/api/nha-luoi`

---

## 🔐 Yêu Cầu Authentication

Tất cả các API đều yêu cầu:

- **Header**: `Authorization: Bearer <access_token>`
- **Permission**:
  - `XEM`: Xem danh sách, xem chi tiết
  - `THAO_TAC`: Tạo mới, cập nhật, xóa

---

## 📌 1. TẠO NHÀ LƯỚI MỚI

### Request

```http
POST /api/nha-luoi
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "ten_nha_luoi": "Nhà lưới số 1",
  "khu": "Khu A",
  "so_be": 10,
  "dien_tich": 500.5,
  "dia_diem": "Phía Đông"
}
```

**Validation:**

- `ten_nha_luoi`: Bắt buộc, string, max 255 ký tự
- `khu`: Bắt buộc, string, max 255 ký tự
- `so_be`: Bắt buộc, number, >= 0
- `dien_tich`: Bắt buộc, number, >= 0
- `dia_diem`: Tùy chọn, string, max 255 ký tự

### Response Success (201)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_nha_luoi": "Nhà lưới số 1",
    "khu": "Khu A",
    "so_be": 10,
    "dien_tich": 500.5,
    "dia_diem": "Phía Đông",
    "nguoi_cap_nhat_id": 1,
    "nguoi_cap_nhat": {
      "id": 1,
      "ho_ten": "Nguyễn Văn A"
    },
    "ngay_tao": "2026-01-13T10:30:00.000Z",
    "ngay_cap_nhat": "2026-01-13T10:30:00.000Z"
  }
}
```

### Response Error

**400 Bad Request** - Validation error:

```json
{
  "statusCode": 400,
  "message": [
    "Tên nhà lưới không được để trống",
    "Số bể phải lớn hơn hoặc bằng 0"
  ],
  "error": "Bad Request"
}
```

**403 Forbidden** - Không có quyền:

```json
{
  "statusCode": 403,
  "message": "Không có quyền truy cập",
  "error": "Forbidden"
}
```

---

## 📌 2. LẤY DANH SÁCH NHÀ LƯỚI (CÓ PHÂN TRANG & FILTER)

### Request

```http
GET /api/nha-luoi?page=1&limit=10&ten_nha_luoi=số&khu=A&so_be=10&dien_tich=500.5
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng/trang (mặc định: 10, max: 100)
- `ten_nha_luoi`: Filter theo tên nhà lưới (tìm kiếm LIKE)
- `khu`: Filter theo khu (tìm kiếm LIKE)
- `so_be`: Filter theo số bể (tìm chính xác)
- `dien_tich`: Filter theo diện tích (tìm chính xác)

**Ví dụ:**

- Lấy tất cả: `GET /api/nha-luoi`
- Filter theo tên: `GET /api/nha-luoi?ten_nha_luoi=số 1`
- Filter theo khu: `GET /api/nha-luoi?khu=Khu A`
- Filter theo số bể: `GET /api/nha-luoi?so_be=10`
- Filter kết hợp: `GET /api/nha-luoi?khu=A&so_be=10`

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ten_nha_luoi": "Nhà lưới số 1",
      "khu": "Khu A",
      "so_be": 10,
      "dien_tich": 500.5,
      "dia_diem": "Phía Đông",
      "nguoi_cap_nhat_id": 1,
      "nguoi_cap_nhat": {
        "id": 1,
        "ho_ten": "Nguyễn Văn A"
      },
      "ngay_tao": "2026-01-13T10:30:00.000Z",
      "ngay_cap_nhat": "2026-01-13T10:30:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1,
    "has_previous": false,
    "has_next": false
  }
}
```

---

## 📌 3. LẤY CHI TIẾT NHÀ LƯỚI

### Request

```http
GET /api/nha-luoi/:id
Authorization: Bearer <access_token>
```

**Ví dụ:**

```http
GET /api/nha-luoi/1
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_nha_luoi": "Nhà lưới số 1",
    "khu": "Khu A",
    "so_be": 10,
    "dien_tich": 500.5,
    "dia_diem": "Phía Đông",
    "nguoi_cap_nhat_id": 1,
    "nguoi_cap_nhat": {
      "id": 1,
      "ho_ten": "Nguyễn Văn A"
    },
    "ngay_tao": "2026-01-13T10:30:00.000Z",
    "ngay_cap_nhat": "2026-01-13T10:30:00.000Z"
  }
}
```

### Response Error

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy nhà lưới với ID 999",
  "error": "Not Found"
}
```

---

## 📌 4. CẬP NHẬT NHÀ LƯỚI

### Request

```http
PATCH /api/nha-luoi/:id
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Body** (tất cả fields đều optional):

```json
{
  "ten_nha_luoi": "Nhà lưới số 1 - Đã cập nhật",
  "khu": "Khu B",
  "so_be": 15,
  "dien_tich": 600.75,
  "dia_diem": "Phía Tây"
}
```

**Ví dụ cập nhật một phần:**

```json
{
  "so_be": 12,
  "dien_tich": 550.0
}
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_nha_luoi": "Nhà lưới số 1 - Đã cập nhật",
    "khu": "Khu B",
    "so_be": 15,
    "dien_tich": 600.75,
    "dia_diem": "Phía Tây",
    "nguoi_cap_nhat_id": 1,
    "nguoi_cap_nhat": {
      "id": 1,
      "ho_ten": "Nguyễn Văn A"
    },
    "ngay_tao": "2026-01-13T10:30:00.000Z",
    "ngay_cap_nhat": "2026-01-13T11:00:00.000Z"
  }
}
```

### Response Error

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy nhà lưới với ID 999",
  "error": "Not Found"
}
```

**400 Bad Request** - Validation error:

```json
{
  "statusCode": 400,
  "message": ["Số bể phải lớn hơn hoặc bằng 0"],
  "error": "Bad Request"
}
```

---

## 📌 5. XÓA NHÀ LƯỚI

### Request

```http
DELETE /api/nha-luoi/:id
Authorization: Bearer <access_token>
```

**Ví dụ:**

```http
DELETE /api/nha-luoi/1
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "message": "Xóa nhà lưới thành công"
  }
}
```

### Response Error

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy nhà lưới với ID 999",
  "error": "Not Found"
}
```

**403 Forbidden** - Không có quyền:

```json
{
  "statusCode": 403,
  "message": "Không có quyền truy cập",
  "error": "Forbidden"
}
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Luồng Tạo - Xem - Sửa - Xóa

1. **Đăng nhập** để lấy token
2. **Tạo nhà lưới mới**:
   ```
   POST /api/nha-luoi
   Body: { ten_nha_luoi, khu, so_be, dien_tich, dia_diem }
   ```
3. **Xem danh sách** (kiểm tra nhà lưới vừa tạo):
   ```
   GET /api/nha-luoi
   ```
4. **Xem chi tiết**:
   ```
   GET /api/nha-luoi/1
   ```
5. **Cập nhật**:
   ```
   PATCH /api/nha-luoi/1
   Body: { so_be: 20 }
   ```
6. **Xóa**:
   ```
   DELETE /api/nha-luoi/1
   ```

### Scenario 2: Test Filter

1. Tạo nhiều nhà lưới với dữ liệu khác nhau
2. Test filter theo tên:
   ```
   GET /api/nha-luoi?ten_nha_luoi=số 1
   ```
3. Test filter theo khu:
   ```
   GET /api/nha-luoi?khu=Khu A
   ```
4. Test filter theo số bể:
   ```
   GET /api/nha-luoi?so_be=10
   ```
5. Test filter kết hợp:
   ```
   GET /api/nha-luoi?khu=A&so_be=10
   ```

### Scenario 3: Test Validation

1. Tạo nhà lưới không có tên (400):
   ```json
   POST /api/nha-luoi
   Body: { "khu": "A", "so_be": 10 }
   ```
2. Tạo nhà lưới với số bể âm (400):
   ```json
   POST /api/nha-luoi
   Body: { "ten_nha_luoi": "Test", "khu": "A", "so_be": -5 }
   ```

### Scenario 4: Test Permission

1. Đăng nhập với user không có quyền `THAO_TAC` trên module `NHA_LUOI`
2. Thử tạo nhà lưới → Expect 403 Forbidden
3. Thử xóa nhà lưới → Expect 403 Forbidden
4. Xem danh sách → Expect 200 OK (nếu có quyền `XEM`)

---

## 📝 LƯU Ý

1. **Mặc định sắp xếp**: Danh sách được sắp xếp theo `ngay_tao DESC` (mới nhất lên đầu)
2. **Filter động**:
   - String fields (`ten_nha_luoi`, `khu`): Tìm kiếm LIKE (partial match)
   - Number fields (`so_be`, `dien_tich`): Tìm chính xác (exact match)
3. **Người cập nhật**: Tự động lấy từ token JWT, không cần gửi trong body
4. **Ngày giờ**: Tự động generate bởi database
5. **Phân trang**: Có thể điều chỉnh `page` và `limit` theo nhu cầu

---

## 🔧 POSTMAN COLLECTION

Để test nhanh, import collection sau vào Postman:

**Variables:**

- `base_url`: `http://localhost:3000/api`
- `access_token`: `<your_token_here>`

**Requests:**

1. POST `{{base_url}}/nha-luoi` - Tạo nhà lưới
2. GET `{{base_url}}/nha-luoi` - Lấy danh sách
3. GET `{{base_url}}/nha-luoi/1` - Lấy chi tiết
4. PATCH `{{base_url}}/nha-luoi/1` - Cập nhật
5. DELETE `{{base_url}}/nha-luoi/1` - Xóa

**Headers (tất cả requests):**

- `Authorization`: `Bearer {{access_token}}`
- `Content-Type`: `application/json` (cho POST/PATCH)

---

## ✅ CHECKLIST TEST

- [ ] Tạo nhà lưới mới thành công
- [ ] Validation fields bắt buộc
- [ ] Validation số âm (so_be, dien_tich)
- [ ] Lấy danh sách có phân trang
- [ ] Filter theo tên nhà lưới
- [ ] Filter theo khu
- [ ] Filter theo số bể
- [ ] Filter theo diện tích
- [ ] Filter kết hợp nhiều fields
- [ ] Xem chi tiết nhà lưới
- [ ] Cập nhật nhà lưới
- [ ] Xóa nhà lưới
- [ ] Test permission (403 khi không có quyền)
- [ ] Test 404 khi ID không tồn tại
- [ ] Thông tin `nguoi_cap_nhat` chỉ có id và ho_ten
