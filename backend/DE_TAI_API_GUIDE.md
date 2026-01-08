# Hướng Dẫn Test API Module Đề Tài

## 📋 Tổng Quan

Module **Đề Tài** quản lý thông tin đề tài nghiên cứu cùng các danh sách con: Kinh phí theo năm, Sản phẩm dự kiến, Sản phẩm thực tế, và Hồ sơ lưu trữ.

**Base URL**: `http://localhost:3000/api`

**Authentication**: Bearer Token (JWT)

**Permissions**:

- `DE_TAI` - `XEM`: Xem danh sách và chi tiết đề tài
- `DE_TAI` - `THAO_TAC`: Tạo, cập nhật, xóa đề tài và các thành phần con

---

## 🔐 Setup Postman

### 1. Tạo Environment

- Environment name: `DeTai Dev`
- Variables:
  ```
  base_url: http://localhost:3000/api
  token: <your_jwt_token>
  de_tai_id: <will_be_set_dynamically>
  ```

### 2. Lấy Access Token

```http
POST {{base_url}}/auth/dang-nhap
Content-Type: application/json

{
  "ten_dang_nhap": "admin",
  "mat_khau": "admin123"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Copy `access_token` → Paste vào Environment variable `token`

---

## 🔑 Cấu Hình Quyền

### Bước 1: Thêm quyền cho vai trò

Truy cập module **Vai Trò** và thêm quyền cho module `DE_TAI`:

```http
POST {{base_url}}/vai-tro/:vaiTroId/phan-quyen
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "ma_module": "DE_TAI",
  "xem": true,
  "thao_tac": true
}
```

### Bước 2: Kiểm tra quyền

```http
GET {{base_url}}/vai-tro/:vaiTroId
Authorization: Bearer {{token}}
```

Response sẽ chứa thông tin quyền:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_vai_tro": "Admin",
    "danh_sach_quyen": [
      {
        "ma_module": "DE_TAI",
        "ten_module": "Đề tài",
        "xem": true,
        "thao_tac": true
      }
    ]
  }
}
```

---

## 📦 1. API Đề Tài (Chính)

### 1.1. Tạo Đề Tài Mới

```http
POST {{base_url}}/de-tai
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "ten_de_tai": "Nghiên cứu công nghệ AI trong nông nghiệp",
  "ma_de_tai": "DT2024001",
  "don_vi_phe_duyet": "Bộ Khoa học và Công nghệ",
  "cap_quan_ly_de_tai": "Cấp Nhà nước",
  "ngay_bat_dau": "2024-01-01",
  "ngay_ket_thuc": "2026-12-31",
  "phuong_thuc_khoang_chi": "Chuyển khoản",
  "noi_dung_khoang_chi": "Chi phí nghiên cứu, thiết bị, nhân công",
  "linh_vuc_khoa_hoc": "Công nghệ thông tin",
  "nguon_goc_de_tai": "Đề tài nghiên cứu cơ bản",
  "chu_nhiem_de_tai": "TS. Nguyễn Văn A",
  "thu_ky_de_tai": "ThS. Trần Thị B",
  "hien_trang_nghiem_thu": "Đang thực hiện",
  "thong_tin_doi_tac": "Viện Khoa học Công nghệ",
  "kinh_phi_tong": 5000000000
}
```

**Response Success**:

```json
{
  "success": true,
  "message": "Tạo đề tài thành công",
  "data": {
    "id": 1,
    "ten_de_tai": "Nghiên cứu công nghệ AI trong nông nghiệp",
    "ma_de_tai": "DT2024001",
    ...
    "ngay_tao": "2024-01-08T10:00:00.000Z"
  }
}
```

**⚠️ Lưu ý**: Copy `id` vào Environment variable `de_tai_id`

---

### 1.2. Lấy Danh Sách Đề Tài

```http
GET {{base_url}}/de-tai?page=1&limit=10&sortBy=ngay_tao&sortOrder=DESC
Authorization: Bearer {{token}}
```

**Query Parameters**:

- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số bản ghi/trang (mặc định: 10)
- `sortBy`: Trường sắp xếp (mặc định: `ngay_tao`)
- `sortOrder`: Chiều sắp xếp (`ASC`/`DESC`)
- `search`: Tìm kiếm (tên, mã, chủ nhiệm)
- `ten_de_tai`: Lọc theo tên
- `ma_de_tai`: Lọc theo mã
- `don_vi_phe_duyet`: Lọc theo đơn vị
- `cap_quan_ly_de_tai`: Lọc theo cấp quản lý
- `chu_nhiem_de_tai`: Lọc theo chủ nhiệm
- `hien_trang_nghiem_thu`: Lọc theo hiện trạng
- `ngay_bat_dau_tu`: Lọc ngày bắt đầu từ
- `ngay_bat_dau_den`: Lọc ngày bắt đầu đến

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ten_de_tai": "Nghiên cứu công nghệ AI...",
      "ma_de_tai": "DT2024001",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 1.3. Lấy Chi Tiết Đề Tài

```http
GET {{base_url}}/de-tai/{{de_tai_id}}
Authorization: Bearer {{token}}
```

**Response**: (bao gồm tất cả danh sách con)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ten_de_tai": "...",
    "danh_sach_kinh_phi": [...],
    "danh_sach_san_pham": [...],
    "danh_sach_san_pham_thuc_te": [...],
    "danh_sach_ho_so": [...]
  }
}
```

---

### 1.4. Cập Nhật Đề Tài

```http
PATCH {{base_url}}/de-tai/{{de_tai_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "hien_trang_nghiem_thu": "Đã hoàn thành",
  "kinh_phi_tong": 5500000000
}
```

**Response**:

```json
{
  "success": true,
  "message": "Cập nhật đề tài thành công",
  "data": {
    "id": 1,
    ...
  }
}
```

---

### 1.5. Xóa Đề Tài

```http
DELETE {{base_url}}/de-tai/{{de_tai_id}}
Authorization: Bearer {{token}}
```

**Response**:

```json
{
  "success": true,
  "message": "Xóa đề tài thành công"
}
```

**⚠️ Lưu ý**: Cascade delete tất cả danh sách con

---

## 💰 2. API Kinh Phí Theo Năm

### 2.1. Thêm Kinh Phí

```http
POST {{base_url}}/de-tai/{{de_tai_id}}/kinh-phi
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nam": 2024,
  "kinh_phi": 1500000000
}
```

**Validation**:

- ✅ Năm phải nằm trong khoảng ngày bắt đầu - kết thúc của đề tài
- ✅ Tổng kinh phí không vượt quá kinh phí tổng

**Response**:

```json
{
  "success": true,
  "message": "Thêm kinh phí thành công",
  "data": {
    "id": 1,
    "nam": 2024,
    "kinh_phi": "1500000000.00",
    "de_tai_id": 1
  }
}
```

---

### 2.2. Lấy Danh Sách Kinh Phí

```http
GET {{base_url}}/de-tai/{{de_tai_id}}/kinh-phi
Authorization: Bearer {{token}}
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nam": 2024,
      "kinh_phi": "1500000000.00"
    },
    {
      "id": 2,
      "nam": 2025,
      "kinh_phi": "2000000000.00"
    }
  ]
}
```

---

### 2.3. Cập Nhật Kinh Phí

```http
PATCH {{base_url}}/de-tai/{{de_tai_id}}/kinh-phi/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "kinh_phi": 1800000000
}
```

---

### 2.4. Xóa Kinh Phí

```http
DELETE {{base_url}}/de-tai/{{de_tai_id}}/kinh-phi/1
Authorization: Bearer {{token}}
```

---

## 📦 3. API Sản Phẩm Dự Kiến

### 3.1. Thêm Sản Phẩm

```http
POST {{base_url}}/de-tai/{{de_tai_id}}/san-pham
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "ten_san_pham": "Báo cáo nghiên cứu khoa học"
}
```

---

### 3.2. Lấy Danh Sách Sản Phẩm

```http
GET {{base_url}}/de-tai/{{de_tai_id}}/san-pham
Authorization: Bearer {{token}}
```

---

### 3.3. Cập Nhật Sản Phẩm

```http
PATCH {{base_url}}/de-tai/{{de_tai_id}}/san-pham/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "ten_san_pham": "Báo cáo tổng hợp kết quả nghiên cứu"
}
```

---

### 3.4. Xóa Sản Phẩm

```http
DELETE {{base_url}}/de-tai/{{de_tai_id}}/san-pham/1
Authorization: Bearer {{token}}
```

---

## ✅ 4. API Sản Phẩm Thực Tế

### 4.1. Thêm Sản Phẩm Thực Tế

```http
POST {{base_url}}/de-tai/{{de_tai_id}}/san-pham-thuc-te
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "ten_san_pham": "Bài báo khoa học trên tạp chí quốc tế"
}
```

---

### 4.2. Lấy Danh Sách Sản Phẩm Thực Tế

```http
GET {{base_url}}/de-tai/{{de_tai_id}}/san-pham-thuc-te
Authorization: Bearer {{token}}
```

---

### 4.3. Cập Nhật Sản Phẩm Thực Tế

```http
PATCH {{base_url}}/de-tai/{{de_tai_id}}/san-pham-thuc-te/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "ten_san_pham": "3 bài báo ISI/Scopus"
}
```

---

### 4.4. Xóa Sản Phẩm Thực Tế

```http
DELETE {{base_url}}/de-tai/{{de_tai_id}}/san-pham-thuc-te/1
Authorization: Bearer {{token}}
```

---

## 📁 5. API Hồ Sơ Lưu Trữ

### 5.1. Tạo Hồ Sơ Lưu Trữ KÈM FILE (nếu có)

**Không cần upload file trước!** File được upload cùng lúc với tạo hồ sơ.

```http
POST {{base_url}}/de-tai/{{de_tai_id}}/ho-so
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

loai_ho_so: Hồ sơ nghiệm thu
nam: 2024
file: [chọn file]
```

**Response**:

```json
{
  "success": true,
  "message": "Thêm hồ sơ lưu trữ thành công",
  "data": {
    "id": 1,
    "loai_ho_so": "Hồ sơ nghiệm thu",
    "ten_file": "nghiem-thu.pdf",
    "nam": 2024,
    "de_tai_id": 1,
    "file_ho_so": {
      "id": 10,
      "ten_goc": "nghiem-thu.pdf",
      "url_xem": "https://..."
    }
  }
}
```

**⚠️ Lưu ý**:

- Field `file` là optional - có thể tạo hồ sơ mà không có file
- File được upload trực tiếp khi tạo hồ sơ
- Không cần API upload file riêng

---

### 5.2. Lấy Danh Sách Hồ Sơ

```http
GET {{base_url}}/de-tai/{{de_tai_id}}/ho-so
Authorization: Bearer {{token}}
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "loai_ho_so": "Hồ sơ nghiệm thu",
      "ten_file": "nghiem-thu.pdf",
      "nam": 2024,
      "file_ho_so": {
        "id": 10,
        "ten_goc": "nghiem-thu.pdf",
        "url_xem": "https://..."
      }
    }
  ]
}
```

---

### 5.3. Cập Nhật Hồ Sơ KÈM FILE (nếu có)

```http
PATCH {{base_url}}/de-tai/{{de_tai_id}}/ho-so/1
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

loai_ho_so: Hồ sơ nghiệm thu giai đoạn 1
nam: 2025
file: [chọn file mới]
```

**Xóa file hiện tại**:

```http
PATCH {{base_url}}/de-tai/{{de_tai_id}}/ho-so/1
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

xoa_file: true
```

**Response**: Tương tự như tạo mới

---

### 5.4. Xóa Hồ Sơ

```http
DELETE {{base_url}}/de-tai/{{de_tai_id}}/ho-so/1
Authorization: Bearer {{token}}
```

**⚠️ Lưu ý**: File sẽ tự động bị xóa khi xóa hồ sơ

**Response**:

```json
{
  "success": true,
  "message": "Xóa hồ sơ lưu trữ thành công"
}
```

---

## 🔄 Workflow Test Hoàn Chỉnh

### Scenario: Tạo đề tài với đầy đủ thông tin

1. **Tạo đề tài** → Lấy `de_tai_id`
2. **Thêm kinh phí năm 2024** (1.5 tỷ)
3. **Thêm kinh phí năm 2025** (2 tỷ)
4. **Thêm sản phẩm dự kiến**
5. **Thêm hồ sơ lưu trữ KÈM FILE** (multipart/form-data)
6. **Lấy chi tiết đề tài** (xem tất cả)
7. **Cập nhật sản phẩm thực tế**
8. **Cập nhật hồ sơ KÈM FILE MỚI**
9. **Xóa 1 kinh phí**
10. **Lấy lại danh sách kinh phí**
11. **Xóa hồ sơ** (file tự động xóa)

**⚠️ Lưu ý quan trọng**:

- **KHÔNG** upload file trước rồi mới tạo hồ sơ
- File được upload **CÙNG LÚC** với tạo/sửa hồ sơ
- Xóa hồ sơ sẽ **TỰ ĐỘNG** xóa file

---

## ⚠️ Error Cases

### 1. Không có quyền truy cập

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Bạn không có quyền XEM module DE_TAI"
}
```

hoặc

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Bạn không có quyền THAO_TAC module DE_TAI"
}
```

### 2. Ngày kết thúc <= Ngày bắt đầu

```json
{
  "success": false,
  "message": "Ngày kết thúc phải sau ngày bắt đầu"
}
```

### 3. Năm kinh phí ngoài khoảng

```json
{
  "success": false,
  "message": "Năm phải nằm trong khoảng 2024 - 2026"
}
```

### 4. Tổng kinh phí vượt quá

```json
{
  "success": false,
  "message": "Tổng kinh phí (6000000000) vượt quá kinh phí tổng (5000000000)"
}
```

---

## 📋 Checklist Test

- [ ] **Setup quyền**
  - [ ] Thêm module DE_TAI vào modules.constant.ts
  - [ ] Cấp quyền XEM và THAO_TAC cho vai trò
  - [ ] Kiểm tra quyền hiển thị đúng
- [ ] **API Đề Tài**
  - [ ] Tạo đề tài thành công
  - [ ] Validate ngày bắt đầu/kết thúc
  - [ ] Lấy danh sách với pagination
  - [ ] Filter theo các trường
  - [ ] Tìm kiếm (search)
  - [ ] Sắp xếp (sort)
  - [ ] Cập nhật đề tài
  - [ ] Test permission guard (user không có quyền)
- [ ] **API Kinh phí**
  - [ ] Thêm kinh phí theo năm
  - [ ] Validate năm trong khoảng
  - [ ] Validate tổng kinh phí
  - [ ] Test permission XEM
  - [ ] Test permission THAO_TAC
- [ ] **API Sản phẩm**
  - [ ] Thêm sản phẩm dự kiến/thực tế
  - [ ] Lấy danh sách
  - [ ] Cập nhật và xóa
  - [ ] Test permission guard
- [ ] **API Hồ sơ**
  - [ ] Tạo hồ sơ KÈM FILE (multipart/form-data)
  - [ ] Tạo hồ sơ KHÔNG CÓ FILE
  - [ ] Lấy danh sách với file info (url_xem)
  - [ ] Cập nhật hồ sơ KÈM FILE MỚI
  - [ ] Xóa file riêng (xoa_file=true)
  - [ ] Xóa hồ sơ (cascade xóa file)
  - [ ] Test permission guard
- [ ] **Cascade & Relations**
  - [ ] Lấy chi tiết đề tài (include all)
  - [ ] Xóa từng item con
  - [ ] Xóa đề tài (cascade delete)

---

**Cập nhật**: 08/01/2026  
**Version**: 2.0
