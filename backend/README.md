# Backend - NestJS + TypeORM + MySQL

## 📋 Mô tả

Backend API cho dự án Viện Lúa, xây dựng với NestJS framework và TypeORM. Sử dụng kiến trúc modular để dễ dàng mở rộng.

## 🛠️ Công nghệ sử dụng

- **NestJS 10** - Progressive Node.js framework
- **TypeORM** - ORM cho TypeScript/JavaScript
- **MySQL2** - MySQL client cho Node.js
- **TypeScript** - Type safety

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   └── user/             # User module
│   │       ├── user.entity.ts      # Entity (database model)
│   │       ├── user.controller.ts  # Controller (routes)
│   │       ├── user.service.ts     # Service (business logic)
│   │       └── user.module.ts      # Module definition
│   ├── config/
│   │   └── database.config.ts      # Database configuration
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Root module
│   ├── app.controller.ts     # Root controller
│   └── app.service.ts        # Root service
├── nest-cli.json             # NestJS CLI config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🚀 Chạy Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Chạy dev mode với hot reload
npm run start:dev

# API sẽ chạy tại: http://localhost:3001/api
```

## 🏗️ Build Production

```bash
# Build
npm run build

# Run production
npm run start:prod
```

## 🐳 Docker

```bash
# Build image
docker build -t vien-lua-backend .

# Run container
docker run -p 3001:3001 --env-file .env vien-lua-backend
```

## 🔗 API Endpoints

### Root Endpoints
```
GET  /api                  - Health check
GET  /api/database-check   - Kiểm tra kết nối database
```

### User Module
```
GET  /api/users           - Lấy danh sách users
GET  /api/users/count     - Đếm số lượng users
```

## 🗄️ Database

### Cấu hình

File `.env`:
```env
DB_HOST=sql.freedb.tech
DB_PORT=3306
DB_USER=freedb_tuanle2901
DB_PASSWORD=8KWDRXuY!AbwG%S
DB_NAME=freedb_vien_lua
```

### Kiểm tra kết nối

```bash
# Gọi endpoint kiểm tra database
curl http://localhost:3001/api/database-check
```

Kết quả mong đợi:
```json
{
  "status": "OK",
  "message": "Kết nối database thành công",
  "database": "freedb_vien_lua",
  "timestamp": "2025-12-21T..."
}
```

### Entity & Migration

TypeORM tự động tạo/cập nhật bảng khi `synchronize: true` (chỉ dùng trong dev).

**Lưu ý**: Trong production, nên tắt `synchronize` và dùng migrations.

## 📝 Scripts

```bash
npm run start         # Start
npm run start:dev     # Development mode với watch
npm run start:debug   # Debug mode
npm run start:prod    # Production mode
npm run build         # Build
npm run lint          # ESLint
npm run test          # Unit tests
npm run test:e2e      # E2E tests
```

## 🏗️ Kiến trúc Module

### Module Structure
Mỗi feature được tổ chức thành 1 module:

```
user/
├── user.entity.ts      # Database model
├── user.controller.ts  # API endpoints
├── user.service.ts     # Business logic
├── user.module.ts      # Module declaration
└── dto/                # Data Transfer Objects (tùy chọn)
```

### Tạo module mới

```bash
# Sử dụng NestJS CLI
nest generate module modules/product
nest generate controller modules/product
nest generate service modules/product
```

## 🔧 Cấu hình quan trọng

### database.config.ts
- Kết nối MySQL qua TypeORM
- Auto-load entities
- Synchronize trong development
- Connection pooling

### main.ts
- CORS enabled
- Global prefix: `/api`
- Port: 3001

## 💡 Best Practices

### 1. Structure theo Module
- Mỗi feature = 1 module
- Tách biệt controller, service, entity
- Export service để module khác sử dụng

### 2. Dependency Injection
```typescript
constructor(
  private readonly userService: UserService,
) {}
```

### 3. DTO & Validation
```typescript
// dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
}
```

### 4. Exception Handling
```typescript
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid data');
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 Mở rộng

### Thêm CRUD cho entity
1. Tạo entity với decorators TypeORM
2. Tạo service với repository
3. Tạo controller với endpoints
4. Import module vào AppModule

### Thêm Authentication
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
nest generate module auth
```

## 🔗 Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
