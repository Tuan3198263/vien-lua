# Viện Lúa - Dashboard Quản Lý

## 📋 Mô tả

Đây là boilerplate cho web app dashboard quản lý, được xây dựng với stack công nghệ hiện đại:

- **Frontend**: React + TypeScript + Vite + Ant Design
- **Backend**: NestJS + TypeORM + MySQL
- **DevOps**: Docker + Docker Compose + GitHub Actions

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐
│   Client/User   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│    Frontend     │
│  React + Vite   │ :80
│   Ant Design    │
└────────┬────────┘
         │ API Calls (/api)
         ▼
┌─────────────────┐
│     Backend     │
│     NestJS      │ :3001
│    TypeORM      │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│     MySQL DB    │
│  freedb.tech    │
└─────────────────┘
```

## 📁 Cấu trúc thư mục

```
vien_lua/
├── frontend/                 # Frontend React application
│   ├── src/
│   │   ├── pages/           # Các trang (Dashboard, etc.)
│   │   ├── main.tsx         # Entry point
│   │   └── App.tsx          # Root component
│   ├── Dockerfile           # Docker config cho frontend
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                  # Backend NestJS application
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   └── user/        # User module mẫu
│   │   ├── config/          # Database config
│   │   ├── main.ts          # Entry point
│   │   ├── app.module.ts    # Root module
│   │   ├── app.controller.ts
│   │   └── app.service.ts
│   ├── Dockerfile           # Docker config cho backend
│   ├── package.json
│   └── tsconfig.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
│
├── docs/                     # Tài liệu
├── docker-compose.yml        # Orchestration
├── .env.example              # Environment variables template
└── README.md                 # File này
```

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone repository

```bash
git clone <repository-url>
cd vien_lua
```

### 2. Chạy với Docker Compose (Khuyến nghị)

```bash
# Copy file .env
cp .env.example .env

# Build và chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

Truy cập:

- Frontend: http://localhost
- Backend API: http://localhost:3001/api

### 3. Chạy development mode (Local)

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔗 API Endpoints

### Health Check

- `GET /api` - Kiểm tra server hoạt động
- `GET /api/database-check` - Kiểm tra kết nối database

### User Module

- `GET /api/users` - Lấy danh sách users
- `GET /api/users/count` - Đếm số lượng users

## 🗄️ Database

Thông tin kết nối MySQL (FreedDB):

- Host: `sql.freedb.tech`
- Port: `3306`
- Database: `freedb_vien_lua`
- User: `freedb_tuanle2901`
- Password: `8KWDRXuY!AbwG%S`

## 🔄 CI/CD

GitHub Actions workflow tự động:

1. ✅ Build và test khi push code
2. 🐳 Build Docker images
3. 🚀 Deploy lên AWS EC2 (nếu cấu hình)

### Setup GitHub Secrets cho CI/CD

```
EC2_HOST       - Địa chỉ IP EC2
EC2_USER       - Username SSH (ubuntu)
EC2_SSH_KEY    - Private SSH key
```

## 📝 Các lệnh hữu ích

### Docker

```bash
# Rebuild images
docker-compose up -d --build

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend

# Xóa tất cả containers và volumes
docker-compose down -v
```

### Development

```bash
# Backend
cd backend
npm run start:dev      # Dev mode với hot reload
npm run build          # Build production
npm run test           # Chạy tests

# Frontend
cd frontend
npm run dev            # Dev mode
npm run build          # Build production
npm run preview        # Preview production build
```

## 🎯 Features hiện có

### Frontend

- ✅ Layout cơ bản với Header, Sidebar, Content
- ✅ Trang Dashboard với cards thống kê mẫu
- ✅ Menu điều hướng
- ✅ Ant Design UI components
- ✅ TypeScript support

### Backend

- ✅ Cấu trúc modular architecture
- ✅ Module User mẫu
- ✅ TypeORM integration
- ✅ MySQL connection
- ✅ Health check endpoints
- ✅ CORS enabled
- ✅ Environment configuration

## 📚 Tài liệu thêm

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Hướng dẫn Deploy](./docs/DEPLOYMENT.md)

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Ant Design 5** - UI component library
- **Axios** - HTTP client

### Backend

- **NestJS 10** - Node.js framework
- **TypeORM** - ORM
- **MySQL2** - Database driver
- **Class Validator** - Validation

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD
- **Nginx** - Web server (trong Docker)

## 📈 Roadmap

- [ ] Authentication & Authorization (JWT)
- [ ] User CRUD operations
- [ ] Pagination & Filtering
- [ ] File upload
- [ ] Email service
- [ ] Logging system
- [ ] Unit & E2E tests
- [ ] API documentation (Swagger)
- [ ] Performance monitoring

## 👥 Contributors

- Your Name - Initial work

## 📄 License

MIT License
