# Frontend Development Style Guide

## 📋 Công Nghệ

- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** Ant Design 5
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios

**⚠️ Quy tắc quan trọng:** Ưu tiên sử dụng các tính năng/component có sẵn của Ant Design. Chỉ tự xây dựng khi Ant Design không hỗ trợ.

---

## �️ Ưu Tiên Sử Dụng Ant Design Components

### Nguyên Tắc Cơ Bản

**Ưu tiên sử dụng các component của Ant Design thay vì thẻ HTML và CSS thông thường.**

Chỉ custom CSS khi:

- Không có component Ant Design phù hợp
- Ant Design không đáp ứng được thiết kế đẹp hoặc yêu cầu đặc biệt

### Layout Components - Hạn Chế `div`

**❌ KHÔNG NÊN:**

```tsx
// Tránh dùng div với CSS flexbox thủ công
<div style={{ display: "flex", justifyContent: "space-between" }}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <button>Button</button>
  </div>
  <div>
    <span>Text</span>
  </div>
</div>
```

**✅ NÊN LÀM:**

```tsx
import { Flex, Space, Row, Col } from 'antd';

// Dùng Flex component
<Flex justify="space-between" align="center">
  <Flex align="center">
    <Button>Button</Button>
  </Flex>
  <span>Text</span>
</Flex>

// Dùng Space cho spacing
<Space size="large">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>

// Dùng Row/Col cho grid layout
<Row gutter={[16, 16]}>
  <Col span={12}><Card>Content 1</Card></Col>
  <Col span={12}><Card>Content 2</Card></Col>
</Row>
```

### Các Component Thường Dùng

#### 1. Flex Component

```tsx
import { Flex } from 'antd';

// Horizontal layout (mặc định)
<Flex justify="space-between" align="center" gap="middle">
  <div>Left</div>
  <div>Right</div>
</Flex>

// Vertical layout
<Flex vertical gap="small">
  <div>Top</div>
  <div>Bottom</div>
</Flex>
```

**Props:** `justify`, `align`, `gap` (small|middle|large), `vertical`, `wrap`

#### 2. Space Component

```tsx
import { Space } from 'antd';

<Space size="middle">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>

// Vertical spacing
<Space direction="vertical" size="large" style={{ width: '100%' }}>
  <Input placeholder="Input 1" />
  <Input placeholder="Input 2" />
</Space>
```

**Props:** `size` (8px|16px|24px), `direction`, `align`

#### 3. Row & Col (Grid System - 24 columns)

```tsx
import { Row, Col } from 'antd';

<Row gutter={16}>
  <Col span={12}><div>50% width</div></Col>
  <Col span={12}><div>50% width</div></Col>
</Row>

// Responsive
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card>Responsive</Card>
  </Col>
</Row>
```

**Props:** `gutter`, `justify`, `align` | **Col:** `span`, `offset`, responsive breakpoints

### Khi Nào Cần CSS?

- Custom style cụ thể (màu sắc, border-radius, shadow...)
- Animation và transition
- Pseudo-classes (:hover, :active, :focus...)
- Media queries phức tạp

```tsx
// Flex cho layout + CSS cho styling
<Flex justify="center" align="center" className="custom-container">
  <Card className="custom-card">
    <Flex vertical gap="middle">
      <Title level={3}>Title</Title>
      <Button type="primary">Action</Button>
    </Flex>
  </Card>
</Flex>
```

```css
/* CSS chỉ cho styling, không layout */
.custom-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.custom-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s;
}
```

### Best Practices

✅ **DO:**

- Dùng `Flex` cho layout 1 chiều (horizontal/vertical)
- Dùng `Row/Col` cho grid layout phức tạp
- Dùng `Space` cho khoảng cách giữa elements
- Dùng `gap` prop thay vì margin/padding
- Kết hợp Ant Design components với CSS cho styling

❌ **DON'T:**

- Không dùng `<div style={{ display: 'flex' }}>`
- Không dùng `<div className="row">` với custom CSS
- Không hardcode margin/padding (dùng `gap`)
- Không tạo custom grid khi đã có Row/Col

---

## �🎯 Quy Tắc Đặt Tên

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

## 💻 Cách Viết Component

**Cách viết hiện đại - sử dụng function:**

```typescript
import { useState } from "react";
import { Button, Form } from "antd";

interface DangNhapProps {
  onSuccess?: () => void;
}

/**
 * Component đăng nhập
 */
function DangNhap({ onSuccess }: DangNhapProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    // Logic xử lý
  };

  return <Form onFinish={handleSubmit}>{/* UI */}</Form>;
}

export default DangNhap;
```

**Thứ tự trong component:**

1. Imports
2. Interfaces/Types
3. Component function
4. State & Hooks
5. Handlers
6. Return JSX
7. Export

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

## 🔐 Validation & Form Handling

### 1. Validation Rules

**Tách validation theo module trong `src/validators/`:**

```typescript
// validators/auth.validator.ts
import type { Rule } from "antd/es/form";
import { MESSAGES } from "@/constants/messages";

export const LOGIN_VALIDATOR = {
  tai_khoan: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự" },
    { max: 50, message: "Tài khoản không được quá 50 ký tự" },
    { whitespace: true, message: "Tài khoản không được chỉ chứa khoảng trắng" },
  ] as Rule[],

  mat_khau: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
    { whitespace: true, message: "Mật khẩu không được chỉ chứa khoảng trắng" },
  ] as Rule[],
};
```

### 2. Form Component với Notification

**✅ ĐÚNG - Hiển thị notification cho cả validation error:**

```typescript
import { Form, Input, Button } from "antd";
import { notifyError, notifySuccess } from "@/utils/notification";

function MyForm() {
  const [form] = Form.useForm();

  // Xử lý submit thành công
  const handleSubmit = async (values: any) => {
    try {
      await someApi.create(values);
      notifySuccess("Tạo thành công!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Thao tác thất bại", errorMsg);
    }
  };

  // Xử lý validation thất bại - QUAN TRỌNG
  const handleSubmitFailed = (errorInfo: any) => {
    console.log("Validation thất bại:", errorInfo);

    // Lấy lỗi đầu tiên để hiển thị
    const firstError = errorInfo.errorFields[0];
    if (firstError && firstError.errors.length > 0) {
      notifyError("Lỗi nhập liệu", firstError.errors[0]);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={handleSubmitFailed} // Bắt buộc
    >
      <Form.Item name="field" rules={MY_VALIDATOR.field}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
```

**❌ SAI - Không xử lý validation error:**

```typescript
// Thiếu onFinishFailed
<Form onFinish={handleSubmit}>
  <Form.Item name="field" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>
```

### 3. Validation Rules Thường Dùng

```typescript
// Required
{ required: true, message: 'Trường này là bắt buộc' }

// Min/Max length
{ min: 3, message: 'Phải có ít nhất 3 ký tự' }
{ max: 50, message: 'Không được quá 50 ký tự' }

// Email
{ type: 'email' as const, message: 'Email không hợp lệ' }

// Pattern (regex)
{ pattern: /^[0-9]+$/, message: 'Chỉ được nhập số' }

// Whitespace
{ whitespace: true, message: 'Không được chỉ chứa khoảng trắng' }

// Custom validator
{
  validator: async (_, value) => {
    if (value && value.length < 6) {
      return Promise.reject('Mật khẩu quá ngắn');
    }
    return Promise.resolve();
  }
}
```

### 4. Quy Tắc Validation

✅ **DO:**

- Luôn thêm `onFinishFailed` handler cho Form
- Hiển thị notification khi validation thất bại
- Thêm console.log để debug validation errors
- Sử dụng message tiếng Việt rõ ràng
- Thêm `whitespace: true` cho các trường text quan trọng
- Mỗi module có file validator riêng trong `validators/`

❌ **DON'T:**

- Không bỏ qua `onFinishFailed` - validation error sẽ không được thông báo
- Không để form submit mà không có validation
- Không hardcode validation message

---

## 🌐 API Handling

```typescript
// services/api/authApi.ts
import axiosInstance from "../axios";

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },
};

// Sử dụng trong component
import { notifySuccess, notifyError } from "@/utils/notification";

try {
  const response = await authApi.login(values);
  notifySuccess("Đăng nhập thành công");
} catch (error: any) {
  const errorMessage = error.response?.data?.message || "Lỗi không xác định";
  notifyError("Đăng nhập thất bại", errorMessage);
}
```

---

## 🔔 Thông Báo (Notification)

**Sử dụng notification helper (đã cấu hình sẵn):**

```typescript
import {
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo,
} from "@/utils/notification";

// Success - thông báo ngắn
notifySuccess("Thao tác thành công");

// Success - có mô tả chi tiết
notifySuccess("Đăng nhập thành công", "Chào mừng bạn quay trở lại");

// Error
notifyError("Đã xảy ra lỗi", "Vui lòng thử lại sau");

// Warning
notifyWarning("Cảnh báo", "Dữ liệu chưa được lưu");

// Info
notifyInfo("Thông tin", "Hệ thống đang bảo trì");
```

**Cấu hình:**

- File: `src/utils/notification.ts`
- Vị trí: `topRight`
- Thời gian hiển thị: 3 giây
- Số lượng tối đa: 3 notification cùng lúc

---

## 🎨 Styling

1. **CSS Modules** (preferred):

```typescript
import styles from "./Component.module.css";
<div className={styles.container} />;
```

2. **Inline styles** (chỉ cho dynamic styles):

```typescript
<div style={{ color: isActive ? "green" : "gray" }} />
```

3. **Ant Design classes**: Sử dụng built-in classes của Ant Design khi có thể

---

## 🛣️ Routing

**File riêng:** `src/router/index.tsx`

```typescript
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.DANG_NHAP} element={<DangNhap />} />
      {/* ... */}
    </Routes>
  );
}
```

---

## 💬 Comments và Messages

- **Comments:** Tiếng Việt, ngắn gọn, giải thích "tại sao"
- **Console.log:** Tiếng Việt
- **User messages:** Tiếng Việt, lưu trong `constants/messages.ts`

```typescript
/**
 * Xử lý đăng nhập
 */
const handleLogin = async (values: LoginDto) => {
  // Gọi API và lưu token
};
```

---

## ✅ Checklist

- [ ] Dùng function (không dùng React.FC)
- [ ] Import chỉ những gì cần
- [ ] Ưu tiên dùng Ant Design components/features
- [ ] Validation dùng Ant Design Form
- [ ] Notification dùng `notifySuccess/Error/Warning/Info`
- [ ] Validators tách riêng theo module
- [ ] Routes định nghĩa trong constants
- [ ] Comments tiếng Việt
- [ ] TypeScript types đầy đủ
- [ ] Error handling cho mọi API call

---

**Cập nhật:** 2025-12-30

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

---

## 🔧 Code Đồng Bộ Giữa Các Module

### 1. CRUD Pages Structure

```
pages/NguoiDung/
├── index.tsx              # List/Table page
├── ThemMoi.tsx            # Create page
├── ChiTiet.tsx            # Detail page
├── ChinhSua.tsx           # Edit page
└── types.ts               # Local types
```

### 2. Consistency Rules

- Tất cả list page phải có: search, filter, pagination, sort
- Tất cả form phải có validation với antd Form
- Tất cả API call phải có loading state
- Tất cả error phải được handle và hiển thị notification
- Tất cả success action phải có notification

---

## 🌐 API Handling

### 1. API Call Pattern

```typescript
// Service file: src/services/api/nguoiDungApi.ts
import { getData, postData, updateData, deleteData } from "./coreApi";

export const nguoiDungApi = {
  getAll: (params: PaginationParams) =>
    getData<PaginatedResponse<NguoiDung>>(API_URL.NGUOI_DUNG.LIST, params),

  getById: (id: number) =>
    getData<NguoiDung>(`${API_URL.NGUOI_DUNG.DETAIL}/${id}`),

  create: (data: CreateNguoiDungDto) =>
    postData<NguoiDung>(API_URL.NGUOI_DUNG.CREATE, data),

  update: (id: number, data: UpdateNguoiDungDto) =>
    updateData<NguoiDung>(`${API_URL.NGUOI_DUNG.UPDATE}/${id}`, data),

  delete: (id: number) => deleteData(`${API_URL.NGUOI_DUNG.DELETE}/${id}`),
};
```

### 2. Error Handling

```typescript
import { notifySuccess, notifyError } from "@/utils/notification";

try {
  await nguoiDungApi.create(data);
  notifySuccess(MESSAGES.SUCCESS.CREATE);
} catch (error: any) {
  const errorMessage = error.response?.data?.message || MESSAGES.ERROR.CREATE;
  notifyError("Thao tác thất bại", errorMessage);
  console.error("Lỗi khi tạo người dùng:", error);
}
```

### 3. Loading States

- Luôn có loading state cho API calls
- Disable form/button khi đang submit
- Hiển thị skeleton/spinner khi đang load data

---

## 🎨 Styling Guidelines

### 1. CSS Files

- File name: `ComponentName.css`
- Sử dụng class names có ý nghĩa
- Dùng BEM hoặc prefix để tránh conflict

```css
/* DangNhap.css */
.dang-nhap-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dang-nhap-form-wrapper {
  width: 100%;
  max-width: 400px;
}
```

### 2. Inline Styles

- Chỉ dùng cho dynamic styles
- Không hardcode values, dùng constants/theme

### 3. Ant Design Theme

- Override theme trong `main.tsx` với ConfigProvider
- Sử dụng token để customize

---

## 🔐 Authentication & Authorization

### 1. Protected Routes

```typescript
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  return children;
};
```

### 2. Token Management

- Lưu token trong Redux store và localStorage
- Clear token khi logout hoặc 401 error
- Tự động gửi token trong headers (xem axiosInstance)

---

## ✅ Validation & Form Handling

### 1. Validator Modules

Tách validators theo module trong `src/validators/`:

```typescript
// src/validators/auth.validator.ts
import { MESSAGES } from "@/constants/messages";

export const LOGIN_VALIDATOR = {
  tai_khoan: [{ required: true, message: MESSAGES.ERROR.REQUIRED }],
  mat_khau: [{ required: true, message: MESSAGES.ERROR.REQUIRED }],
};
```

### 2. Ant Design Form

```typescript
<Form.Item name="tai_khoan" rules={LOGIN_VALIDATOR.tai_khoan}>
  <Input placeholder="Nhập tài khoản" />
</Form.Item>
```

---

## 🧪 Best Practices

### 1. Performance

- Sử dụng React.memo() cho pure components
- Sử dụng useMemo() cho expensive calculations
- Sử dụng useCallback() cho event handlers
- Lazy load routes và components lớn
- Debounce search inputs

### 2. Code Splitting

```typescript
import { lazy } from "react";
const DanhSachNguoiDung = lazy(() => import("@/pages/NguoiDung"));
```

### 3. Environment Variables

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
├── router/           # Routing configuration
├── services/         # API services
├── stores/           # Redux slices
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── validators/       # Form validators
├── constants/        # Constants & configs
├── types/            # TypeScript types
├── styles/           # Global styles
└── assets/           # Static assets
```

---

## 📝 Checklist Trước Khi Commit

- [ ] Code có comment tiếng Việt khi cần
- [ ] Tên file/folder tuân theo quy tắc
- [ ] Component có proper TypeScript types
- [ ] API calls có error handling
- [ ] Form có validation đầy đủ
- [ ] Loading states được xử lý
- [ ] Dùng notification cho user feedback
- [ ] Không có hardcoded strings (dùng constants)
- [ ] Không có unused imports/variables
- [ ] Không có TypeScript errors

---

## 📚 Resources

- [React Docs](https://react.dev)
- [Ant Design](https://ant.design)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TypeScript](https://www.typescriptlang.org)

---

**🔄 File này được cập nhật liên tục - Lần cập nhật cuối: 2025-01-28**
