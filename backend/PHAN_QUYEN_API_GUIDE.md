# Hướng Dẫn Test API - Hệ Thống Phân Quyền (Đơn Giản Hóa)

## 📋 Tổng Quan

Hệ thống phân quyền được **đơn giản hóa** - không cần quản lý module qua database, chỉ cần gán quyền trực tiếp khi tạo/sửa vai trò.

### 🎯 Điểm Khác Biệt So Với Phiên Bản Cũ

**Phiên bản cũ (phức tạp):**

- ❌ Phải tạo module trong database (ModuleHeThong entity)
- ❌ Phải gọi API riêng để gán quyền (POST /api/phan-quyen/gan-quyen)
- ❌ 2 bước: tạo vai trò → gán quyền

**Phiên bản mới (đơn giản):**

- ✅ Module được định nghĩa cố định trong file constants
- ✅ Gán quyền trực tiếp khi tạo/sửa vai trò
- ✅ 1 bước: tạo vai trò + gán quyền cùng lúc

---

## 🏗️ Kiến Trúc Mới

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│  NguoiDung  │─────▶│     VaiTro       │◀─────│ PhanQuyen   │
│  (User)     │      │     (Role)       │      │ (Permission)│
└─────────────┘      └──────────────────┘      └─────────────┘
                              │                        │
                              └────────────┬───────────┘
                                           │
                                    ┌──────▼──────────┐
                                    │ modules.constant│
                                    │   (File cố định)│
                                    └─────────────────┘
```

### Danh Sách Module Cố Định

**Để thêm module mới:** Chỉ cần thêm 1 dòng vào file `backend/src/shared/constants/modules.constant.ts`!

---

## 🔄 Luồng Hoạt Động

1. Frontend lấy danh sách module: `GET /api/phan-quyen/modules`
2. Hiển thị checkbox grid
3. Tạo vai trò + gán quyền: `POST /api/vai-tro` (1 request duy nhất)
4. Kiểm tra quyền khi gọi API: JwtAuthGuard → PermissionGuard

---

## 📍 Base URL

```
http://localhost:3001/api
```

---

## 📚 API Endpoints

### 1️⃣ Lấy Danh Sách Module

```http
GET /api/phan-quyen/modules
```

**Auth:** Public

**Response:**

```json
[
  {
    "ma_module": "VAI_TRO",
    "ten_module": "Quản lý vai trò",
    "icon": "users"
  },
  {
    "ma_module": "NGUOI_DUNG",
    "ten_module": "Quản lý người dùng",
    "icon": "user"
  }
]
```

---

### 2️⃣ Tạo Vai Trò + Gán Quyền (1 bước)

```http
POST /api/vai-tro
Authorization: Bearer <token>
Content-Type: application/json

{
  "ma_vai_tro": "ADMIN",
  "ten_vai_tro": "Quản trị viên",
  "mo_ta": "Quyền cao nhất",
  "permissions": [
    {
      "ma_module": "VAI_TRO",
      "hanh_dong": ["xem", "xem_chi_tiet", "them", "sua", "xoa"]
    },
    {
      "ma_module": "NGUOI_DUNG",
      "hanh_dong": ["xem", "xem_chi_tiet", "them", "sua", "xoa"]
    }
  ]
}
```

**Response:** Vai trò + danh sách quyền

---

### 3️⃣ Cập Nhật Vai Trò + Quyền

```http
PATCH /api/vai-tro/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "ten_vai_tro": "Quản trị viên cấp cao",
  "permissions": [
    {
      "ma_module": "VAI_TRO",
      "hanh_dong": ["xem", "them", "sua"]
    }
  ]
}
```

**Lưu ý:** Nếu có `permissions`, sẽ xóa hết quyền cũ và tạo quyền mới

---

### 4️⃣ Xem Quyền Của Vai Trò

```http
GET /api/phan-quyen/vai-tro/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "vai_tro_id": 1,
  "ten_vai_tro": "Quản trị viên",
  "quyen": [
    {
      "ma_module": "VAI_TRO",
      "ten_module": "Quản lý vai trò",
      "hanh_dong": ["xem", "them", "sua", "xoa"]
    }
  ]
}
```

---

### 5️⃣ Các API Vai Trò Khác

- `GET /api/vai-tro` - Danh sách vai trò (public)
- `GET /api/vai-tro/:id` - Chi tiết vai trò
- `DELETE /api/vai-tro/:id` - Xóa vai trò
- `DELETE /api/vai-tro` - Xóa nhiều vai trò

---

## 🔄 Frontend Workflow

### Tạo Vai Trò

```javascript
// 1. Load danh sách module
const modules = await fetch("/api/phan-quyen/modules").then((r) => r.json());

// 2. Hiển thị checkbox grid
// User chọn quyền...

// 3. Submit (1 request duy nhất)
await fetch("/api/vai-tro", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    ma_vai_tro: "MANAGER",
    ten_vai_tro: "Quản lý",
    permissions: selectedPermissions,
  }),
});
```

### Sửa Vai Trò

```javascript
// 1. Load thông tin + quyền
const vaiTro = await fetch(`/api/vai-tro/${id}`).then((r) => r.json());
const quyen = await fetch(`/api/phan-quyen/vai-tro/${id}`).then((r) =>
  r.json()
);

// 2. Pre-fill form và checkbox

// 3. Submit cập nhật
await fetch(`/api/vai-tro/${id}`, {
  method: "PATCH",
  body: JSON.stringify({
    ten_vai_tro: "Quản lý cấp cao",
    permissions: newPermissions,
  }),
});
```

---

## 📝 Tóm Tắt Thay Đổi

| Tính năng      | Cũ              | Mới                     |
| -------------- | --------------- | ----------------------- |
| Quản lý module | Entity trong DB | File constants          |
| Gán quyền      | API riêng       | Gán khi tạo/sửa vai trò |
| Số bước        | 3 bước          | 1 bước                  |
| Thêm module    | POST API        | Sửa file                |

---

## ✅ Checklist Triển Khai

- [ ] Frontend gọi `/api/phan-quyen/modules`
- [ ] Hiển thị checkbox grid
- [ ] Tạo vai trò + gán quyền (1 request)
- [ ] Pre-fill checkbox khi sửa
- [ ] Test permission guard

---

**Chúc thành công! 🎉**
