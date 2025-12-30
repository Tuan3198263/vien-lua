# Hướng dẫn đồng bộ API giữa Frontend và Backend

## 1. Tổng quan

Tài liệu này mô tả cách gọi API giữa Frontend (React) và Backend (NestJS), đảm bảo tính nhất quán về cấu trúc request/response, cách đặt tên và xử lý lỗi.

## 2. Cấu trúc API Backend

### 2.1. Base URL

```
Backend: http://localhost:3000/api
Frontend: Cấu hình trong src/config/api.config.ts
```

### 2.2. API Endpoints Pattern

| Module            | Endpoint            | Method | Mô tả                         |
| ----------------- | ------------------- | ------ | ----------------------------- |
| **CRUD Standard** |
| GET               | `/api/[module]`     | GET    | Lấy danh sách (có phân trang) |
| GET               | `/api/[module]/:id` | GET    | Lấy chi tiết theo ID          |
| POST              | `/api/[module]`     | POST   | Tạo mới                       |
| PATCH             | `/api/[module]/:id` | PATCH  | Cập nhật                      |
| DELETE            | `/api/[module]/:id` | DELETE | Xóa một bản ghi               |
| DELETE            | `/api/[module]`     | DELETE | Xóa nhiều bản ghi             |

### 2.3. Request Structure

#### Pagination Query Params

```typescript
interface PaginationDto {
  page?: number; // Trang hiện tại (mặc định: 1)
  limit?: number; // Số bản ghi/trang (mặc định: 10)
  sort_field?: string; // Trường sắp xếp
  sort_order?: "ASC" | "DESC"; // Thứ tự sắp xếp
  search?: string; // Từ khóa tìm kiếm
}
```

**Ví dụ:**

```
GET /api/nguoi-dung?page=1&limit=10&sort_field=ngay_tao&sort_order=DESC&search=admin
```

#### Create/Update Request Body

```typescript
// Body phải khớp với DTO ở backend
{
  "tai_khoan": "user01",
  "mat_khau": "123456",
  "ho_ten": "Nguyễn Văn A",
  "email": "user01@example.com",
  "sdt": "0912345678",
  "ngay_sinh": "1990-01-01",
  "gioi_tinh": "Nam",
  "dia_chi": "Hà Nội",
  "ghi_chu": "",
  "vai_tro_id": 2
}
```

#### Delete Multiple Request Body

```typescript
{
  "ids": [1, 2, 3]
}
```

### 2.4. Response Structure

#### Success Response

```typescript
// Single item
{
  "id": 1,
  "tai_khoan": "admin",
  "ho_ten": "Administrator",
  ...
}

// Paginated list
{
  "data": [...],           // Mảng dữ liệu
  "total": 100,            // Tổng số bản ghi
  "page": 1,               // Trang hiện tại
  "limit": 10,             // Số bản ghi/trang
  "totalPages": 10         // Tổng số trang
}
```

#### Error Response

```typescript
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## 3. Cấu trúc Frontend API Service

### 3.1. File coreApi.ts (Generic functions)

```typescript
// src/services/api/coreApi.ts
export const getData = <T>(url: string): Promise<T>
export const getPaginatedData = <T>(url: string, params?: PaginationParams): Promise<PaginatedResponse<T>>
export const postData = <T>(url: string, data: any): Promise<T>
export const updateData = <T>(url: string, data: any): Promise<T>
export const deleteData = (url: string): Promise<void>
```

### 3.2. Module API Service Pattern

```typescript
// src/services/api/[module]Api.ts
import { [Module], PaginationParams, PaginatedResponse } from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, postData, updateData, deleteData, getPaginatedData } from './coreApi';

export const [module]Api = {
  getAll: (params?: PaginationParams) =>
    getPaginatedData<[Module]>(API_URL.[MODULE], params),

  getById: (id: number) =>
    getData<[Module]>(`${API_URL.[MODULE]}/${id}`),

  create: (data: [Module]) =>
    postData<[Module]>(API_URL.[MODULE], data),

  update: (id: number, data: Partial<[Module]>) =>
    updateData<[Module]>(`${API_URL.[MODULE]}/${id}`, data),

  delete: (id: number) =>
    deleteData(`${API_URL.[MODULE]}/${id}`),

  deleteMultiple: (ids: number[]) =>
    deleteData(API_URL.[MODULE], { ids }),
};
```

## 4. Ví dụ cụ thể

### 4.1. Module Người Dùng

#### Backend Controller

```typescript
// backend/src/modules/NguoiDung/nguoi-dung.controller.ts
@Controller('nguoi-dung')
export class NguoiDungController {
  @Post()
  async create(@Body() dto: CreateNguoiDungDto) { ... }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) { ... }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) { ... }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateNguoiDungDto) { ... }

  @Delete(':id')
  async remove(@Param('id') id: number) { ... }

  @Delete()
  async removeMultiple(@Body('ids') ids: number[]) { ... }
}
```

#### Frontend API Service

```typescript
// frontend/src/services/api/nguoiDungApi.ts
export const nguoiDungApi = {
  getAll: (params?: PaginationParams) =>
    getPaginatedData<NguoiDung>(API_URL.NGUOI_DUNG, params),

  getById: (id: number) => getData<NguoiDung>(`${API_URL.NGUOI_DUNG}/${id}`),

  create: (data: NguoiDung) => postData<NguoiDung>(API_URL.NGUOI_DUNG, data),

  update: (id: number, data: Partial<NguoiDung>) =>
    updateData<NguoiDung>(`${API_URL.NGUOI_DUNG}/${id}`, data),

  delete: (id: number) => deleteData(`${API_URL.NGUOI_DUNG}/${id}`),

  deleteMultiple: (ids: number[]) => postData(API_URL.NGUOI_DUNG, { ids }),
};
```

### 4.2. Module Vai Trò

#### Backend Controller

```typescript
// backend/src/modules/VaiTro/vai-tro.controller.ts
@Controller('vai-tro')
export class VaiTroController {
  @Post()
  @RequirePermission('VAI_TRO', HanhDong.THEM)
  async create(@Body() dto: CreateVaiTroDto) { ... }

  @Get()
  @Public() // Cho phép truy cập không cần đăng nhập
  async findAll(@Query() paginationDto: PaginationDto) { ... }

  @Get(':id')
  @RequirePermission('VAI_TRO', HanhDong.XEM_CHI_TIET)
  async findOne(@Param('id') id: number) { ... }

  @Patch(':id')
  @RequirePermission('VAI_TRO', HanhDong.SUA)
  async update(@Param('id') id: number, @Body() dto: UpdateVaiTroDto) { ... }

  @Delete(':id')
  @RequirePermission('VAI_TRO', HanhDong.XOA)
  async remove(@Param('id') id: number) { ... }
}
```

#### Frontend API Service

```typescript
// frontend/src/services/api/vaiTroApi.ts
export const vaiTroApi = {
  getAll: (params?: PaginationParams) =>
    getPaginatedData<VaiTro>(API_URL.VAI_TRO, params),

  getById: (id: number) => getData<VaiTro>(`${API_URL.VAI_TRO}/${id}`),

  create: (data: VaiTro) => postData<VaiTro>(API_URL.VAI_TRO, data),

  update: (id: number, data: Partial<VaiTro>) =>
    updateData<VaiTro>(`${API_URL.VAI_TRO}/${id}`, data),

  delete: (id: number) => deleteData(`${API_URL.VAI_TRO}/${id}`),

  deleteMultiple: (ids: number[]) => postData(API_URL.VAI_TRO, { ids }),
};
```

## 5. Quy tắc đồng bộ

### 5.1. Đặt tên

- **Backend:** `nguoi-dung`, `vai-tro` (kebab-case)
- **Frontend API URL:** `NGUOI_DUNG`, `VAI_TRO` (UPPER_CASE)
- **Frontend Interface:** `NguoiDung`, `VaiTro` (PascalCase)
- **Frontend Service:** `nguoiDungApi`, `vaiTroApi` (camelCase)

### 5.2. Field names

- Luôn sử dụng snake_case: `tai_khoan`, `ho_ten`, `vai_tro_id`
- **KHÔNG** dùng `id_vai_tro`, dùng `vai_tro_id`
- **KHÔNG** dùng `so_dien_thoai`, dùng `sdt`

### 5.3. Data Types

- **Date:** Backend trả về ISO string `"2024-01-01T12:00:00.000Z"`, frontend dùng `dayjs()` để format
- **Enum:** Backend trả về string value, frontend định nghĩa enum tương ứng
- **Foreign Key:** Khi populate: `{ vai_tro: { id: 1, ten_vai_tro: "Admin" } }`

### 5.4. Interface Frontend

```typescript
// ĐÚNG: Dùng unified interface
export interface NguoiDung {
  id?: number;
  tai_khoan: string;
  mat_khau?: string;
  email: string;
  ho_ten: string;
  sdt?: string;
  ngay_sinh?: string;
  gioi_tinh?: GioiTinh;
  dia_chi?: string;
  ghi_chu?: string;
  vai_tro_id: number;
  vai_tro?: VaiTro;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

// SAI: Không tạo CreateDto, UpdateDto riêng ở frontend
```

## 6. Xử lý lỗi

### 6.1. Backend Errors

```typescript
// NestJS tự động format error
{
  "statusCode": 400,
  "message": ["Tài khoản không được để trống"],
  "error": "Bad Request"
}
```

### 6.2. Frontend Error Handling

```typescript
// Trong component
try {
  await nguoiDungApi.create(data);
  notifySuccess("Thêm thành công");
} catch (error: any) {
  const message = error.response?.data?.message || error.message;
  notifyError("Thêm thất bại", message);
}
```

## 7. Authentication & Authorization

### 7.1. JWT Token

- Backend trả về token sau khi login
- Frontend lưu trong localStorage/sessionStorage
- Gửi kèm trong header: `Authorization: Bearer {token}`

### 7.2. Permissions

- Backend check qua `@RequirePermission` decorator
- Frontend check qua Redux store (user permissions)
- Ẩn/hiện button dựa trên permissions

## 8. Checklist khi thêm module mới

- [ ] Backend: Tạo entity với đúng field names (snake_case)
- [ ] Backend: Tạo DTO với validation đầy đủ
- [ ] Backend: Tạo controller với đầy đủ CRUD endpoints
- [ ] Backend: Thêm permissions (nếu cần)
- [ ] Frontend: Cập nhật `entities.interface.ts`
- [ ] Frontend: Cập nhật `api.config.ts` (thêm API_URL)
- [ ] Frontend: Tạo `[module]Api.ts` theo pattern chuẩn
- [ ] Frontend: Kiểm tra field names khớp với backend
- [ ] Frontend: Test tất cả API calls

## 9. Debug Tips

### 9.1. Network Tab

- Kiểm tra request URL, method, headers, body
- Kiểm tra response status, data structure

### 9.2. Backend Logs

- Check validation errors
- Check database queries
- Check permission errors

### 9.3. Common Issues

| Vấn đề                    | Nguyên nhân                   | Giải pháp                                 |
| ------------------------- | ----------------------------- | ----------------------------------------- |
| 404 Not Found             | Sai endpoint URL              | Kiểm tra `api.config.ts` và backend route |
| 400 Bad Request           | Validation failed             | Kiểm tra DTO và data gửi lên              |
| 401 Unauthorized          | Chưa login hoặc token hết hạn | Login lại                                 |
| 403 Forbidden             | Không có quyền                | Kiểm tra permissions                      |
| 500 Internal Server Error | Lỗi server                    | Check backend logs                        |

---

**Lưu ý:** Tài liệu này cần được cập nhật khi có thay đổi về cấu trúc API hoặc conventions.
