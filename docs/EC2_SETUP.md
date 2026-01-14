# Hướng dẫn Setup EC2 cho Production

## Bước 1: Kết nối SSH vào EC2

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

## Bước 2: Cài đặt Docker & Docker Compose

```bash
# Cài Docker (nếu chưa có)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group (không cần sudo)
sudo usermod -aG docker $USER
newgrp docker

# Kiểm tra
docker --version
docker compose version
```

## Bước 3: Clone dự án

```bash
# Di chuyển về home
cd ~

# Clone repository
git clone https://github.com/your-username/vien-lua.git
cd vien-lua
```

## Bước 4: Tạo file .env

```bash
# Tạo file .env
nano .env
```

**Nội dung file .env:**

```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=vien_lua_db

# JWT Configuration - QUAN TRỌNG!
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRATION=24h

# AWS S3 Configuration (Optional)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
```

**Lưu file:** `Ctrl + O` → Enter → `Ctrl + X`

## Bước 5: Chạy ứng dụng

```bash
# Pull images từ Docker Hub và chạy
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Kiểm tra containers
docker compose -f docker-compose.prod.yml ps

# Xem logs
docker compose -f docker-compose.prod.yml logs -f
```

## Kiểm tra ứng dụng

```bash
# Test backend API
curl http://localhost:3001/api

# Test frontend
curl http://localhost:8080
```

**Truy cập từ browser:**

- Frontend: `http://your-ec2-ip:8080`
- Backend API: `http://your-ec2-ip:3001/api`

## Cập nhật khi có code mới

**Không cần làm gì!** CI/CD tự động deploy khi bạn push code.

Nếu muốn update thủ công:

```bash
cd ~/vien-lua
git pull origin main
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Các lệnh hữu ích

```bash
# Xem logs backend
docker logs vien-lua-backend -f

# Xem logs frontend
docker logs vien-lua-frontend -f

# Restart tất cả containers
docker compose -f docker-compose.prod.yml restart

# Stop containers
docker compose -f docker-compose.prod.yml down

# Dọn dẹp images cũ
docker image prune -f
```

## Xử lý sự cố

### Lỗi: Backend không kết nối được database

```bash
# Kiểm tra logs
docker logs vien-lua-backend --tail 50

# Kiểm tra biến môi trường
docker exec vien-lua-backend env | grep DB_
```

### Lỗi: Port đã được sử dụng

```bash
# Kiểm tra process đang dùng port
sudo lsof -i :3001
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Lỗi: Container không start

```bash
# Xem logs chi tiết
docker compose -f docker-compose.prod.yml logs

# Restart lại
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

## Security Checklist

- ✅ File `.env` không được push lên Git
- ✅ Thay `JWT_SECRET` bằng chuỗi random mạnh
- ✅ EC2 Security Group chỉ mở port cần thiết (22, 80, 443, 3001, 8080)
- ✅ Sử dụng HTTPS cho production (cài Nginx + Let's Encrypt)
- ✅ Backup database định kỳ
