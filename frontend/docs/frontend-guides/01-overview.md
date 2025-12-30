# Frontend Development - Tổng Quan

## 📋 Công Nghệ

- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** Ant Design 5
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios

**⚠️ Quy tắc quan trọng:** Ưu tiên sử dụng các tính năng/component có sẵn của Ant Design. Chỉ tự xây dựng khi Ant Design không hỗ trợ.

---

## 🎯 Quy Tắc Đặt Tên

| Loại              | Format           | Ví dụ                       |
| ----------------- | ---------------- | --------------------------- |
| Component/Folder  | PascalCase       | `DangNhap`, `NguoiDung`     |
| File component    | PascalCase.tsx   | `DangNhap.tsx`              |
| Service/Hook/Util | camelCase.ts     | `authApi.ts`, `useAuth.ts`  |
| Interface/Type    | PascalCase       | `NguoiDung`, `LoginDto`     |
| Variable/Function | camelCase        | `handleSubmit`, `isLoading` |
| Constant          | UPPER_SNAKE_CASE | `API_BASE_URL`, `ROUTES`    |

**Lưu ý:** Dùng tiếng Việt không dấu cho tên file/folder/biến.

---

## 📁 Cấu Trúc Thư Mục

```
src/
├── assets/           # Hình ảnh, fonts
├── components/       # Shared components
├── pages/            # Page components
├── layouts/          # Layout components
├── router/           # Router configuration
├── services/         # API services
│   ├── api/
│   └── axios.ts
├── stores/           # Redux slices
├── hooks/            # Custom hooks
├── utils/            # Utility functions (notification, etc.)
├── validators/       # Form validation rules
├── constants/        # Constants (routes, messages)
├── interfaces/       # TypeScript interfaces
└── styles/           # Global styles
```

---

**Cập nhật:** 2025-12-30
