# API Lần Sử Dụng Nhà Lưới - Hướng Dẫn Chi Tiết

## Mục Lục
- [Tổng Quan](#tổng-quan)
- [Đường Dẫn Base](#đường-dẫn-base)
- [Cấu Trúc Dữ Liệu](#cấu-trúc-dữ-liệu)
- [Danh Sách API](#danh-sách-api)
  - [Tạo Lần Sử Dụng](#1-tạo-lần-sử-dụng)
  - [Lấy Danh Sách](#2-lấy-danh-sách-lần-sử-dụng)
  - [Lấy Chi Tiết](#3-lấy-chi-tiết-lần-sử-dụng)
  - [Cập Nhật](#4-cập-nhật-lần-sử-dụng)
  - [Xóa](#5-xóa-lần-sử-dụng)

---

## Tổng Quan

Sub-module **Lần Sử Dụng** quản lý lịch sử sử dụng nhà lưới cho các đề cương thí nghiệm. Đặc điểm:

- **Route nested**: `/nha-luoi/:nhaLuoiId/lan-su-dung`
- **Bắt buộc**: Đề cương thí nghiệm (ID trong payload)
- **Tùy chọn**: Dụng cụ, số lượng, ngày mượn/trả, khấu hao, hiện trạng
- **File đính kèm**: Tích hợp trong API tạo/sửa (không có endpoint riêng)
- **Query phức tạp**: Join 3 bảng `lan_su_dung → de_cuong_thi_nghiem → de_tai`

---

## Đường Dẫn Base

```
Base URL: /nha-luoi/:nhaLuoiId/lan-su-dung
```

**Lưu ý**: `:nhaLuoiId` là path parameter bắt buộc, **không phải** query parameter

---

## Cấu Trúc Dữ Liệu

### Entity `LanSuDung`

```typescript
{
  id: number;                        // PK, auto-increment
  nha_luoi_id: number;               // FK → nha_luoi.id (required)
  de_cuong_thi_nghiem_id: number;    // FK → de_cuong_thi_nghiem.id (required)
  dung_cu?: string;                  // Tùy chọn
  so_luong?: number;                 // Tùy chọn
  ngay_muon?: Date;                  // Tùy chọn
  ngay_tra?: Date;                   // Tùy chọn
  khau_hao?: number;                 // Tùy chọn
  hien_trang?: string;               // Tùy chọn
  ten_file?: string;                 // Tên file (tự động)
  nguoi_cap_nhat_id: number;         // FK → nguoi_dung.id
  ngay_tao: Date;                    // Auto timestamp
  ngay_cap_nhat: Date;               // Auto timestamp
}
```

### Response Object (Có Relations)

```typescript
{
  id: number;
  nha_luoi_id: number;
  de_cuong_thi_nghiem_id: number;
  dung_cu: string | null;
  so_luong: number | null;
  ngay_muon: string | null;         // ISO date string
  ngay_tra: string | null;          // ISO date string
  khau_hao: number | null;
  hien_trang: string | null;
  ten_file: string | null;
  nguoi_cap_nhat_id: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
  
  // Relations
  nhaLuoi: {
    id: number;
    ten_nha_luoi: string;
    khu: string;
  };
  
  deCuongThiNghiem: {
    id: number;
    ten_thi_nghiem: string;
    nguoi_thuc_hien: string;
    ngay_bat_dau: string;
    ngay_ket_thuc: string;
    deTai: {
      id: number;
      ten_de_tai: string;
      cap_quan_ly_de_tai: string;
    };
  };
  
  nguoi_cap_nhat: {
    id: number;
    ho_ten: string;
  };
  
  file_lan_su_dung: {      // Chỉ có trong GET detail và GET list
    id: number;
    ten_goc: string;
    url_xem: string;       // Presigned URL (TTL 1h)
  } | null;
}
```

---

## Danh Sách API

### 1. Tạo Lần Sử Dụng

**Endpoint**: `POST /nha-luoi/:nhaLuoiId/lan-su-dung`

**Quyền**: `NHA_LUOI:THAO_TAC`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** (form-data):

```typescript
{
  de_cuong_thi_nghiem_id: number;    // Bắt buộc
  dung_cu?: string;                  // Tùy chọn
  so_luong?: number;                 // Tùy chọn
  ngay_muon?: string;                // ISO date, tùy chọn
  ngay_tra?: string;                 // ISO date, tùy chọn
  khau_hao?: number;                 // Tùy chọn
  hien_trang?: string;               // Tùy chọn
  file?: File;                       // Tùy chọn, max 10MB
}
```

**Ví Dụ Request** (JavaScript):

```javascript
const formData = new FormData();
formData.append('de_cuong_thi_nghiem_id', '5');
formData.append('dung_cu', 'Khay ươm, nhíp');
formData.append('so_luong', '20');
formData.append('ngay_muon', '2024-01-15');
formData.append('ngay_tra', '2024-02-15');
formData.append('khau_hao', '0');
formData.append('hien_trang', 'Tốt');
formData.append('file', fileInput.files[0]);

fetch('/nha-luoi/3/lan-su-dung', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

**Response Success** (201):

```json
{
  "id": 1,
  "nha_luoi_id": 3,
  "de_cuong_thi_nghiem_id": 5,
  "dung_cu": "Khay ươm, nhíp",
  "so_luong": 20,
  "ngay_muon": "2024-01-15T00:00:00.000Z",
  "ngay_tra": "2024-02-15T00:00:00.000Z",
  "khau_hao": 0,
  "hien_trang": "Tốt",
  "ten_file": "file_1234567890.pdf",
  "nguoi_cap_nhat_id": 10,
  "ngay_tao": "2024-01-10T10:30:00.000Z",
  "ngay_cap_nhat": "2024-01-10T10:30:00.000Z",
  "nhaLuoi": {
    "id": 3,
    "ten_nha_luoi": "Nhà lưới 1",
    "khu": "Khu A"
  },
  "deCuongThiNghiem": {
    "id": 5,
    "ten_thi_nghiem": "Thí nghiệm nhân giống lúa",
    "nguoi_thuc_hien": "Nguyễn Văn A",
    "ngay_bat_dau": "2024-01-01T00:00:00.000Z",
    "ngay_ket_thuc": "2024-12-31T00:00:00.000Z",
    "deTai": {
      "id": 2,
      "ten_de_tai": "Chọn tạo giống lúa chịu hạn",
      "cap_quan_ly_de_tai": "Cấp Viện"
    }
  },
  "nguoi_cap_nhat": {
    "id": 10,
    "ho_ten": "Admin User"
  }
}
```

**Lỗi Phổ Biến**:

```json
// 400 - Missing required field
{
  "statusCode": 400,
  "message": ["de_cuong_thi_nghiem_id không được để trống"],
  "error": "Bad Request"
}

// 400 - Invalid file type
{
  "statusCode": 400,
  "message": "Chỉ chấp nhận file: pdf, doc, docx, xls, xlsx, jpg, jpeg, png",
  "error": "Bad Request"
}

// 404 - Nhà lưới không tồn tại
{
  "statusCode": 404,
  "message": "Không tìm thấy nhà lưới với ID 999",
  "error": "Not Found"
}
```

---

### 2. Lấy Danh Sách Lần Sử Dụng

**Endpoint**: `GET /nha-luoi/:nhaLuoiId/lan-su-dung`

**Quyền**: `NHA_LUOI:XEM`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**: Không có

**Response Success** (200):

```json
[
  {
    "id": 2,
    "nha_luoi_id": 3,
    "de_cuong_thi_nghiem_id": 6,
    "dung_cu": "Bình tưới, kéo",
    "so_luong": 15,
    "ngay_muon": "2024-02-01T00:00:00.000Z",
    "ngay_tra": null,
    "khau_hao": 5,
    "hien_trang": "Bình tưới bị rò nước nhẹ",
    "ten_file": "bien_ban_1234567891.pdf",
    "nguoi_cap_nhat_id": 12,
    "ngay_tao": "2024-02-01T09:00:00.000Z",
    "ngay_cap_nhat": "2024-02-01T09:00:00.000Z",
    "nhaLuoi": {
      "id": 3,
      "ten_nha_luoi": "Nhà lưới 1",
      "khu": "Khu A"
    },
    "deCuongThiNghiem": {
      "id": 6,
      "ten_thi_nghiem": "Thí nghiệm phân bón hữu cơ",
      "nguoi_thuc_hien": "Trần Thị B",
      "ngay_bat_dau": "2024-02-01T00:00:00.000Z",
      "ngay_ket_thuc": "2024-05-31T00:00:00.000Z",
      "deTai": {
        "id": 3,
        "ten_de_tai": "Nghiên cứu phân bón sinh học",
        "cap_quan_ly_de_tai": "Cấp Bộ"
      }
    },
    "nguoi_cap_nhat": {
      "id": 12,
      "ho_ten": "User B"
    },
    "file_lan_su_dung": {
      "id": 45,
      "ten_goc": "bien_ban_su_dung.pdf",
      "url_xem": "https://s3.amazonaws.com/bucket/...?signature=..."
    }
  },
  {
    "id": 1,
    "nha_luoi_id": 3,
    "de_cuong_thi_nghiem_id": 5,
    "dung_cu": "Khay ươm, nhíp",
    "so_luong": 20,
    "ngay_muon": "2024-01-15T00:00:00.000Z",
    "ngay_tra": "2024-02-15T00:00:00.000Z",
    "khau_hao": 0,
    "hien_trang": "Tốt",
    "ten_file": null,
    "nguoi_cap_nhat_id": 10,
    "ngay_tao": "2024-01-10T10:30:00.000Z",
    "ngay_cap_nhat": "2024-01-10T10:30:00.000Z",
    "nhaLuoi": {
      "id": 3,
      "ten_nha_luoi": "Nhà lưới 1",
      "khu": "Khu A"
    },
    "deCuongThiNghiem": {
      "id": 5,
      "ten_thi_nghiem": "Thí nghiệm nhân giống lúa",
      "nguoi_thuc_hien": "Nguyễn Văn A",
      "ngay_bat_dau": "2024-01-01T00:00:00.000Z",
      "ngay_ket_thuc": "2024-12-31T00:00:00.000Z",
      "deTai": {
        "id": 2,
        "ten_de_tai": "Chọn tạo giống lúa chịu hạn",
        "cap_quan_ly_de_tai": "Cấp Viện"
      }
    },
    "nguoi_cap_nhat": {
      "id": 10,
      "ho_ten": "Admin User"
    },
    "file_lan_su_dung": null
  }
]
```

**Lưu Ý**:
- Sắp xếp mặc định: `ngay_tao DESC` (mới nhất trước)
- Không có phân trang
- Trả về mảng rỗng `[]` nếu nhà lưới chưa có lần sử dụng nào
- `file_lan_su_dung` có `url_xem` với TTL 1 giờ

---

### 3. Lấy Chi Tiết Lần Sử Dụng

**Endpoint**: `GET /nha-luoi/:nhaLuoiId/lan-su-dung/:id`

**Quyền**: `NHA_LUOI:XEM`

**Headers**:
```
Authorization: Bearer <token>
```

**Response Success** (200):

```json
{
  "id": 1,
  "nha_luoi_id": 3,
  "de_cuong_thi_nghiem_id": 5,
  "dung_cu": "Khay ươm, nhíp",
  "so_luong": 20,
  "ngay_muon": "2024-01-15T00:00:00.000Z",
  "ngay_tra": "2024-02-15T00:00:00.000Z",
  "khau_hao": 0,
  "hien_trang": "Tốt",
  "ten_file": "file_1234567890.pdf",
  "nguoi_cap_nhat_id": 10,
  "ngay_tao": "2024-01-10T10:30:00.000Z",
  "ngay_cap_nhat": "2024-01-10T10:30:00.000Z",
  "nhaLuoi": {
    "id": 3,
    "ten_nha_luoi": "Nhà lưới 1",
    "khu": "Khu A"
  },
  "deCuongThiNghiem": {
    "id": 5,
    "ten_thi_nghiem": "Thí nghiệm nhân giống lúa",
    "nguoi_thuc_hien": "Nguyễn Văn A",
    "ngay_bat_dau": "2024-01-01T00:00:00.000Z",
    "ngay_ket_thuc": "2024-12-31T00:00:00.000Z",
    "deTai": {
      "id": 2,
      "ten_de_tai": "Chọn tạo giống lúa chịu hạn",
      "cap_quan_ly_de_tai": "Cấp Viện"
    }
  },
  "nguoi_cap_nhat": {
    "id": 10,
    "ho_ten": "Admin User"
  },
  "file_lan_su_dung": {
    "id": 44,
    "ten_goc": "bien_ban.pdf",
    "url_xem": "https://s3.amazonaws.com/bucket/...?signature=..."
  }
}
```

**Lỗi**:
```json
// 404 - Không tìm thấy
{
  "statusCode": 404,
  "message": "Không tìm thấy lần sử dụng với ID 999",
  "error": "Not Found"
}
```

---

### 4. Cập Nhật Lần Sử Dụng

**Endpoint**: `PATCH /nha-luoi/:nhaLuoiId/lan-su-dung/:id`

**Quyền**: `NHA_LUOI:THAO_TAC`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** (form-data):

```typescript
{
  de_cuong_thi_nghiem_id?: number;    // Tùy chọn
  dung_cu?: string;                   // Tùy chọn
  so_luong?: number;                  // Tùy chọn
  ngay_muon?: string;                 // ISO date, tùy chọn
  ngay_tra?: string;                  // ISO date, tùy chọn
  khau_hao?: number;                  // Tùy chọn
  hien_trang?: string;                // Tùy chọn
  file?: File;                        // Tùy chọn (thay file mới)
  xoa_file?: 'true' | 'false';        // Tùy chọn (xóa file hiện tại)
}
```

**Ví Dụ Request 1** - Cập nhật thông tin và thay file mới:

```javascript
const formData = new FormData();
formData.append('hien_trang', 'Đã trả, bình tưới bị rò');
formData.append('ngay_tra', '2024-02-20');
formData.append('khau_hao', '10');
formData.append('file', newFileInput.files[0]);  // File mới thay thế

fetch('/nha-luoi/3/lan-su-dung/1', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

**Ví Dụ Request 2** - Xóa file (không upload file mới):

```javascript
const formData = new FormData();
formData.append('xoa_file', 'true');

fetch('/nha-luoi/3/lan-su-dung/1', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

**Response Success** (200):

```json
{
  "id": 1,
  "nha_luoi_id": 3,
  "de_cuong_thi_nghiem_id": 5,
  "dung_cu": "Khay ươm, nhíp",
  "so_luong": 20,
  "ngay_muon": "2024-01-15T00:00:00.000Z",
  "ngay_tra": "2024-02-20T00:00:00.000Z",
  "khau_hao": 10,
  "hien_trang": "Đã trả, bình tưới bị rò",
  "ten_file": "file_1234567899.pdf",
  "nguoi_cap_nhat_id": 10,
  "ngay_tao": "2024-01-10T10:30:00.000Z",
  "ngay_cap_nhat": "2024-02-20T14:00:00.000Z",
  "nhaLuoi": {
    "id": 3,
    "ten_nha_luoi": "Nhà lưới 1",
    "khu": "Khu A"
  },
  "deCuongThiNghiem": {
    "id": 5,
    "ten_thi_nghiem": "Thí nghiệm nhân giống lúa",
    "nguoi_thuc_hien": "Nguyễn Văn A",
    "ngay_bat_dau": "2024-01-01T00:00:00.000Z",
    "ngay_ket_thuc": "2024-12-31T00:00:00.000Z",
    "deTai": {
      "id": 2,
      "ten_de_tai": "Chọn tạo giống lúa chịu hạn",
      "cap_quan_ly_de_tai": "Cấp Viện"
    }
  },
  "nguoi_cap_nhat": {
    "id": 10,
    "ho_ten": "Admin User"
  }
}
```

**Lưu Ý**:
- `xoa_file=true` và `file` cùng có: File mới được upload, file cũ bị xóa
- `xoa_file=true` và không có `file`: File cũ bị xóa, `ten_file` = null
- Chỉ có `file`: File mới thay thế file cũ (xóa file cũ tự động)

**Lỗi**:
```json
// 404
{
  "statusCode": 404,
  "message": "Không tìm thấy lần sử dụng với ID 999",
  "error": "Not Found"
}
```

---

### 5. Xóa Lần Sử Dụng

**Endpoint**: `DELETE /nha-luoi/:nhaLuoiId/lan-su-dung/:id`

**Quyền**: `NHA_LUOI:THAO_TAC`

**Headers**:
```
Authorization: Bearer <token>
```

**Response Success** (200):

```json
{
  "message": "Xóa lần sử dụng thành công"
}
```

**Lưu Ý**:
- Tự động xóa file liên quan trên S3 và bảng `file_he_thong`
- Không thể khôi phục sau khi xóa

**Lỗi**:
```json
// 404
{
  "statusCode": 404,
  "message": "Không tìm thấy lần sử dụng với ID 999",
  "error": "Not Found"
}
```

---

## Lưu Ý Đặc Biệt

### 1. Query Phức Tạp

API này thực hiện query JOIN 3 bảng:

```sql
SELECT 
  lan_su_dung.*,
  nha_luoi.ten_nha_luoi,
  de_cuong_thi_nghiem.ten_thi_nghiem,
  de_cuong_thi_nghiem.nguoi_thuc_hien,
  de_tai.ten_de_tai,
  de_tai.cap_quan_ly_de_tai
FROM lan_su_dung
LEFT JOIN nha_luoi ON lan_su_dung.nha_luoi_id = nha_luoi.id
LEFT JOIN de_cuong_thi_nghiem ON lan_su_dung.de_cuong_thi_nghiem_id = de_cuong_thi_nghiem.id
LEFT JOIN de_tai ON de_cuong_thi_nghiem.de_tai_id = de_tai.id
WHERE lan_su_dung.nha_luoi_id = :nhaLuoiId
ORDER BY lan_su_dung.ngay_tao DESC;
```

### 2. File Handling Logic

```
┌─────────────────────────────────────────────────┐
│         File Lifecycle Flow                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  POST /lan-su-dung                              │
│      ↓ (có file)                                │
│  [Upload file → S3 + DB]                        │
│      ↓                                           │
│  Response: ten_file = "file_xxx.pdf"            │
│                                                 │
│  PATCH /lan-su-dung/:id                         │
│      ↓ (xoa_file=true)                          │
│  [Xóa file cũ khỏi S3 + DB]                     │
│      ↓ (có file mới)                            │
│  [Upload file mới → S3 + DB]                    │
│      ↓                                           │
│  Response: ten_file = "file_yyy.pdf" hoặc null  │
│                                                 │
│  DELETE /lan-su-dung/:id                        │
│      ↓                                           │
│  [Xóa file khỏi S3 + DB] → [Xóa bản ghi]        │
│      ↓                                           │
│  Response: success message                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3. URL Presigned TTL

- `url_xem` có thời gian sống 1 giờ
- Frontend nên refresh URL khi hết hạn (call lại GET detail/list)

### 4. Nested Route Convention

❌ **Sai**:
```
GET /lan-su-dung?nha_luoi_id=3
POST /lan-su-dung
```

✅ **Đúng**:
```
GET /nha-luoi/3/lan-su-dung
POST /nha-luoi/3/lan-su-dung
```

### 5. Permissions

| Action  | Permission Required    |
|---------|------------------------|
| GET     | `NHA_LUOI:XEM`         |
| POST    | `NHA_LUOI:THAO_TAC`    |
| PATCH   | `NHA_LUOI:THAO_TAC`    |
| DELETE  | `NHA_LUOI:THAO_TAC`    |

---

## Migration SQL

```sql
CREATE TABLE `lan_su_dung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nha_luoi_id` int NOT NULL,
  `de_cuong_thi_nghiem_id` int NOT NULL,
  `dung_cu` varchar(500) DEFAULT NULL,
  `so_luong` int DEFAULT NULL,
  `ngay_muon` date DEFAULT NULL,
  `ngay_tra` date DEFAULT NULL,
  `khau_hao` int DEFAULT NULL,
  `hien_trang` text DEFAULT NULL,
  `ten_file` varchar(255) DEFAULT NULL,
  `nguoi_cap_nhat_id` int NOT NULL,
  `ngay_tao` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ngay_cap_nhat` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_lan_su_dung_nha_luoi` (`nha_luoi_id`),
  KEY `FK_lan_su_dung_de_cuong` (`de_cuong_thi_nghiem_id`),
  KEY `FK_lan_su_dung_nguoi_dung` (`nguoi_cap_nhat_id`),
  CONSTRAINT `FK_lan_su_dung_nha_luoi` 
    FOREIGN KEY (`nha_luoi_id`) REFERENCES `nha_luoi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_lan_su_dung_de_cuong` 
    FOREIGN KEY (`de_cuong_thi_nghiem_id`) REFERENCES `de_cuong_thi_nghiem` (`id`),
  CONSTRAINT `FK_lan_su_dung_nguoi_dung` 
    FOREIGN KEY (`nguoi_cap_nhat_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Testing với cURL

```bash
# 1. Tạo với file
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "de_cuong_thi_nghiem_id=5" \
  -F "dung_cu=Khay ươm" \
  -F "so_luong=20" \
  -F "ngay_muon=2024-01-15" \
  -F "file=@/path/to/file.pdf" \
  http://localhost:3000/nha-luoi/3/lan-su-dung

# 2. Lấy danh sách
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/nha-luoi/3/lan-su-dung

# 3. Cập nhật và xóa file
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "xoa_file=true" \
  -F "hien_trang=Đã trả" \
  http://localhost:3000/nha-luoi/3/lan-su-dung/1

# 4. Xóa
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/nha-luoi/3/lan-su-dung/1
```

---

## Postman Collection

Xem file: `postman/Lan_Su_Dung.postman_collection.json`

---

Hoàn thành! 🎉
