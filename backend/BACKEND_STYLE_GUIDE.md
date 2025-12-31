# Backend Development Style Guide

## 📋 Mục Đích

File này định nghĩa các quy tắc và best practices khi phát triển backend NestJS cho dự án Vien Lua.

---

## 🎯 Nguyên Tắc Chung

### 1. Code Phải Sạch và Có Comment Tiếng Việt

- **Mọi class, method, property đều phải có JSDoc comment tiếng Việt**
- Comment phải mô tả rõ ràng mục đích, tham số và giá trị trả về
- Code phải dễ đọc, dễ hiểu, tránh logic phức tạp không cần thiết

**Ví dụ:**

```typescript
/**
 * Service xử lý logic cho module Người Dùng
 * Quản lý CRUD và authentication
 */
@Injectable()
export class NguoiDungService {
  /**
   * Đăng ký tài khoản mới
   * @param registerDto - Thông tin đăng ký
   * @returns Thông tin người dùng vừa tạo
   */
  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    // Implementation
  }
}
```

---

### 2. Code Phải Đồng Bộ Hệ Thống

#### 2.1. Cấu Trúc Module

Mỗi module phải tuân theo cấu trúc chuẩn:

```
modules/TenModule/
├── ten-module.entity.ts          # Entity với TypeORM
├── ten-module.controller.ts      # REST API endpoints
├── ten-module.service.ts         # Business logic
├── ten-module.module.ts          # Module configuration
└── dto/
    └── ten-module.dto.ts         # DTOs cho validation
```

#### 2.2. Đồng Bộ Cách Viết Giữa Các Module

- **Entity:** Luôn có `ngay_tao` và `ngay_cap_nhat` với `@CreateDateColumn` và `@UpdateDateColumn`
- **Service:** Luôn có các method chuẩn: `create`, `findAll`, `findOne`, `update`, `remove`
- **Controller:** Luôn có `@UseGuards(JwtAuthGuard)` và validation
- **DTOs:** Phân chia rõ ràng: `CreateDto`, `UpdateDto`, các DTO khác

**Ví dụ Entity:**

```typescript
@Entity("ten_bang")
export class TenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ... các fields khác ...

  @CreateDateColumn({ type: "datetime" })
  ngay_tao: Date;

  @UpdateDateColumn({ type: "datetime" })
  ngay_cap_nhat: Date;
}
```

---

### 3. Quy Tắc Đặt Tên Tiếng Việt

#### 3.1. Folder và Module

- **PascalCase, không dấu**
- Ví dụ: `VaiTro`, `NguoiDung`, `ModuleHeThong`, `PhanQuyen`

#### 3.2. Files

- **kebab-case, không dấu**
- Ví dụ: `nguoi-dung.entity.ts`, `vai-tro.service.ts`, `phan-quyen.controller.ts`

#### 3.3. Database Tables

- **snake_case, không dấu**
- Ví dụ: `nguoi_dung`, `vai_tro`, `module_he_thong`, `phan_quyen`

#### 3.4. Fields/Properties

- **snake_case, không dấu**
- Ví dụ: `tai_khoan`, `mat_khau`, `ho_ten`, `ngay_tao`, `ma_vai_tro`

#### 3.5. Class/Interface Names

- **PascalCase, không dấu**
- Ví dụ: `NguoiDung`, `VaiTro`, `CreateNguoiDungDto`, `PhanQuyenService`

#### 3.6. Method Names

- **camelCase, tiếng Việt không dấu**
- Ví dụ: `dangNhap()`, `ganQuyen()`, `layQuyenCuaVaiTro()`, `kiemTraQuyen()`

**Bảng tổng hợp:**
| Loại | Format | Ví dụ |
|------|--------|-------|
| Module/Folder | PascalCase | `NguoiDung`, `VaiTro` |
| File | kebab-case | `nguoi-dung.entity.ts` |
| Table | snake_case | `nguoi_dung` |
| Field/Property | snake_case | `tai_khoan`, `ngay_tao` |
| Class/Interface | PascalCase | `NguoiDungService` |
| Method | camelCase | `dangNhap()` |
| Enum | PascalCase | `HanhDong`, `GioiTinh` |
| Enum Value | UPPER_SNAKE | `XEM_CHI_TIET` |

---

### 4. Validation và Error Handling

#### 4.1. Validation

- Sử dụng `class-validator` cho tất cả DTOs
- Validation message phải bằng tiếng Việt
- Luôn set `@ValidationPipe` trong controller

**Ví dụ:**

```typescript
export class CreateNguoiDungDto {
  @IsNotEmpty({ message: "Tài khoản không được để trống" })
  @IsString({ message: "Tài khoản phải là chuỗi" })
  @MinLength(3, { message: "Tài khoản phải có ít nhất 3 ký tự" })
  tai_khoan: string;
}
```

#### 4.2. Error Handling

- Sử dụng các Exception có sẵn của NestJS
- Throw exception với message tiếng Việt
- Không dùng generic error message

**Ví dụ:**

```typescript
if (!user) {
  throw new NotFoundException("Không tìm thấy người dùng");
}

if (existingUser) {
  throw new ConflictException("Tài khoản đã tồn tại");
}
```

---

### 5. API Design Standards

#### 5.1. Route Naming

- Base path: kebab-case tiếng Việt không dấu
- Ví dụ: `/api/nguoi-dung`, `/api/vai-tro`, `/api/phan-quyen`

#### 5.2. HTTP Methods

- `GET`: Lấy dữ liệu (danh sách hoặc chi tiết)
- `POST`: Tạo mới
- `PATCH`: Cập nhật một phần
- `PUT`: Cập nhật toàn bộ (ít dùng)
- `DELETE`: Xóa

#### 5.3. HTTP Status Codes

- `200 OK`: Thành công (GET, PATCH, DELETE)
- `201 Created`: Tạo mới thành công (POST)
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Chưa đăng nhập
- `403 Forbidden`: Không có quyền
- `404 Not Found`: Không tìm thấy resource
- `409 Conflict`: Dữ liệu bị trùng lặp

#### 5.4. Response Format

- **Luôn wrap response với format `{ success: true, data: ... }`**
- Có phân trang: `{ data: [], meta: { current_page, per_page, total, total_pages, has_previous, has_next } }`
- Chi tiết/Tạo mới/Cập nhật: `{ success: true, data: {...} }`
- Xóa: `{ success: true, data: { message: 'Xóa thành công' } }`

**Ví dụ:**

```typescript
// Controller
@Get(':id')
async findOne(@Param('id') id: number) {
  const data = await this.service.findOne(id);
  return {
    success: true,
    data,
  };
}
```

---

### 6. Security Best Practices

#### 6.1. Authentication & Authorization

- Luôn dùng `@UseGuards(JwtAuthGuard, PermissionGuard)` cho protected routes
- Dùng `@Public()` cho public routes (login, register, modules list)
- Dùng `@RequirePermission(module, action)` để chỉ định quyền cần thiết

**Ví dụ:**

```typescript
@Controller("nguoi-dung")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NguoiDungController {
  @Post()
  @RequirePermission("NGUOI_DUNG", HanhDong.THAO_TAC)
  async create(@Body() dto: CreateNguoiDungDto) {
    // ...
  }

  @Get()
  @RequirePermission("NGUOI_DUNG", HanhDong.XEM)
  async findAll() {
    // ...
  }
}
```

#### 6.2. Password Security

- Luôn hash password với `bcrypt`
- Không bao giờ trả về password trong response
- Dùng `select: false` cho password field trong entity

#### 6.3. Input Validation

- Validate tất cả input từ client
- Sanitize input để tránh XSS, SQL Injection
- Sử dụng `whitelist: true` trong ValidationPipe

#### 6.4. API Documentation

- **Luôn tạo file .md hướng dẫn test API cho mỗi tính năng mới**
- **Cập nhật file hướng dẫn khi có fix lỗi liên quan đến API (thay đổi cách gọi, request/response format)**
- File hướng dẫn phải bao gồm:
  - Mô tả tính năng và luồng hoạt động
  - Danh sách endpoints với method, path, auth requirement
  - Request examples (body, params, query)
  - Response examples (success và error cases)
  - Thứ tự gọi API đúng (nếu có workflow)
  - Lưu ý đặc biệt (permissions, validation rules...)
- Đặt tên file: `TEN_TINH_NANG_API_GUIDE.md` hoặc `TEN_MODULE_API_GUIDE.md`
- Đặt trong folder `backend/` hoặc `backend/docs/api/`

**Ví dụ:** `PHAN_QUYEN_API_GUIDE.md`, `AUTH_API_GUIDE.md`

---

### 7. Database Best Practices

#### 7.1. Entity Design

- Mỗi entity phải có primary key `id`
- Luôn có `ngay_tao` và `ngay_cap_nhat`
- **Luôn có cột `nguoi_cap_nhat_id` (foreign key tới bảng nguoi_dung) để ghi nhận người thực hiện cập nhật cuối cùng**
- Đặt unique constraint cho các field cần thiết
- Đặt index cho các field thường xuyên query
- **Luôn ràng buộc `length` cho các trường varchar:**
  - Tài khoản, mã: 50 ký tự
  - Tên, tiêu đề: 100 ký tự
  - Email: 100 ký tự
  - Số điện thoại: 20 ký tự
  - Địa chỉ, ghi chú, mô tả: 255 ký tự
  - Mật khẩu hash: 255 ký tự
  - **Mặc định: 255 ký tự cho các trường varchar khác**
- **Validation cho cột số:**
  - Luôn đặt giới hạn tối đa (VD: `unsigned: true` hoặc `@Max(2147483647)`)
  - Không cho phép giá trị âm nếu không cần thiết (`@Min(0)`)
  - Dùng `int` cho số nguyên, `decimal` cho số thập phân

**Ví dụ:**

```typescript
@Entity("ten_bang")
export class TenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255, // Mặc định cho varchar
  })
  ten_truong: string;

  @Column({
    type: "int",
    unsigned: true, // Không cho phép âm
    default: 0,
  })
  so_luong: number;

  @ManyToOne(() => NguoiDung, { nullable: true })
  @JoinColumn({ name: "nguoi_cap_nhat_id" })
  nguoi_cap_nhat: NguoiDung;

  @Column({ nullable: true })
  nguoi_cap_nhat_id: number;

  @CreateDateColumn({ type: "datetime" })
  ngay_tao: Date;

  @UpdateDateColumn({ type: "datetime" })
  ngay_cap_nhat: Date;
}
```

**Lưu ý:** Module Vai Trò và Người Dùng đã triển khai trước khi có rules này, các module sau phải tuân theo đầy đủ.

#### 7.2. Relations

- Sử dụng `@ManyToOne`, `@OneToMany`, `@ManyToMany` phù hợp
- Đặt `eager: true` cho relations thường xuyên load
- Dùng `cascade` cẩn thận, tránh xóa nhầm data

#### 7.3. Transactions

- Sử dụng transaction cho operations phức tạp
- Rollback khi có lỗi

---

### 8. Utilities và Helpers

#### 8.1. Pagination

- Luôn sử dụng `QueryUtils` để xử lý pagination
- Trả về metadata đầy đủ: `total`, `total_pages`, `has_next`, `has_previous`

#### 8.2. Constants

- Đưa các giá trị cố định vào `shared/constants/`
- Dùng enum cho các giá trị có giới hạn

---

### 9. Testing

#### 9.1. Unit Tests

- Viết test cho các service methods
- Coverage tối thiểu 70%

#### 9.2. E2E Tests

- Test các API endpoints quan trọng
- Test các flows chính của hệ thống

---

### 10. Documentation

#### 10.1. Code Documentation

- Mọi public method phải có JSDoc
- Comment tiếng Việt dễ hiểu
- Giải thích các logic phức tạp

#### 10.2. API Documentation

- Tạo file hướng dẫn test API (Postman)
- Cập nhật khi có API mới
- Ghi rõ request/response examples

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>
```

### Types

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật documentation
- `style`: Format code (không ảnh hưởng logic)
- `refactor`: Cải thiện code
- `test`: Thêm/sửa tests
- `chore`: Các task khác (build, dependencies...)

### Subject

- Viết bằng tiếng Việt
- Không quá 72 ký tự
- Không kết thúc bằng dấu chấm

### Examples

```bash
feat: thêm module phân quyền với guard và decorator

- Tạo entity ModuleHeThong và PhanQuyen
- Tạo PermissionGuard để kiểm tra quyền
- Tạo @RequirePermission decorator
- Tích hợp vào module VaiTro và NguoiDung
```

```bash
fix: sửa lỗi không thể đăng ký khi chưa có vai trò USER

- Tự động tạo vai trò USER nếu chưa tồn tại
- Thêm validation cho email format
```

---

## 🔄 Workflow Phát Triển Tính Năng Mới

### Bước 1: Tạo Entity

1. Tạo file `ten-module.entity.ts`
2. Định nghĩa fields với đầy đủ decorators
3. Thêm `ngay_tao` và `ngay_cap_nhat`
4. Thêm relations nếu cần

### Bước 2: Tạo DTOs

1. Tạo folder `dto/`
2. Tạo `CreateDto` với validation đầy đủ
3. Tạo `UpdateDto` (tất cả fields optional)
4. Tạo các DTO khác nếu cần

### Bước 3: Tạo Service

1. Inject repository
2. Implement các method chuẩn
3. Thêm business logic
4. Handle errors properly

### Bước 4: Tạo Controller

1. Apply guards (`JwtAuthGuard`, `PermissionGuard`)
2. Define routes với HTTP methods phù hợp
3. Apply decorators (`@Public()`, `@RequirePermission()`)
4. Validate input với `ValidationPipe`

### Bước 5: Tạo Module

1. Import TypeOrmModule với entity
2. Import các module dependencies
3. Export service nếu cần

### Bước 6: Register Module

1. Import vào `app.module.ts`
2. Thêm entity vào `database.config.ts`

### Bước 7: Testing

1. Test API với Postman
2. Viết unit tests
3. Cập nhật documentation

### Bước 8: Commit

1. Xem hướng dẫn trong `GIT_COMMIT_GUIDE.md`
2. Commit theo từng tính năng
3. Viết commit message rõ ràng

---

## ✅ Checklist Trước Khi Commit

- [ ] Code có comment tiếng Việt đầy đủ
- [ ] Tên file/folder tuân theo quy tắc
- [ ] Entity có `ngay_tao` và `ngay_cap_nhat`
- [ ] DTOs có validation đầy đủ
- [ ] Controller có guards và decorators
- [ ] Service có error handling
- [ ] Không có lỗi TypeScript
- [ ] Không có hardcoded values
- [ ] API đã test trên Postman
- [ ] Documentation đã cập nhật

---

## 🎓 Learning Resources

### NestJS Official Docs

- https://docs.nestjs.com

### TypeORM Docs

- https://typeorm.io

### Best Practices

- Clean Code principles
- SOLID principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

---

**Lưu ý:** File này sẽ được cập nhật thường xuyên. Mọi developer đều phải tuân theo các quy tắc trong file này.
