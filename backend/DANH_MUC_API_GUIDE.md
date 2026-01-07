# Hướng Dẫn Test API Danh Mục

## 📋 Tổng Quan

Module Danh Mục cung cấp các dropdown options (select options) dùng chung trong hệ thống. Danh mục được định nghĩa cố định trong file `danh-muc.constant.ts`, **không lưu trong database**.

**Đặc điểm:**

- Không cần authentication
- Chỉ có 1 API đơn giản
- Thêm danh mục mới = thêm vào file constant

---

## 🔍 API Endpoint

### Lấy Danh Mục Theo Mã

**Endpoint:** `GET /api/danh-muc/:ma`

**Mô tả:** Lấy thông tin 1 danh mục cụ thể theo mã

**Request:**

```http
GET http://localhost:3000/api/danh-muc/DON_VI_PHE_DUYET
```

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "ma_danh_muc": "DON_VI_PHE_DUYET",
    "ten_danh_muc": "Đơn vị phê duyệt",
    "danh_sach_gia_tri": [
      "Bộ Nông nghiệp & MT",
      "Bộ NN & PTNT",
      "Bộ KH&CN",
      "Khác"
    ]
  }
}
```

**Response khi không tìm thấy:**

```json
{
  "success": false,
  "message": "Không tìm thấy danh mục với mã KHONG_TON_TAI"
}
```

---

## 📝 Cách Thêm Danh Mục Mới

### Bước 1: Mở file constant

File: `backend/src/shared/constants/danh-muc.constant.ts`

### Bước 2: Thêm vào array DANH_SACH_DANH_MUC

```typescript
export const DANH_SACH_DANH_MUC: DanhMucInfo[] = [
  // ... các danh mục hiện có

  // Thêm danh mục mới
  {
    ma_danh_muc: "TINH_TRANG_DE_TAI",
    ten_danh_muc: "Tình trạng đề tài",
    danh_sach_gia_tri: [
      "Mới đăng ký",
      "Đang nghiên cứu",
      "Tạm dừng",
      "Hoàn thành",
      "Đã nghiệm thu",
    ],
  },
];
```

### Bước 3: Restart server

```bash
cd backend
npm run start:dev
```

### Bước 4: Test API

```http
GET http://localhost:3000/api/danh-muc/TINH_TRANG_DE_TAI
```

---

## 🎨 Danh Sách Danh Mục Hiện Có

| Mã Danh Mục           | Tên                 | Số lượng options |
| --------------------- | ------------------- | ---------------- |
| `DON_VI_PHE_DUYET`    | Đơn vị phê duyệt    | 4                |
| `LINH_VUC_KHOA_HOC`   | Lĩnh vực khoa học   | 6                |
| `LOAI_HOP_DONG`       | Loại hợp đồng       | 5                |
| `TRANG_THAI_HOP_DONG` | Trạng thái hợp đồng | 6                |

---

## ✅ Checklist Test

- [ ] Test lấy danh mục (mã hợp lệ)
- [ ] Test lấy danh mục (mã không tồn tại)
- [ ] Thêm danh mục mới vào constant và test

---

**Cập nhật:** 07/01/2026  
**Version:** 2.0 - Simplified
