# Cấu trúc Dự án Viện Lúa

## 📂 Cấu trúc thư mục đầy đủ

```
vien_lua/
│
├── frontend/                          # Frontend React Application
│   ├── src/
│   │   ├── pages/                     # Các trang của ứng dụng (để trống, sẵn sàng mở rộng)
│   │   ├── main.tsx                   # Entry point, config Ant Design locale
│   │   └── App.tsx                    # Root component với Layout + Dashboard demo
│   │
│   ├── index.html                     # HTML template
│   ├── package.json                   # Dependencies: React, Vite, Ant Design, TypeScript
│   ├── tsconfig.json                  # TypeScript config
│   ├── tsconfig.node.json             # TypeScript config cho Vite
│   ├── vite.config.ts                 # Vite config + API proxy
│   ├── Dockerfile                     # Multi-stage build với Nginx
│   ├── .dockerignore                  # Ignore node_modules, dist
│   ├── .gitignore                     # Git ignore rules
│   └── README.md                      # Hướng dẫn frontend
│
├── backend/                           # Backend NestJS Application
│   ├── src/
│   │   ├── modules/                   # Feature Modules
│   │   │   └── user/                  # User Module (mẫu)
│   │   │       ├── user.entity.ts     # Entity định nghĩa bảng users
│   │   │       ├── user.controller.ts # API endpoints: GET /users, /users/count
│   │   │       ├── user.service.ts    # Business logic
│   │   │       └── user.module.ts     # Module declaration
│   │   │
│   │   ├── config/
│   │   │   └── database.config.ts     # TypeORM MySQL config
│   │   │
│   │   ├── main.ts                    # Entry point, CORS, port 3001
│   │   ├── app.module.ts              # Root module import tất cả
│   │   ├── app.controller.ts          # Health check endpoints
│   │   └── app.service.ts             # Health check + database check logic
│   │
│   ├── package.json                   # Dependencies: NestJS, TypeORM, MySQL2
│   ├── tsconfig.json                  # TypeScript config
│   ├── tsconfig.build.json            # Build config
│   ├── nest-cli.json                  # NestJS CLI config
│   ├── Dockerfile                     # Multi-stage build cho production
│   ├── .dockerignore                  # Ignore node_modules, dist, test
│   ├── .gitignore                     # Git ignore rules
│   ├── .env                           # Environment variables (DB connection)
│   ├── .env.example                   # Template cho .env
│   └── README.md                      # Hướng dẫn backend
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD pipeline với GitHub Actions
│                                      # - Build & test frontend/backend
│                                      # - Build Docker images
│                                      # - Deploy to AWS EC2 via SSH
│
├── docs/                              # Tài liệu
│   ├── ARCHITECTURE.md                # Sơ đồ kiến trúc chi tiết
│   └── DEPLOYMENT.md                  # Hướng dẫn deploy từng bước
│
├── docker-compose.yml                 # Orchestration cho frontend + backend
├── .env                               # Environment variables cho Docker Compose
├── .env.example                       # Template
├── .gitignore                         # Git ignore cho root
├── README.md                          # Tài liệu chính của dự án
└── prompt.md                          # File yêu cầu gốc
```

## 🎯 Các file quan trọng

### Frontend

#### `frontend/src/main.tsx`

- Entry point của React app
- Config Ant Design với locale tiếng Việt
- Mount React vào DOM

#### `frontend/src/App.tsx`

- Layout chính: Header + Sidebar + Content
- Dashboard demo với cards thống kê
- Menu điều hướng

#### `frontend/vite.config.ts`

- Config Vite dev server (port 3000)
- Proxy `/api` requests → `http://localhost:3001`

#### `frontend/Dockerfile`

- Stage 1: Build với Node.js
- Stage 2: Serve với Nginx

### Backend

#### `backend/src/main.ts`

- Bootstrap NestJS app
- Enable CORS
- Global prefix `/api`
- Listen on port 3001

#### `backend/src/app.module.ts`

- Import ConfigModule (env variables)
- Import TypeOrmModule (database)
- Import UserModule (feature)

#### `backend/src/config/database.config.ts`

- Cấu hình kết nối MySQL
- Host: sql.freedb.tech
- Auto-load entities
- Connection pooling

#### `backend/src/app.service.ts`

- Health check logic
- Database connection test với query `SELECT 1`

#### `backend/src/modules/user/`

- **user.entity.ts**: Định nghĩa bảng `users` (id, name, email, isActive, timestamps)
- **user.controller.ts**: Endpoints GET /api/users, /api/users/count
- **user.service.ts**: Logic lấy data từ database
- **user.module.ts**: Module declaration

### Docker & DevOps

#### `docker-compose.yml`

- Service `backend`: Build từ ./backend, expose 3001
- Service `frontend`: Build từ ./frontend, expose 80
- Network: vien-lua-network

#### `.github/workflows/deploy.yml`

- **backend-build**: npm ci → build → test
- **frontend-build**: npm ci → build
- **docker-build**: Build Docker images
- **deploy**: SSH to EC2 → Pull → Docker compose up

### Documentation

#### `README.md`

- Tổng quan dự án
- Hướng dẫn cài đặt và chạy
- API endpoints
- Tech stack

#### `docs/ARCHITECTURE.md`

- Sơ đồ kiến trúc tổng quan
- Data flow diagrams
- Module structure
- Security layers

#### `docs/DEPLOYMENT.md`

- Setup EC2 từng bước
- Configure GitHub Secrets
- Deploy manual & automated
- Troubleshooting guide

## 🚀 Cách chạy dự án

### Option 1: Docker Compose (Khuyến nghị)

```bash
# Tại thư mục root (vien_lua/)
docker-compose up -d --build

# Frontend: http://localhost
# Backend: http://localhost:3001/api
```

### Option 2: Development Mode

Terminal 1 - Backend:

```bash
cd backend
npm install
npm run start:dev
# http://localhost:3001/api
```

Terminal 2 - Frontend:

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

## 🔗 API Endpoints có sẵn

```
GET  /api                    → Health check
GET  /api/database-check     → Test DB connection
GET  /api/users              → Lấy danh sách users
GET  /api/users/count        → Đếm số users
```

## ✅ Tính năng đã triển khai

### Frontend ✅

- [x] Layout với Header, Sidebar, Content
- [x] Dashboard page với cards demo
- [x] Ant Design UI integration
- [x] TypeScript support
- [x] API proxy config
- [x] Dockerfile multi-stage build

### Backend ✅

- [x] NestJS modular architecture
- [x] TypeORM MySQL integration
- [x] User module mẫu (Entity, Controller, Service)
- [x] Health check endpoints
- [x] Database connection test
- [x] CORS enabled
- [x] Environment configuration
- [x] Dockerfile production-ready

### DevOps ✅

- [x] Docker Compose orchestration
- [x] GitHub Actions CI/CD pipeline
- [x] Deployment to EC2 workflow
- [x] Environment variables management

### Documentation ✅

- [x] README tổng quan
- [x] Frontend README
- [x] Backend README
- [x] Architecture diagrams
- [x] Deployment guide

## 🎨 Tech Stack Summary

**Frontend**: React 18 + TypeScript + Vite + Ant Design 5  
**Backend**: NestJS 10 + TypeORM + MySQL2 + TypeScript  
**Database**: MySQL (FreedDB - sql.freedb.tech)  
**DevOps**: Docker + Docker Compose + GitHub Actions + AWS EC2  
**Server**: Nginx (frontend) + Node.js 20 (backend)

## 📝 Lưu ý quan trọng

1. **Database**: Dự án sử dụng MySQL external (FreedDB), không có container MySQL trong docker-compose
2. **Synchronize**: TypeORM auto-sync bật trong dev, tắt trong production
3. **CORS**: Đã enable để frontend gọi API
4. **Proxy**: Frontend proxy `/api` → backend:3001
5. **Secrets**: Cần setup GitHub Secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY) để CI/CD hoạt động

## 🔜 Roadmap

- [ ] Authentication & JWT
- [ ] User CRUD đầy đủ
- [ ] Pagination
- [ ] File upload
- [ ] Logging system
- [ ] Unit tests
- [ ] API documentation (Swagger)

---

**Dự án đã sẵn sàng để chạy và mở rộng!** 🚀
