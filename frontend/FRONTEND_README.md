# Frontend - Vien Lua Dashboard

Dashboard quản lý nội bộ được xây dựng bằng React + TypeScript + Ant Design.

## 📦 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Ant Design 5** - UI Components
- **Redux Toolkit** - State Management
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Dayjs** - Date Utilities
- **Vite** - Build Tool

## 🚀 Bắt Đầu

### 1. Cài Đặt Dependencies

```bash
npm install
```

### 2. Cấu Hình Environment

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env` theo môi trường của bạn:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### 4. Build Production

```bash
npm run build
```

## 📁 Cấu Trúc Dự Án

```
src/
├── components/          # Shared components
│   ├── common/         # Components dùng chung
│   ├── layout/         # Layout components
│   └── ...
├── pages/              # Page components (routes)
│   ├── DangNhap/
│   ├── NguoiDung/
│   ├── VaiTro/
│   └── ...
├── services/           # API services
│   ├── api/           # API functions
│   │   ├── coreApi.ts      # Core API helpers
│   │   ├── authApi.ts      # Auth endpoints
│   │   ├── nguoiDungApi.ts # User endpoints
│   │   └── ...
│   └── axios.ts       # Axios instance
├── stores/             # Redux slices
│   ├── authSlice.ts
│   └── index.ts       # Store config
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── usePagination.ts
│   ├── useDebounce.ts
│   └── ...
├── utils/              # Utility functions
│   ├── dateUtils.ts
│   ├── formatUtils.ts
│   ├── validators.ts
│   └── helpers.ts
├── interfaces/         # TypeScript interfaces
│   ├── api.interface.ts
│   ├── auth.interface.ts
│   ├── entities.interface.ts
│   └── index.ts
├── constants/          # Constants & configs
│   ├── messages.ts    # Success/Error messages
│   ├── permissions.ts # Permission constants
│   └── index.ts
├── config/             # App configuration
│   ├── api.config.ts  # API URLs
│   └── app.config.ts  # App settings
├── layouts/            # Layout components
├── styles/             # Global styles
├── assets/             # Static assets
└── types/              # Global types
```

## 🎨 Style Guide

Xem chi tiết tại: [FRONTEND_STYLE_GUIDE.md](./FRONTEND_STYLE_GUIDE.md)

### Quy Tắc Đặt Tên

- **Components/Folders**: PascalCase tiếng Việt không dấu (`DangNhap`, `NguoiDung`)
- **Files**: PascalCase.tsx cho components, camelCase.ts cho services/utils
- **Variables/Functions**: camelCase tiếng Việt không dấu
- **Constants**: UPPER_SNAKE_CASE

### Code Quality

- **Comment**: Luôn comment tiếng Việt cho functions/components
- **Console**: Sử dụng tiếng Việt
- **Error Messages**: Sử dụng constants, không hardcode

## 🔐 Authentication Flow

1. User đăng nhập qua `/dang-nhap`
2. API trả về `access_token` và thông tin user
3. Token được lưu vào Redux store và localStorage
4. Axios interceptor tự động thêm token vào headers
5. Protected routes kiểm tra authentication trước khi render

## 🛡️ Permissions

Hệ thống phân quyền dựa trên:

- **Module**: Mỗi module trong hệ thống (NGUOI_DUNG, VAI_TRO...)
- **Action**: Hành động (XEM, THEM, SUA, XOA...)
- **Permission Format**: `MODULE:ACTION` (vd: `NGUOI_DUNG:THEM`)

Sử dụng hook `useAuth()` để kiểm tra quyền:

```typescript
const { hasPermission } = useAuth();

if (hasPermission("NGUOI_DUNG:THEM")) {
  // Show create button
}
```

## 📡 API Integration

### Cấu Hình API URLs

File: `src/config/api.config.ts`

```typescript
export const API_URL = {
  AUTH: {
    LOGIN: "/auth/login",
    // ...
  },
  NGUOI_DUNG: {
    LIST: "/nguoi-dung",
    // ...
  },
};
```

### Sử Dụng API

```typescript
import { nguoiDungApi } from "@/services/api";

// Lấy danh sách
const response = await nguoiDungApi.getAll({ page: 1, page_size: 10 });

// Tạo mới
const newUser = await nguoiDungApi.create(data);

// Cập nhật
await nguoiDungApi.update(id, data);

// Xóa
await nguoiDungApi.delete(id);
```

## 🎣 Custom Hooks

### useAuth()

```typescript
const { user, isAuthenticated, hasPermission } = useAuth();
```

### usePagination()

```typescript
const { pagination, setPagination, goToFirstPage } = usePagination();
```

### useDebounce()

```typescript
const debouncedSearch = useDebounce(searchValue, 500);
```

### useMount()

```typescript
useMount(() => {
  // Chạy một lần khi mount
  fetchData();
});
```

## 🧰 Utilities

### Date Formatting

```typescript
import { formatDate, formatDateTime } from "@/utils";

formatDate("2024-01-01"); // 01/01/2024
formatDateTime("2024-01-01 10:30:00"); // 01/01/2024 10:30:00
```

### Validation

```typescript
import { isValidEmail, isValidPhone } from "@/utils";

if (!isValidEmail(email)) {
  // Show error
}
```

### Formatting

```typescript
import { formatCurrency, formatPhone } from "@/utils";

formatCurrency(1000000); // 1,000,000 VNĐ
formatPhone("0912345678"); // 0912 345 678
```

## 🌐 Routing

Sử dụng React Router v6:

```typescript
// Protected route
<Route
  path="/nguoi-dung"
  element={
    <PrivateRoute>
      <DanhSachNguoiDung />
    </PrivateRoute>
  }
/>

// Public route
<Route path="/dang-nhap" element={<DangNhap />} />
```

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🐛 Debugging

### Redux DevTools

Redux DevTools được enable tự động trong môi trường development.

### API Logs

Tất cả API requests/responses được log ra console trong development mode.

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [Ant Design Documentation](https://ant.design)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [React Router Documentation](https://reactrouter.com)

## ⚠️ Lưu Ý

1. **Style Guide**: Luôn tuân theo [FRONTEND_STYLE_GUIDE.md](./FRONTEND_STYLE_GUIDE.md)
2. **Naming Convention**: Đặt tên tiếng Việt không dấu
3. **Comments**: Comment tiếng Việt ngắn gọn
4. **Constants**: Không hardcode strings, sử dụng constants
5. **Error Handling**: Luôn handle errors và hiển thị message
6. **Loading States**: Luôn có loading state cho API calls

## 🤝 Contributing

1. Đọc kỹ Style Guide
2. Tạo branch mới cho feature/fix
3. Commit theo format chuẩn
4. Test kỹ trước khi commit
5. Tạo Pull Request

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2025-01-28
