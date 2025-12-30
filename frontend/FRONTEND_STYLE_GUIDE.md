# Frontend Development Style Guide

## 📋 Mục Đích

File này định nghĩa các quy tắc và best practices khi phát triển frontend React cho dự án Vien Lua Dashboard.

**⚠️ File này được cập nhật liên tục - luôn kiểm tra phiên bản mới nhất**

---

## 🎯 Tổng Quan Dự Án

### Công Nghệ

- **Framework:** React 18 + TypeScript
- **UI Library:** Ant Design (antd)
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Build Tool:** Vite

### Loại Ứng Dụng

Dashboard nội bộ với các chức năng:

- CRUD (Create, Read, Update, Delete)
- Tìm kiếm và lọc dữ liệu
- Phân trang
- Quản lý quyền và vai trò
- Xử lý form phức tạp

---

## 📁 Quy Tắc Đặt Tên

### 1. Folder và Component

- **PascalCase, tiếng Việt không dấu**
- Ví dụ: `DangNhap/`, `NguoiDung/`, `QuanLyVaiTro/`

### 2. Files

- **PascalCase.tsx** cho components
- **camelCase.ts** cho utilities, hooks, services
- Ví dụ:
  - `DangNhap.tsx` (component)
  - `authApi.ts` (service)
  - `usePagination.ts` (hook)
  - `formatDate.ts` (utility)

### 3. Interfaces/Types

- **PascalCase, tiếng Việt không dấu**
- Prefix `I` cho interface (optional)
- Ví dụ: `NguoiDung`, `VaiTro`, `ApiResponse`, `PaginationParams`

### 4. Props Type

- Tên component + `Props`
- Ví dụ: `DangNhapProps`, `TableNguoiDungProps`

### 5. Variables/Functions

- **camelCase, tiếng Việt không dấu**
- Ví dụ: `handleDangNhap()`, `danhSachNguoiDung`, `isLoading`

### 6. Constants

- **UPPER_SNAKE_CASE**
- Ví dụ: `API_BASE_URL`, `DEFAULT_PAGE_SIZE`, `TOKEN_KEY`

**Bảng tổng hợp:**
| Loại | Format | Ví dụ |
|------|--------|-------|
| Component/Folder | PascalCase | `DangNhap`, `NguoiDung` |
| Component File | PascalCase.tsx | `DangNhap.tsx` |
| Service/Hook File | camelCase.ts | `authApi.ts` |
| Interface/Type | PascalCase | `NguoiDung`, `ApiResponse` |
| Props Type | Component + Props | `DangNhapProps` |
| Variable/Function | camelCase | `handleSubmit`, `danhSach` |
| Constant | UPPER_SNAKE | `API_BASE_URL` |

---

## 💬 Quy Tắc Comment và Logging

### 1. Comment Tiếng Việt

- **Mọi component, function, logic phức tạp phải có comment tiếng Việt**
- Comment ngắn gọn, súc tích, dễ hiểu
- Giải thích "tại sao" chứ không chỉ "cái gì"

**Ví dụ:**

```typescript
/**
 * Component đăng nhập
 * Xử lý xác thực người dùng và lưu token
 */
const DangNhap: React.FC = () => {
  // Gọi API đăng nhập và lưu token vào Redux store
  const handleDangNhap = async (values: LoginFormValues) => {
    // Implementation
  };
};
```

### 2. Console.log và Error Messages

- **Luôn dùng tiếng Việt**
- Rõ ràng, dễ debug

**Ví dụ:**

```typescript
console.log("Đang gọi API lấy danh sách người dùng...");
console.error("Lỗi khi đăng nhập:", error);
throw new Error("Không thể kết nối đến server");
```

---

## 🏗️ Cấu Trúc Component

### 1. Cấu Trúc File Component Chuẩn

```typescript
import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useAppDispatch } from "@/hooks/useRedux";

// ===== INTERFACES =====
interface DangNhapProps {
  onSuccess?: () => void;
}

interface LoginFormValues {
  tai_khoan: string;
  mat_khau: string;
}

// ===== COMPONENT =====
/**
 * Component đăng nhập
 */
const DangNhap: React.FC<DangNhapProps> = ({ onSuccess }) => {
  // --- State ---
  const [isLoading, setIsLoading] = useState(false);

  // --- Hooks ---
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // --- Effects ---
  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập
  }, []);

  // --- Handlers ---
  const handleSubmit = async (values: LoginFormValues) => {
    // Xử lý đăng nhập
  };

  // --- Render ---
  return (
    <div className="dang-nhap-container">
      <Form form={form} onFinish={handleSubmit}>
        {/* Form fields */}
      </Form>
    </div>
  );
};

export default DangNhap;
```

### 2. Thứ Tự Trong Component

1. **Imports** (React → Third-party → Local)
2. **Interfaces/Types** (Props, Form values, etc.)
3. **Component Definition**
   - State declarations
   - Hooks (useDispatch, useSelector, custom hooks)
   - useEffect
   - Event handlers
   - Helper functions
   - Render logic
4. **Export**

### 3. Quy Tắc Component

- Mỗi component 1 file
- Component nhỏ gọn, tập trung vào 1 nhiệm vụ
- Tách logic phức tạp ra custom hooks
- Sử dụng React.memo() cho component render nhiều lần
- Dùng React.FC<Props> type cho function component

---

## 🔧 Code Đồng Bộ Giữa Các Module

### 1. CRUD Pages

Mỗi module CRUD phải có cấu trúc tương tự:

```
pages/NguoiDung/
├── index.tsx              # List/Table page
├── ThemMoi.tsx            # Create page
├── ChiTiet.tsx            # Detail page
├── ChinhSua.tsx           # Edit page
├── components/
│   ├── FormNguoiDung.tsx  # Reusable form
│   ├── FilterBar.tsx      # Search & filter
│   └── TableColumns.tsx   # Table column config
└── types.ts               # Local types
```

### 2. Cấu Trúc Page List Chuẩn

```typescript
const DanhSachNguoiDung: React.FC = () => {
  // State
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await nguoiDungApi.getAll({ ...pagination, ...filters });
      setDataSource(response.data);
      setPagination({ ...pagination, total: response.meta.total });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, filters]);

  // Handlers
  const handleTableChange = (newPagination, newFilters, sorter) => {
    setPagination(newPagination);
  };

  const handleSearch = (values) => {
    setFilters(values);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = async (id) => {
    // Handle delete with confirmation
  };

  // Render
  return (
    <div>
      <FilterBar onSearch={handleSearch} />
      <Table
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};
```

### 3. Consistency Rules

- Tất cả list page phải có: search, filter, pagination, sort
- Tất cả form phải có validation với antd Form
- Tất cả API call phải có loading state
- Tất cả error phải được handle và hiển thị message
- Tất cả success action phải có notification

---

## 🌐 API Handling

### 1. API Call Pattern

```typescript
// Service file: src/services/api/nguoiDungApi.ts
import { getData, postData, updateData, deleteData } from "./coreApi";

export const nguoiDungApi = {
  // Lấy danh sách với phân trang
  getAll: (params: PaginationParams) =>
    getData<PaginatedResponse<NguoiDung>>(API_URL.NGUOI_DUNG.LIST, params),

  // Lấy chi tiết
  getById: (id: number) =>
    getData<NguoiDung>(`${API_URL.NGUOI_DUNG.DETAIL}/${id}`),

  // Tạo mới
  create: (data: CreateNguoiDungDto) =>
    postData<NguoiDung>(API_URL.NGUOI_DUNG.CREATE, data),

  // Cập nhật
  update: (id: number, data: UpdateNguoiDungDto) =>
    updateData<NguoiDung>(`${API_URL.NGUOI_DUNG.UPDATE}/${id}`, data),

  // Xóa
  delete: (id: number) => deleteData(`${API_URL.NGUOI_DUNG.DELETE}/${id}`),
};
```

### 2. Error Handling

```typescript
try {
  const response = await nguoiDungApi.create(data);
  message.success(MESSAGES.SUCCESS.CREATE);
} catch (error: any) {
  const errorMessage = error.response?.data?.message || MESSAGES.ERROR.CREATE;
  message.error(errorMessage);
  console.error("Lỗi khi tạo người dùng:", error);
}
```

### 3. Loading States

- Luôn có loading state cho API calls
- Disable form/button khi đang submit
- Hiển thị skeleton/spinner khi đang load data

---

## 🎨 Styling Guidelines

### 1. CSS Modules (Recommended)

- Sử dụng CSS Modules để tránh conflict
- File name: `ComponentName.module.css`

```typescript
import styles from "./DangNhap.module.css";

<div className={styles.container}>
  <div className={styles.formWrapper}>{/* Content */}</div>
</div>;
```

### 2. Inline Styles

- Chỉ dùng cho dynamic styles
- Không hardcode values, dùng constants/theme

### 3. Ant Design Theme

- Override theme trong `App.tsx` hoặc `main.tsx`
- Sử dụng ConfigProvider

---

## 🔐 Authentication & Authorization

### 1. Protected Routes

```typescript
// Component PrivateRoute
const PrivateRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, permissions } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" />;
  }

  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return <Navigate to="/khong-co-quyen" />;
  }

  return children;
};
```

### 2. Token Management

- Lưu token trong Redux store và localStorage
- Tự động refresh token khi hết hạn
- Clear token khi logout hoặc 401 error

---

## ✅ Validation & Form Handling

### 1. Ant Design Form

```typescript
const rules = {
  tai_khoan: [
    { required: true, message: "Vui lòng nhập tài khoản" },
    { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự" },
  ],
  mat_khau: [
    { required: true, message: "Vui lòng nhập mật khẩu" },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
  ],
};

<Form.Item name="tai_khoan" rules={rules.tai_khoan}>
  <Input placeholder="Nhập tài khoản" />
</Form.Item>;
```

### 2. Custom Validation

- Tạo custom validators trong `utils/validators.ts`
- Reuse validators giữa các form

---

## 🧪 Best Practices

### 1. Performance

- Sử dụng React.memo() cho pure components
- Sử dụng useMemo() cho expensive calculations
- Sử dụng useCallback() cho event handlers
- Lazy load routes và components lớn
- Debounce search inputs

### 2. Accessibility

- Sử dụng semantic HTML
- Thêm aria labels khi cần
- Keyboard navigation support

### 3. Error Boundaries

- Wrap app trong Error Boundary
- Hiển thị fallback UI khi có error

### 4. Code Splitting

```typescript
const DanhSachNguoiDung = lazy(() => import("@/pages/NguoiDung"));
```

### 5. Environment Variables

- Sử dụng `.env` files
- Access với `import.meta.env.VITE_*`
- Không commit `.env.local`

---

## 📦 File Organization

```
src/
├── components/        # Shared components
├── pages/            # Page components
├── layouts/          # Layout components
├── services/         # API services
│   ├── api/
│   └── config/
├── stores/           # Redux slices
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── constants/        # Constants & configs
├── interfaces/       # TypeScript interfaces
├── styles/           # Global styles
├── assets/           # Static assets
└── types/            # Global types
```

---

## 📝 Checklist Trước Khi Commit

- [ ] Code có comment tiếng Việt đầy đủ
- [ ] Tên file/folder tuân theo quy tắc
- [ ] Component có proper TypeScript types
- [ ] API calls có error handling
- [ ] Form có validation đầy đủ
- [ ] Loading states được xử lý
- [ ] Console.log/error bằng tiếng Việt
- [ ] Không có hardcoded strings (dùng constants)
- [ ] Không có unused imports/variables
- [ ] Code format với Prettier
- [ ] Không có TypeScript errors
- [ ] Test trên browser (UI/UX hoạt động tốt)

---

## 🔄 Git Commit Guidelines

### Commit Message Format

```
<type>: <subject>
```

### Types

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `style`: Cập nhật UI/styling
- `refactor`: Cải thiện code
- `docs`: Cập nhật documentation

### Examples

```bash
feat: thêm trang quản lý người dùng với CRUD đầy đủ
fix: sửa lỗi phân trang không hoạt động khi search
style: cập nhật giao diện form đăng nhập
```

---

## 📚 Resources

- [React Docs](https://react.dev)
- [Ant Design](https://ant.design)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TypeScript](https://www.typescriptlang.org)

---

**🔄 File này được cập nhật liên tục - Lần cập nhật cuối: 2025-01-28**
