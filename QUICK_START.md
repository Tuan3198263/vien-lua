# 🚀 Quick Start Guide - Viện Lúa

## Chạy dự án trong 3 bước

### Bước 1: Clone và cài đặt

```bash
cd vien_lua
```

### Bước 2: Chạy với Docker Compose

```bash
# Build và chạy tất cả services
docker-compose up -d --build

# Xem logs
docker-compose logs -f
```

### Bước 3: Truy cập ứng dụng

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api
- **Database Check**: http://localhost:3001/api/database-check

---

## 📱 Chạy Development Mode (Không dùng Docker)

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend chạy tại: http://localhost:3001/api

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: http://localhost:3000

---

## 🧪 Test các endpoints

```bash
# Health check
curl http://localhost:3001/api

# Database connection
curl http://localhost:3001/api/database-check

# Users count
curl http://localhost:3001/api/users/count

# Users list
curl http://localhost:3001/api/users
```

---

## 🛑 Dừng ứng dụng

```bash
# Dừng Docker Compose
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

---

## 📚 Tài liệu chi tiết

- [README.md](./README.md) - Tổng quan dự án
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Cấu trúc chi tiết
- [frontend/README.md](./frontend/README.md) - Hướng dẫn Frontend
- [backend/README.md](./backend/README.md) - Hướng dẫn Backend
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Sơ đồ kiến trúc
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Hướng dẫn deploy

---

## 💡 Tips

### Xem logs chi tiết

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

### Rebuild một service cụ thể

```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Truy cập vào container

```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

---

## ⚠️ Troubleshooting

### Port đã được sử dụng

```bash
# Xem process đang dùng port
netstat -ano | findstr :80
netstat -ano | findstr :3001

# Hoặc thay đổi port trong docker-compose.yml
```

### Database connection failed

```bash
# Kiểm tra .env file
cat backend/.env

# Test connection từ backend container
docker-compose exec backend npm run start:dev
```

### Frontend không gọi được API

- Kiểm tra backend đã chạy: http://localhost:3001/api
- Kiểm tra CORS đã enable trong backend
- Kiểm tra proxy config trong `vite.config.ts`

---

## 🎯 Next Steps

1. ✅ Chạy dự án thành công
2. 📖 Đọc tài liệu chi tiết
3. 🔧 Customize theo nhu cầu
4. 📝 Thêm modules mới
5. 🚀 Deploy lên production

**Happy Coding!** 🎉
