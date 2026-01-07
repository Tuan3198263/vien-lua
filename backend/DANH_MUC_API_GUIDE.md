# Hướng Dẫn Test API Danh Mục

## 📋 Tổng Quan

Module Danh Mục cung cấp các dropdown options (select options) dùng chung trong hệ thống. Danh mục được định nghĩa cố định trong file `danh-muc.constant.ts`, **không lưu trong database**.

**Đặc điểm:**

- Không cần authentication
- Không có CRUD (chỉ đọc)
- Thêm danh mục mới = thêm vào file constant

---

## 🔍 Danh Sách API

### 1. Lấy Tất Cả Danh Mục

**Endpoint:** `GET /api/danh-muc`

**Mô tả:** Lấy toàn bộ danh sách danh mục trong hệ thống

**Request:**

```http
GET http://localhost:3000/api/danh-muc
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "ma_danh_muc": "DON_VI_PHE_DUYET",
      "ten_danh_muc": "Đơn vị phê duyệt",
      "module": null,
      "danh_sach_gia_tri": [
        "Bộ Nông nghiệp & MT",
        "Bộ NN & PTNT",
        "Bộ KH&CN",
        "Khác"
      ]
    },
    {
      "ma_danh_muc": "LINH_VUC_KHOA_HOC",
      "ten_danh_muc": "Lĩnh vực khoa học",
      "module": null,
      "danh_sach_gia_tri": [
        "Tự nhiên",
        "Nông, lâm, ngư nghiệp",
        "Kỹ thuật và công nghệ",
        "Y dược",
        "Khoa học xã hội",
        "Nhân văn"
      ]
    },
    {
      "ma_danh_muc": "LOAI_HOP_DONG",
      "ten_danh_muc": "Loại hợp đồng",
      "module": "HOP_DONG",
      "danh_sach_gia_tri": [
        "Hợp đồng nghiên cứu",
        "Hợp đồng tư vấn",
        "Hợp đồng dịch vụ",
        "Hợp đồng cung cấp",
        "Khác"
      ]
    }
  ]
}
```

---

### 2. Lấy Danh Mục Theo Mã

**Endpoint:** `GET /api/danh-muc/ma/:ma`

**Mô tả:** Lấy thông tin 1 danh mục cụ thể theo mã

**Request:**

```http
GET http://localhost:3000/api/danh-muc/ma/DON_VI_PHE_DUYET
```

**Response:**

```json
{
  "success": true,
  "data": {
    "ma_danh_muc": "DON_VI_PHE_DUYET",
    "ten_danh_muc": "Đơn vị phê duyệt",
    "module": null,
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

### 3. Lấy Nhiều Danh Mục Cùng Lúc

**Endpoint:** `POST /api/danh-muc/lay-nhieu`

**Mô tả:** Lấy nhiều danh mục trong 1 request (tránh gọi nhiều API)

**Request:**

```http
POST http://localhost:3000/api/danh-muc/lay-nhieu
Content-Type: application/json

{
  "ma_danh_muc": ["DON_VI_PHE_DUYET", "LINH_VUC_KHOA_HOC"]
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "ma_danh_muc": "DON_VI_PHE_DUYET",
      "ten_danh_muc": "Đơn vị phê duyệt",
      "module": null,
      "danh_sach_gia_tri": [
        "Bộ Nông nghiệp & MT",
        "Bộ NN & PTNT",
        "Bộ KH&CN",
        "Khác"
      ]
    },
    {
      "ma_danh_muc": "LINH_VUC_KHOA_HOC",
      "ten_danh_muc": "Lĩnh vực khoa học",
      "module": null,
      "danh_sach_gia_tri": [
        "Tự nhiên",
        "Nông, lâm, ngư nghiệp",
        "Kỹ thuật và công nghệ",
        "Y dược",
        "Khoa học xã hội",
        "Nhân văn"
      ]
    }
  ]
}
```

---

### 4. Lấy Danh Mục Theo Module

**Endpoint:** `GET /api/danh-muc/module/:module`

**Mô tả:** Lấy tất cả danh mục của 1 module cụ thể

**Request:**

```http
GET http://localhost:3000/api/danh-muc/module/HOP_DONG
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "ma_danh_muc": "LOAI_HOP_DONG",
      "ten_danh_muc": "Loại hợp đồng",
      "module": "HOP_DONG",
      "danh_sach_gia_tri": [
        "Hợp đồng nghiên cứu",
        "Hợp đồng tư vấn",
        "Hợp đồng dịch vụ",
        "Hợp đồng cung cấp",
        "Khác"
      ]
    },
    {
      "ma_danh_muc": "TRANG_THAI_HOP_DONG",
      "ten_danh_muc": "Trạng thái hợp đồng",
      "module": "HOP_DONG",
      "danh_sach_gia_tri": [
        "Đang soạn thảo",
        "Chờ phê duyệt",
        "Đã ký",
        "Đang thực hiện",
        "Hoàn thành",
        "Đã hủy"
      ]
    }
  ]
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
    module: "DE_TAI", // hoặc null nếu dùng chung
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
GET http://localhost:3000/api/danh-muc/ma/TINH_TRANG_DE_TAI
```

---

## 💡 Use Cases

### Use Case 1: Load options cho 1 select

**Frontend:**

```typescript
// Lấy 1 danh mục
const response = await axios.get('/api/danh-muc/ma/DON_VI_PHE_DUYET');
const options = response.data.data.danh_sach_gia_tri;

// Render select
<Select>
  {options.map(opt => (
    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
  ))}
</Select>
```

### Use Case 2: Load options cho nhiều select trong 1 form

**Frontend:**

```typescript
// Lấy nhiều danh mục cùng lúc
const response = await axios.post("/api/danh-muc/lay-nhieu", {
  ma_danh_muc: ["DON_VI_PHE_DUYET", "LINH_VUC_KHOA_HOC"],
});

const danhMucs = response.data.data;

// Tìm danh mục cần dùng
const donViPheDuyet = danhMucs.find(
  (dm) => dm.ma_danh_muc === "DON_VI_PHE_DUYET"
);
const linhVuc = danhMucs.find((dm) => dm.ma_danh_muc === "LINH_VUC_KHOA_HOC");
```

### Use Case 3: Load tất cả options của 1 module

**Frontend:**

```typescript
// Lấy tất cả danh mục của module HỢP ĐỒNG
const response = await axios.get("/api/danh-muc/module/HOP_DONG");
const danhMucs = response.data.data;

// Cache lại để dùng cho nhiều select
const loaiHopDong = danhMucs.find((dm) => dm.ma_danh_muc === "LOAI_HOP_DONG");
const trangThai = danhMucs.find(
  (dm) => dm.ma_danh_muc === "TRANG_THAI_HOP_DONG"
);
```

---

## 🎨 Danh Sách Danh Mục Hiện Có

### Danh mục dùng chung (module = null)

| Mã Danh Mục         | Tên               | Số lượng options |
| ------------------- | ----------------- | ---------------- |
| `DON_VI_PHE_DUYET`  | Đơn vị phê duyệt  | 4                |
| `LINH_VUC_KHOA_HOC` | Lĩnh vực khoa học | 6                |

### Danh mục module HOP_DONG

| Mã Danh Mục           | Tên                 | Số lượng options |
| --------------------- | ------------------- | ---------------- |
| `LOAI_HOP_DONG`       | Loại hợp đồng       | 5                |
| `TRANG_THAI_HOP_DONG` | Trạng thái hợp đồng | 6                |

---

## ✅ Checklist Test

- [ ] Test lấy tất cả danh mục
- [ ] Test lấy 1 danh mục theo mã (mã hợp lệ)
- [ ] Test lấy 1 danh mục theo mã (mã không tồn tại)
- [ ] Test lấy nhiều danh mục cùng lúc
- [ ] Test lấy danh mục theo module (HOP_DONG)
- [ ] Test lấy danh mục theo module (module không có danh mục)
- [ ] Thêm danh mục mới vào constant và test

---

**Cập nhật:** 07/01/2026  
**Version:** 1.0
