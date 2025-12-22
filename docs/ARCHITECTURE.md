# Sơ đồ Kiến trúc Hệ thống

## 🏗️ Kiến trúc Tổng quan

```
┌────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                      (User Interface)                           │
└───────────────────────────┬────────────────────────────────────┘
                            │ HTTP/HTTPS
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                      Nginx (Port 80)                            │
│                    Static File Server                           │
│                  (Frontend Container)                           │
└───────────────────────────┬────────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                 Frontend Application                            │
│          ┌──────────────────────────────────┐                  │
│          │    React + TypeScript + Vite     │                  │
│          │         Ant Design UI            │                  │
│          └──────────────────────────────────┘                  │
│                                                                 │
│   Components:                                                   │
│   ├── Layout (Header, Sidebar, Content)                        │
│   ├── Pages (Dashboard, Users, Settings)                       │
│   └── Services (API calls with Axios)                          │
└───────────────────────────┬────────────────────────────────────┘
                            │ API Calls
                            │ /api/*
                            │
┌───────────────────────────▼────────────────────────────────────┐
│              Backend API (Port 3001)                            │
│          ┌──────────────────────────────────┐                  │
│          │         NestJS Server            │                  │
│          │       TypeScript + Node.js       │                  │
│          └──────────────────────────────────┘                  │
│                                                                 │
│   Architecture Layers:                                          │
│                                                                 │
│   ┌─────────────────────────────────────────────┐             │
│   │          Controllers Layer                   │             │
│   │  ┌────────────┐  ┌────────────┐             │             │
│   │  │    App     │  │    User    │             │             │
│   │  │ Controller │  │ Controller │  ...        │             │
│   │  └─────┬──────┘  └─────┬──────┘             │             │
│   └────────┼────────────────┼─────────────────────┘             │
│            │                │                                   │
│   ┌────────▼────────────────▼─────────────────────┐             │
│   │          Services Layer                       │             │
│   │  ┌──────────┐  ┌──────────┐                  │             │
│   │  │   App    │  │   User   │                  │             │
│   │  │ Service  │  │ Service  │  ...             │             │
│   │  └────┬─────┘  └────┬─────┘                  │             │
│   └───────┼─────────────┼────────────────────────┘             │
│           │             │                                       │
│   ┌───────▼─────────────▼────────────────────────┐             │
│   │     TypeORM Repository Layer                 │             │
│   │  ┌──────────┐  ┌──────────┐                  │             │
│   │  │   User   │  │  Other   │                  │             │
│   │  │   Repo   │  │   Repos  │  ...             │             │
│   │  └────┬─────┘  └────┬─────┘                  │             │
│   └───────┼─────────────┼────────────────────────┘             │
│           │             │                                       │
│   ┌───────▼─────────────▼────────────────────────┐             │
│   │          Entities Layer                      │             │
│   │  ┌──────────┐  ┌──────────┐                  │             │
│   │  │   User   │  │  Other   │                  │             │
│   │  │  Entity  │  │ Entities │  ...             │             │
│   │  └──────────┘  └──────────┘                  │             │
│   └──────────────────────────────────────────────┘             │
│                                                                 │
│   Modules:                                                      │
│   ├── AppModule (Root)                                         │
│   ├── UserModule (Feature)                                     │
│   └── ConfigModule (Configuration)                             │
└───────────────────────────┬────────────────────────────────────┘
                            │ SQL Queries
                            │ (TypeORM)
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                    MySQL Database                               │
│                  (External FreedDB)                             │
│          ┌──────────────────────────────────┐                  │
│          │    Host: sql.freedb.tech         │                  │
│          │    Port: 3306                    │                  │
│          │    DB: freedb_vien_lua           │                  │
│          └──────────────────────────────────┘                  │
│                                                                 │
│   Tables:                                                       │
│   ├── users (id, name, email, isActive, ...)                   │
│   └── ... (các bảng khác)                                       │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Luồng dữ liệu (Data Flow)

### Request Flow

```
User Action
    │
    ▼
Frontend Component (React)
    │
    ▼
API Service (Axios)
    │ HTTP Request
    ▼
Backend Controller (NestJS)
    │
    ▼
Service Layer (Business Logic)
    │
    ▼
Repository (TypeORM)
    │ SQL Query
    ▼
Database (MySQL)
```

### Response Flow

```
Database (MySQL)
    │ Query Result
    ▼
Repository (TypeORM) → Entity
    │
    ▼
Service Layer → Process Data
    │
    ▼
Controller → JSON Response
    │ HTTP Response
    ▼
Frontend → Update UI
    │
    ▼
User sees result
```

## 🐳 Docker Architecture

```
┌────────────────────────────────────────────────────┐
│              Docker Compose Network                 │
│               (vien-lua-network)                    │
│                                                     │
│  ┌──────────────────────┐  ┌─────────────────────┐│
│  │  Frontend Container  │  │  Backend Container  ││
│  │                      │  │                     ││
│  │  - Nginx             │  │  - Node.js 20       ││
│  │  - Static Files      │  │  - NestJS App       ││
│  │  - Port: 80          │  │  - Port: 3001       ││
│  │                      │  │                     ││
│  └──────────────────────┘  └─────────────────────┘│
│           │                          │             │
│           └──────────────────────────┘             │
│                      │                             │
└──────────────────────┼─────────────────────────────┘
                       │
                       ▼
              External MySQL
           (sql.freedb.tech)
```

## 📦 Module Structure (Backend)

```
AppModule (Root)
├── ConfigModule (Global)
│   └── Environment Variables
│
├── TypeOrmModule (Database)
│   ├── DatabaseConfig
│   └── Connection Pool
│
└── Feature Modules
    ├── UserModule
    │   ├── UserController
    │   ├── UserService
    │   ├── UserEntity
    │   └── TypeOrmModule.forFeature([User])
    │
    └── [Other Modules]
        └── ...
```

## 🔐 Security Layers

```
┌────────────────────────────────────────┐
│         Security Layers                │
├────────────────────────────────────────┤
│  1. CORS Protection (NestJS)           │
│  2. Environment Variables (.env)       │
│  3. Docker Network Isolation           │
│  4. Database Connection Pooling        │
│  5. TypeScript Type Safety             │
└────────────────────────────────────────┘
```

## 🚀 Deployment Flow

```
┌──────────────┐
│  Developer   │
│  Push Code   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  GitHub Actions  │
│  (CI/CD)         │
├──────────────────┤
│  1. Checkout     │
│  2. Build Test   │
│  3. Docker Build │
│  4. Deploy       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   AWS EC2        │
│   (Production)   │
├──────────────────┤
│  - Pull code     │
│  - Build images  │
│  - Docker up     │
│  - Health check  │
└──────────────────┘
```

## 📊 Technology Stack Summary

```
┌─────────────────────────────────────────┐
│            Frontend Stack                │
├─────────────────────────────────────────┤
│  React 18     → UI Framework            │
│  TypeScript   → Type Safety             │
│  Vite         → Build Tool              │
│  Ant Design 5 → UI Components           │
│  Axios        → HTTP Client             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Backend Stack                 │
├─────────────────────────────────────────┤
│  NestJS 10    → Framework               │
│  TypeScript   → Type Safety             │
│  TypeORM      → ORM                     │
│  MySQL2       → Database Driver         │
│  Node.js 20   → Runtime                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            DevOps Stack                  │
├─────────────────────────────────────────┤
│  Docker       → Containerization        │
│  Compose      → Orchestration           │
│  GitHub Act.  → CI/CD                   │
│  Nginx        → Web Server              │
│  AWS EC2      → Hosting                 │
└─────────────────────────────────────────┘
```

## 🎯 Scalability Options

### Horizontal Scaling

```
Load Balancer
├── Frontend Instance 1
├── Frontend Instance 2
└── Frontend Instance 3

API Gateway
├── Backend Instance 1
├── Backend Instance 2
└── Backend Instance 3
```

### Vertical Scaling

- Tăng CPU/RAM cho containers
- Tối ưu connection pool
- Caching layer (Redis)
- CDN cho static files
