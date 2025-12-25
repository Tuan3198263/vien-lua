# Hướng Dẫn Commit Code

## Tổng Quan

File này hướng dẫn commit code theo từng tính năng/module một cách có tổ chức.

---

## 📋 Danh Sách Các Commit Cần Thực Hiện

### Commit 1: Cài đặt dependencies cho JWT và validation

**Mô tả commit:**

```
feat: cài đặt dependencies cho JWT authentication và validation

- Thêm @nestjs/jwt, @nestjs/passport, passport, passport-jwt
- Thêm bcrypt cho hash password
- Thêm class-validator và class-transformer cho validation
- Thêm TypeScript types cho passport-jwt và bcrypt
```

**Files liên quan:**

- `backend/package.json`
- `backend/package-lock.json`

**Lệnh git:**

```bash
git add backend/package.json backend/package-lock.json
git commit -m "feat: cài đặt dependencies cho JWT authentication và validation"
```

---

### Commit 2: Tạo JWT authentication guards và strategies

**Mô tả commit:**

```
feat: tạo JWT authentication system

- Thêm JwtAuthGuard để bảo vệ các routes
- Thêm JwtStrategy để validate JWT token
- Thêm @Public decorator cho routes không cần authentication
- Thêm @CurrentUser decorator để lấy thông tin user hiện tại
- Guard tự động kiểm tra token trong header Authorization
```

**Files liên quan:**

- `backend/src/common/guards/jwt-auth.guard.ts`
- `backend/src/common/strategies/jwt.strategy.ts`
- `backend/src/common/decorators/public.decorator.ts`
- `backend/src/common/decorators/current-user.decorator.ts`

**Lệnh git:**

```bash
git add backend/src/common/guards/jwt-auth.guard.ts
git add backend/src/common/strategies/jwt.strategy.ts
git add backend/src/common/decorators/public.decorator.ts
git add backend/src/common/decorators/current-user.decorator.ts
git commit -m "feat: tạo JWT authentication system

- Thêm JwtAuthGuard để bảo vệ các routes
- Thêm JwtStrategy để validate JWT token
- Thêm @Public và @CurrentUser decorators"
```

---

### Commit 3: Tạo utilities cho pagination, filtering và sorting

**Mô tả commit:**

```
feat: tạo utilities cho pagination, filtering và sorting

- Thêm PaginationDto với validation (page, limit, sort_field, sort_order, search)
- Thêm QueryUtils với các helper methods:
  - applyPagination: áp dụng skip và take
  - applySorting: sắp xếp theo field
  - applySearch: tìm kiếm với LIKE
  - createPaginatedResult: tạo response với metadata
  - applyQueryOptions: áp dụng tất cả utilities
- Thêm constants chung (GioiTinh enum, error messages, success messages)
- Hỗ trợ tái sử dụng cho tất cả các module
```

**Files liên quan:**

- `backend/src/shared/dto/pagination.dto.ts`
- `backend/src/shared/utils/query.utils.ts`
- `backend/src/shared/constants/app.constants.ts`

**Lệnh git:**

```bash
git add backend/src/shared/dto/pagination.dto.ts
git add backend/src/shared/utils/query.utils.ts
git add backend/src/shared/constants/app.constants.ts
git commit -m "feat: tạo utilities cho pagination, filtering và sorting

- Thêm PaginationDto với validation đầy đủ
- Thêm QueryUtils với các helper methods
- Thêm constants và enums chung
- Hỗ trợ phân trang, tìm kiếm, sắp xếp tái sử dụng"
```

---

### Commit 4: Tạo module Vai Trò (Role Management)

**Mô tả commit:**

```
feat: tạo module Vai Trò với CRUD đầy đủ

Module quản lý vai trò trong hệ thống:
- Entity VaiTro với các fields: id, ma_vai_tro (unique), ten_vai_tro, mo_ta, ngay_tao, ngay_cap_nhat
- DTOs: CreateVaiTroDto, UpdateVaiTroDto với validation
- Service với logic:
  - create: tạo vai trò mới, kiểm tra trùng lặp
  - findAll: danh sách với pagination, search, sort
  - findOne: lấy chi tiết theo ID
  - findByMaVaiTro: tìm theo mã vai trò
  - update: cập nhật với validation
  - remove: xóa một vai trò
  - removeMultiple: xóa nhiều vai trò
- Controller với REST APIs:
  - POST /api/vai-tro: tạo mới
  - GET /api/vai-tro: danh sách (public)
  - GET /api/vai-tro/:id: chi tiết
  - PATCH /api/vai-tro/:id: cập nhật
  - DELETE /api/vai-tro/:id: xóa một
  - DELETE /api/vai-tro: xóa nhiều
- Tích hợp JWT guard và pagination utilities
```

**Files liên quan:**

- `backend/src/modules/VaiTro/vai-tro.entity.ts`
- `backend/src/modules/VaiTro/vai-tro.controller.ts`
- `backend/src/modules/VaiTro/vai-tro.service.ts`
- `backend/src/modules/VaiTro/vai-tro.module.ts`
- `backend/src/modules/VaiTro/dto/vai-tro.dto.ts`

**Lệnh git:**

```bash
git add backend/src/modules/VaiTro/
git commit -m "feat: tạo module Vai Trò với CRUD đầy đủ

- Entity với timestamps và unique constraints
- Service với business logic hoàn chỉnh
- Controller với 6 REST endpoints
- Tích hợp pagination, search, sort
- Validation đầy đủ với class-validator"
```

---

### Commit 5: Tạo module Người Dùng với authentication

**Mô tả commit:**

```
feat: tạo module Người Dùng với authentication và CRUD

Module quản lý người dùng và xác thực:
- Entity NguoiDung với các fields:
  - id, tai_khoan (unique), mat_khau (hashed)
  - ho_ten, email (unique), sdt, ngay_sinh, gioi_tinh, dia_chi, ghi_chu
  - vai_tro: Foreign key đến bảng vai_tro (ManyToOne relation)
  - ngay_tao, ngay_cap_nhat (timestamps)
- DTOs:
  - CreateNguoiDungDto, UpdateNguoiDungDto với validation
  - RegisterDto, LoginDto cho authentication
  - ChangePasswordDto để đổi mật khẩu
  - AuthResponse interface
- Service với logic:
  - Authentication: register, login, getProfile, changePassword
  - Hash password với bcrypt (10 rounds)
  - Generate JWT token với payload (id, tai_khoan, vai_tro)
  - CRUD: create, findAll, findOne, update, remove, removeMultiple
  - Tự động tạo vai trò USER khi đăng ký nếu chưa có
  - Kiểm tra trùng lặp email và tài khoản
  - Validate password cũ khi đổi mật khẩu
- Controller với REST APIs:
  - Auth endpoints:
    - POST /api/nguoi-dung/auth/register: đăng ký
    - POST /api/nguoi-dung/auth/login: đăng nhập
    - GET /api/nguoi-dung/auth/profile: lấy profile
    - POST /api/nguoi-dung/auth/change-password: đổi mật khẩu
  - CRUD endpoints:
    - POST /api/nguoi-dung: tạo mới (admin)
    - GET /api/nguoi-dung: danh sách
    - GET /api/nguoi-dung/:id: chi tiết
    - PATCH /api/nguoi-dung/:id: cập nhật
    - DELETE /api/nguoi-dung/:id: xóa một
    - DELETE /api/nguoi-dung: xóa nhiều
- Module configuration:
  - Import VaiTroModule để sử dụng VaiTroService
  - Config JwtModule với secret và expiration
  - Register PassportModule và JwtStrategy
  - Export services để các module khác sử dụng
```

**Files liên quan:**

- `backend/src/modules/NguoiDung/nguoi-dung.entity.ts`
- `backend/src/modules/NguoiDung/nguoi-dung.controller.ts`
- `backend/src/modules/NguoiDung/nguoi-dung.service.ts`
- `backend/src/modules/NguoiDung/nguoi-dung.module.ts`
- `backend/src/modules/NguoiDung/dto/nguoi-dung.dto.ts`
- `backend/src/modules/NguoiDung/dto/auth.dto.ts`

**Lệnh git:**

```bash
git add backend/src/modules/NguoiDung/
git commit -m "feat: tạo module Người Dùng với authentication và CRUD

- Entity với foreign key đến vai_tro và đầy đủ fields
- Authentication: đăng ký, đăng nhập, profile, đổi mật khẩu
- Password hashing với bcrypt
- JWT token generation
- CRUD đầy đủ với 6 endpoints
- Tích hợp pagination, search, sort
- Validation và error handling hoàn chỉnh"
```

---

### Commit 6: Cập nhật app module và main.ts

**Mô tả commit:**

```
feat: tích hợp modules mới vào app và thêm global validation

- Import VaiTroModule và NguoiDungModule vào AppModule
- Thêm ValidationPipe global trong main.ts:
  - whitelist: loại bỏ fields không hợp lệ
  - forbidNonWhitelisted: throw error nếu có field không hợp lệ
  - transform: tự động chuyển đổi kiểu dữ liệu
- Đảm bảo validation hoạt động cho tất cả endpoints
```

**Files liên quan:**

- `backend/src/app.module.ts`
- `backend/src/main.ts`

**Lệnh git:**

```bash
git add backend/src/app.module.ts backend/src/main.ts
git commit -m "feat: tích hợp modules mới vào app và thêm global validation

- Import VaiTroModule và NguoiDungModule
- Thêm ValidationPipe global với whitelist và transform
- Đảm bảo validation hoạt động toàn cục"
```

---

### Commit 7: Cập nhật database config với entities mới

**Mô tả commit:**

```
fix: thêm VaiTro và NguoiDung entities vào database config

- Import VaiTro và NguoiDung entities
- Thêm vào mảng entities trong TypeORM config
- Fix lỗi "No metadata for NguoiDung was found"
- Đảm bảo TypeORM có thể tạo bảng và sync schema
```

**Files liên quan:**

- `backend/src/config/database.config.ts`

**Lệnh git:**

```bash
git add backend/src/config/database.config.ts
git commit -m "fix: thêm VaiTro và NguoiDung entities vào database config

- Import entities mới
- Fix lỗi EntityMetadataNotFoundError
- Đảm bảo TypeORM sync schema đúng"
```

---

### Commit 8: Thêm documentation

**Mô tả commit:**

```
docs: thêm hướng dẫn test API và tóm tắt implementation

- API_TESTING_GUIDE.md: hướng dẫn chi tiết test API trên Postman
  - Cấu hình environment
  - Test từng endpoint với ví dụ request/response
  - Troubleshooting và lỗi thường gặp
  - Testing workflow đề xuất
- IMPLEMENTATION_SUMMARY.md: tóm tắt triển khai
  - Cấu trúc project
  - Tính năng đã triển khai
  - Best practices áp dụng
  - Hướng dẫn phát triển tiếp
```

**Files liên quan:**

- `backend/API_TESTING_GUIDE.md`
- `backend/IMPLEMENTATION_SUMMARY.md`

**Lệnh git:**

```bash
git add backend/API_TESTING_GUIDE.md backend/IMPLEMENTATION_SUMMARY.md
git commit -m "docs: thêm hướng dẫn test API và tóm tắt implementation

- Hướng dẫn test API chi tiết trên Postman
- Tóm tắt cấu trúc và tính năng đã triển khai
- Best practices và hướng dẫn mở rộng"
```

---

## 🚀 Thực Hiện Tất Cả Commits

Nếu bạn muốn thực hiện tất cả commits một lượt:

```bash
# Commit 1: Dependencies
git add backend/package.json backend/package-lock.json
git commit -m "feat: cài đặt dependencies cho JWT authentication và validation"

# Commit 2: JWT System
git add backend/src/common/guards/jwt-auth.guard.ts
git add backend/src/common/strategies/jwt.strategy.ts
git add backend/src/common/decorators/public.decorator.ts
git add backend/src/common/decorators/current-user.decorator.ts
git commit -m "feat: tạo JWT authentication system"

# Commit 3: Utilities
git add backend/src/shared/dto/pagination.dto.ts
git add backend/src/shared/utils/query.utils.ts
git add backend/src/shared/constants/app.constants.ts
git commit -m "feat: tạo utilities cho pagination, filtering và sorting"

# Commit 4: Module Vai Trò
git add backend/src/modules/VaiTro/
git commit -m "feat: tạo module Vai Trò với CRUD đầy đủ"

# Commit 5: Module Người Dùng
git add backend/src/modules/NguoiDung/
git commit -m "feat: tạo module Người Dùng với authentication và CRUD"

# Commit 6: App Integration
git add backend/src/app.module.ts backend/src/main.ts
git commit -m "feat: tích hợp modules mới vào app và thêm global validation"

# Commit 7: Database Config Fix
git add backend/src/config/database.config.ts
git commit -m "fix: thêm VaiTro và NguoiDung entities vào database config"

# Commit 8: Documentation
git add backend/API_TESTING_GUIDE.md backend/IMPLEMENTATION_SUMMARY.md
git commit -m "docs: thêm hướng dẫn test API và tóm tắt implementation"
```

---

## 📝 Lưu Ý

1. **Thứ tự commit quan trọng**: Nên commit theo thứ tự từ 1-8 vì có dependencies giữa các commits

2. **Git conventions**:
   - `feat:` - Tính năng mới
   - `fix:` - Sửa lỗi
   - `docs:` - Documentation
   - `refactor:` - Cải thiện code
   - `test:` - Thêm tests

3. **Kiểm tra trước khi commit**:

   ```bash
   git status  # Xem files đã thay đổi
   git diff    # Xem chi tiết thay đổi
   ```

4. **Nếu muốn xem history**:

   ```bash
   git log --oneline  # Xem commit history ngắn gọn
   ```

5. **Branch strategy** (tùy chọn):
   - Nên tạo branch mới: `git checkout -b feature/backend-implementation`
   - Sau khi hoàn thành merge vào main: `git merge feature/backend-implementation`

---

## ✅ Checklist

- [ ] Commit 1: Dependencies
- [ ] Commit 2: JWT System
- [ ] Commit 3: Utilities
- [ ] Commit 4: Module Vai Trò
- [ ] Commit 5: Module Người Dùng
- [ ] Commit 6: App Integration
- [ ] Commit 7: Database Config Fix
- [ ] Commit 8: Documentation

---

**Sau khi commit xong, push lên remote:**

```bash
git push origin <branch-name>
```
