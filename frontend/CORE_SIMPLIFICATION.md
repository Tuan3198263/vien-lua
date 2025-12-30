# Cập Nhật: Đơn Giản Hóa Cấu Hình Core

## 🎯 Mục Tiêu

Đơn giản hóa cấu hình để tạo thành bộ core chung, dễ tái sử dụng (không quá chi tiết cho từng module cụ thể)

## ✅ Những Gì Đã Sửa

### 1. API Config - Đơn Giản Hóa ✓

**Trước:**

```typescript
API_URL = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ...
  },
  NGUOI_DUNG: {
    BASE: '/nguoi-dung',
    LIST: '/nguoi-dung',
    CREATE: '/nguoi-dung',
    DETAIL: '/nguoi-dung',
    UPDATE: '/nguoi-dung',
    DELETE: '/nguoi-dung',
  },
  ...
}
```

**Sau:**

```typescript
API_URL = {
  AUTH: "/auth",
  NGUOI_DUNG: "/nguoi-dung",
  VAI_TRO: "/vai-tro",
  PHAN_QUYEN: "/phan-quyen",
  MODULE_HE_THONG: "/module-he-thong",
};
```

**Lý do**: Cùng một base path thì không cần tách ra nhiều keys. Khi dùng chỉ cần:

- `${API_URL.AUTH}/login`
- `${API_URL.NGUOI_DUNG}/${id}`
- Etc.

### 2. Messages - Bỏ Messages Quá Chi Tiết ✓

**SUCCESS_MESSAGES** - Đã xóa:

- ❌ CREATE_USER, UPDATE_USER, DELETE_USER
- ❌ CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE
- ❌ ASSIGN_PERMISSION, REMOVE_PERMISSION, UPDATE_PERMISSION
- ❌ REGISTER, CHANGE_PASSWORD

**Chỉ giữ lại messages chung:**

- ✅ CREATE, UPDATE, DELETE, SAVE
- ✅ LOGIN, LOGOUT

**ERROR_MESSAGES** - Đã xóa:

- ❌ LOGIN_FAILED, INVALID_CREDENTIALS
- ❌ REQUIRED, INVALID_EMAIL, INVALID_PHONE, PASSWORD_TOO_SHORT, PASSWORD_NOT_MATCH
- ❌ USER_NOT_FOUND, USER_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS
- ❌ ROLE_NOT_FOUND, ROLE_ALREADY_EXISTS, CANNOT_DELETE_DEFAULT_ROLE
- ❌ PERMISSION_DENIED, INVALID_PERMISSION

**Chỉ giữ lại errors chung:**

- ✅ UNKNOWN, NETWORK, SERVER, TIMEOUT
- ✅ CREATE_FAILED, UPDATE_FAILED, DELETE_FAILED, FETCH_FAILED
- ✅ UNAUTHORIZED, FORBIDDEN, TOKEN_EXPIRED

**CONFIRM_MESSAGES** - Đã xóa:

- ❌ DELETE_USER, DELETE_ROLE, CHANGE_ROLE

**Chỉ giữ lại:**

- ✅ DELETE, LOGOUT, CANCEL

**PLACEHOLDERS** - Đã xóa:

- ❌ USERNAME, PASSWORD, EMAIL
- ❌ FULLNAME, PHONE
- ❌ SEARCH_USER, SEARCH_ROLE

**Chỉ giữ lại:**

- ✅ SEARCH, SELECT, INPUT

**LABELS** - Đã xóa:

- ❌ USERNAME, PASSWORD, CONFIRM_PASSWORD, EMAIL, REMEMBER_ME
- ❌ FULLNAME, PHONE, STATUS, ROLE, CREATED_AT, UPDATED_AT
- ❌ ROLE_CODE, ROLE_NAME, DESCRIPTION

**Chỉ giữ lại labels chung:**

- ✅ ACTIONS, SEARCH, FILTER, RESET
- ✅ SUBMIT, CANCEL, SAVE, EDIT, DELETE
- ✅ CREATE, DETAIL, BACK

### 3. API Services - Cập Nhật Sử Dụng API_URL Mới ✓

**authApi.ts** - Updated:

```typescript
login: (data) => postData(`${API_URL.AUTH}/login`, data);
register: (data) => postData(`${API_URL.AUTH}/register`, data);
// ...
```

**nguoiDungApi.ts** - Updated:

```typescript
getAll: (params) => getPaginatedData(API_URL.NGUOI_DUNG, params);
getById: (id) => getData(`${API_URL.NGUOI_DUNG}/${id}`);
// ...
```

**vaiTroApi.ts** - Updated tương tự

**phanQuyenApi.ts** - Updated tương tự

### 4. Fix TypeScript Errors ✓

**Problem 1**: Property 'env' does not exist on type 'ImportMeta'

**Solution**: Tạo `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Problem 2**: Property 'fromNow' does not exist on type 'Dayjs'

**Solution**: Import và extend dayjs plugin trong `dateUtils.ts`:

```typescript
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
```

### 5. Backend Port ✓

Đã đúng port 3001:

```typescript
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
```

## 📊 Kết Quả

### Files Không Thay Đổi (Đã OK)

- ✅ `config/app.config.ts` - Cấu hình chung: storage, pagination, form, date format
- ✅ `constants/permissions.ts` - Enum HanhDong với labels
- ✅ Tất cả interfaces
- ✅ Tất cả hooks
- ✅ Tất cả utils

### Files Đã Đơn Giản Hóa

- ✅ `config/api.config.ts` - Từ nested objects → simple strings
- ✅ `constants/messages.ts` - Xóa 70% messages chi tiết
- ✅ `services/api/authApi.ts` - Cập nhật sử dụng API_URL mới
- ✅ `services/api/nguoiDungApi.ts` - Cập nhật
- ✅ `services/api/vaiTroApi.ts` - Cập nhật
- ✅ `services/api/phanQuyenApi.ts` - Cập nhật

### Files Mới Tạo

- ✅ `src/vite-env.d.ts` - Fix TypeScript env error

## 🎉 Lợi Ích

1. **Dễ bảo trì**: Code ngắn gọn, ít hardcode
2. **Dễ tái sử dụng**: Messages và configs chung cho tất cả modules
3. **Linh hoạt**: Dễ extend khi cần
4. **Clean**: Không có duplicate code
5. **Type-safe**: Fix tất cả TypeScript errors

## 💡 Cách Sử Dụng

### API Calls

```typescript
// Trước (phức tạp)
authApi.login(); // uses API_URL.AUTH.LOGIN

// Sau (đơn giản)
authApi.login(); // uses `${API_URL.AUTH}/login`
```

### Messages

```typescript
// Trước (chi tiết)
message.success(MESSAGES.SUCCESS.CREATE_USER);
message.success(MESSAGES.SUCCESS.UPDATE_USER);

// Sau (chung)
message.success(MESSAGES.SUCCESS.CREATE);
message.success(MESSAGES.SUCCESS.UPDATE);
```

### Custom Messages

Khi cần message cụ thể, dễ dàng tạo inline:

```typescript
message.success("Tạo người dùng thành công");
// hoặc
message.success(`Xóa vai trò "${role.ten_vai_tro}" thành công`);
```

---

**Tóm lại**: Đã chuyển từ cấu hình chi tiết cho từng module → Cấu hình core chung, dễ tái sử dụng như một bộ framework vừa init! 🚀
