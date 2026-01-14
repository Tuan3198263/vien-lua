# 🌾 Viện Lúa - Hệ Thống Quản Lý

🌐 **Demo:** http://vienlua.myvnc.com:8080/

**Tài khoản test:**

- Tên đăng nhập: `TESTER`
- Mật khẩu: `TESTER`

---

Hệ thống quản lý viện lúa, cung cấp các chức năng tạo – cập nhật – tra cứu dữ liệu, phân quyền người dùng, quản lý file và xuất báo cáo Excel.

- **Frontend**: React + TypeScript + Vite + Ant Design 5
- **Backend**: NestJS + TypeORM + MySQL
- **Storage**: AWS S3
- **DevOps**: Docker + Docker Compose + GitHub Actions (CI/CD)

---

## ⚙️ 1. Cài đặt & Chạy dự án

### 📥 Clone dự án

```bash
git clone https://github.com/Tuan3198263/vien-lua.git
cd vien-lua
```

**Truy cập:**

- 🌐 Frontend: http://localhost:8080
- 🔌 Backend API: http://localhost:3001/api

### 🖥️ Chạy development mode (Local)

#### Backend

```bash
cd backend
npm install
# Tạo file .env từ template
cp .env.example .env
# Chỉnh sửa .env với thông tin database, JWT_SECRET của bạn
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🚀 2. Công nghệ sử dụng

**Frontend:** React 18, TypeScript, Vite, Ant Design 5, Redux, Axios

**Backend:** NestJS 10, TypeORM, MySQL, JWT, ExcelJS

**🔗 Tích hợp & Dịch vụ bên ngoài**

- AWS S3 – Lưu trữ file đính kèm
- Docker Hub – Registry cho Docker images
- GitHub Actions – CI/CD tự động

## 📌 3. Chức năng chính

- Đăng nhập / Đăng xuất (JWT)
- Phân quyền theo vai trò

### 📊 Quản lý dữ liệu

- **Đề tài:** CRUD, upload file, tìm kiếm/lọc, phân trang, export Excel
- **Đấu thầu:** CRUD, upload file, liên kết đề tài, export Excel
- **Đề cương Thí nghiệm:** CRUD, upload file, export Excel
- **Hợp đồng:** CRUD, upload file , export Excel
- **Nhà lưới:** CRUD, upload file, export Excel
- **Tài liệu:** Quản lý file hệ thống

### 🛠️ Quản trị viên

- Quản lý người dùng
- Quản lý vai trò & phân quyền chi tiết

## 🧱 4. Cấu trúc thư mục

```
vien_lua/
│
├── backend/
│   ├── src/
│   │   ├── modules/             # Feature modules
│   │   ├── common/              # Guards, decorators, filters
│   │   ├── config/              # Database, S3 config
│   │   ├── core/                # Core services
│   │   ├── shared/              # Utils, constants, DTOs
│   │   └── main.ts              # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── layouts/             # Layout components
│   │   ├── services/            # API services
│   │   ├── stores/              # Redux stores
│   │   ├── router/              # Route config
│   │   ├── config/              # App config
│   │   ├── constants/           # Constants
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── utils/               # Helper functions
│   │   ├── hooks/               # Custom hooks
│   │   └── main.tsx             # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── docs/                        # Documentation
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
│
├── docker-compose.yml            # Local development
├── docker-compose.prod.yml       # Production deployment
└── README.md                     # This file
```

## 🎓 5. Mục đích

Dự án được phát triển nhằm:

- 📚 Học tập và thực hành công nghệ mới
- 🏗️ Xây dựng kiến trúc ứng dụng web quy mô thực tế
- 🔧 Thực hành DevOps với Docker và CI/CD
- 💼 Giải quyết bài toán quản lý thực tế của viện nghiên cứu

## 👨‍💻 6. Liên hệ

📧 Email: lnttuan911@gmail.com

---

⭐ **Built with modern technologies | Crafted with passion and dedication** 🚀
💻 **Vibe Coding**
