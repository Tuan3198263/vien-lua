# Authentication Flow - Hướng Dẫn

## 🔐 Luồng Đăng Nhập (Login Flow)

### 1. User nhập thông tin đăng nhập

**File**: `src/pages/DangNhap/index.tsx`

- Form với 2 field: `tai_khoan` và `mat_khau`
- Validation rules mirror từ backend DTOs
- Submit form → gọi `handleSubmit()`

### 2. Gọi API đăng nhập

**File**: `src/services/api/authApi.ts`

```typescript
authApi.login({
  tai_khoan: "admin",
  mat_khau: "123456",
});
```

→ POST `/api/auth/login`

### 3. Backend xử lý

**Backend Flow:**

1. Nhận request tại `AuthController.login()` (base path: `/api/auth`)
2. Validate DTO với class-validator
3. Tìm user trong database
4. So sánh password (bcrypt)
5. Tạo JWT token
6. Trả về response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "tai_khoan": "admin",
    "email": "admin@example.com",
    "ho_ten": "Admin",
    "vai_tro": {
      "id": 1,
      "ma_vai_tro": "ADMIN",
      "ten_vai_tro": "Quản trị viên"
    }
  }
}
```

### 4. Frontend xử lý response

**File**: `src/pages/DangNhap/index.tsx` → `handleSubmit()`

```typescript
// Nhận response từ API
const response = await authApi.login(values);

// Dispatch action lưu vào Redux
dispatch(loginSuccess(response));
```

### 5. Redux Store lưu token & user

**File**: `src/stores/authSlice.ts` → `loginSuccess` reducer

```typescript
loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
  const { access_token, user } = action.payload;

  // Lưu vào Redux state
  state.user = user;
  state.accessToken = access_token;
  state.isAuthenticated = true;

  // Lưu vào localStorage (persist qua sessions)
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("user_info", JSON.stringify(user));
};
```

**Lưu ý:**

- Redux state: In-memory, mất khi refresh
- localStorage: Persist, giữ qua sessions
- Khi app khởi động → đọc từ localStorage → restore Redux state

### 6. Redirect về trang chủ

```typescript
navigate("/");
```

### 7. PrivateRoute kiểm tra authentication

**File**: `src/components/PrivateRoute.tsx`

```typescript
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/dang-nhap" />;
}
```

## 🔑 Token Management

### Axios Interceptor

**File**: `src/services/axios.ts`

**Request Interceptor:**

```typescript
// Tự động thêm token vào headers
const token = localStorage.getItem("access_token");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

**Response Interceptor:**

```typescript
// Xử lý 401 Unauthorized
if (status === 401) {
  // Token expired hoặc invalid
  // Clear token và redirect về login
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");
  window.location.href = "/dang-nhap";
}
```

## 📊 State Flow Diagram

```
User Input
    ↓
Form Submit
    ↓
authApi.login()
    ↓
Backend API (/auth/login)
    ↓
Response { access_token, user }
    ↓
dispatch(loginSuccess())
    ↓
Redux Store ← → localStorage
    ↓
navigate('/')
    ↓
PrivateRoute checks isAuthenticated
    ↓
Render HomePage
```

## 🛡️ Protected API Calls

Khi gọi API khác sau khi đăng nhập:

```typescript
// Ví dụ: Lấy danh sách người dùng
const users = await nguoiDungApi.getAll();

// Axios tự động thêm token vào headers:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Backend nhận được và verify token → cho phép truy cập.

## 🔄 Session Persistence

### Khi user refresh page:

1. **App khởi động** → `main.tsx` render
2. **Redux store init** → `src/stores/authSlice.ts`
3. **Initial state** đọc từ localStorage:

```typescript
const getInitialToken = (): string | null => {
  return localStorage.getItem("access_token");
};

const getInitialUser = (): AuthUser | null => {
  const userStr = localStorage.getItem("user_info");
  return userStr ? JSON.parse(userStr) : null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  accessToken: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  // ...
};
```

4. **PrivateRoute check** → `isAuthenticated = true` → Không redirect
5. User vẫn đăng nhập!

## 🚪 Logout Flow

### Backend API

**Endpoint**: POST `/api/auth/logout`

Backend method (trong `NguoiDungService`):

```typescript
async logout(userId: number): Promise<{ message: string }> {
  // Có thể thêm logic như: blacklist token, log hoạt động, v.v.
  return { message: 'Đăng xuất thành công' };
}
```

### Frontend Flow

```typescript
// 1. Gọi API logout (optional - nếu cần log trên backend)
await authApi.logout();

// 2. Dispatch logout action
dispatch(logout());

// 3. Redux reducer xóa state + localStorage
logout: (state) => {
  state.user = null;
  state.accessToken = null;
  state.isAuthenticated = false;

  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");
};

// 4. Navigate về login
navigate("/dang-nhap");
```

## ✅ Validation Strategy

### Backend (Source of Truth)

- **class-validator** trong DTOs
- Bắt buộc phải có
- Validate trước khi xử lý logic

### Frontend (UX Enhancement)

- **Ant Design Form rules** mirror từ backend
- File: `src/utils/validationRules.ts`
- Validate ngay khi user nhập → feedback tức thì
- Giảm số lượng failed API requests

### Ví dụ Đồng Bộ:

**Backend** - `auth.dto.ts`:

```typescript
@IsNotEmpty({ message: 'Tài khoản không được để trống' })
@IsString({ message: 'Tài khoản phải là chuỗi' })
tai_khoan: string;
```

**Frontend** - `validationRules.ts`:

```typescript
tai_khoan: [
  { required: true, message: "Tài khoản không được để trống" },
  { type: "string", message: "Tài khoản phải là chuỗi" },
];
```

→ **Cùng message, cùng logic!**

## 📝 Files Liên Quan

### Backend

- `backend/src/modules/NguoiDung/auth.controller.ts` - Auth controller (base path: `/api/auth`)
  - POST `/api/auth/register` - Đăng ký
  - POST `/api/auth/login` - Đăng nhập
  - POST `/api/auth/logout` - Đăng xuất
  - GET `/api/auth/profile` - Lấy profile
  - POST `/api/auth/change-password` - Đổi mật khẩu
- `backend/src/modules/NguoiDung/nguoi-dung.controller.ts` - CRUD người dùng (base path: `/api/nguoi-dung`)
- `backend/src/modules/NguoiDung/nguoi-dung.service.ts` - Service xử lý logic
- `backend/src/modules/NguoiDung/dto/auth.dto.ts` - DTOs cho authentication

### Frontend

- `src/pages/DangNhap/index.tsx` - Login page
- `src/services/api/authApi.ts` - Auth API calls
- `src/stores/authSlice.ts` - Auth state management
- `src/components/PrivateRoute.tsx` - Route protection

### Validation

- `backend/src/modules/NguoiDung/dto/auth.dto.ts` - Backend DTOs với class-validator
- `src/utils/validationRules.ts` - Frontend form validation rules (mirror từ backend)

### Interfaces

- `src/interfaces/auth.interface.ts` - Auth types

### Hooks

- `src/hooks/useAuth.ts` - Auth helper hook

### Config

- `src/services/axios.ts` - HTTP client with interceptors
- `src/config/api.config.ts` - API endpoints configuration

## 🧪 Test Đăng Nhập

### Credentials mặc định (tạo ở backend):

```
Tài khoản: admin
Mật khẩu: 123456
```

### Steps:

1. Chạy backend: `npm run start:dev` (port 3001)
2. Chạy frontend: `npm run dev` (port 3000)
3. Mở browser: http://localhost:3000
4. Auto redirect → http://localhost:3000/dang-nhap
5. Nhập credentials
6. Click "Đăng nhập"
7. Success → Redirect về /
8. Check localStorage: có `access_token` và `user_info`
9. Check Redux DevTools: state auth đã có data

---

**Tóm tắt**: Luồng đăng nhập đơn giản, token được lưu cả Redux và localStorage để persist, PrivateRoute bảo vệ routes, axios interceptor tự động thêm token và handle 401! 🎉
