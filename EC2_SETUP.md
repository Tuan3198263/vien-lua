# Hướng dẫn Setup Dự án trên EC2

## 1. Kết nối tới EC2

```bash
ssh -i "C:\Users\Admin\Downloads\my-ec2-key.pem" ubuntu@54.253.226.183
```

## 2. Cài đặt Docker Compose (nếu chưa có)

```bash
# Kiểm tra docker-compose có sẵn không
docker-compose --version

# Nếu chưa có, cài đặt docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Cấp quyền thực thi
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra lại
docker-compose --version
```

## 3. Thêm user vào Docker group (để không cần sudo)

```bash
# Thêm user hiện tại vào docker group
sudo usermod -aG docker $USER

# Áp dụng thay đổi (hoặc logout/login lại)
newgrp docker

# Kiểm tra
docker ps
```

## 4. Tạo SSH Key để clone repo private

```bash
# Tạo SSH key trên EC2
ssh-keygen -t ed25519 -C "your_email@example.com"

# Nhấn Enter để chấp nhận vị trí mặc định (~/.ssh/id_ed25519)
# Có thể để trống passphrase hoặc đặt passphrase

# Hiển thị public key
cat ~/.ssh/id_ed25519.pub
```

**Sau đó:**

1. Copy nội dung public key
2. Vào GitHub → Settings → SSH and GPG keys → New SSH key
3. Paste public key vào và lưu

## 5. Clone dự án

```bash
# Di chuyển đến thư mục home
cd ~

# Clone repository (thay YOUR_USERNAME/vien-lua bằng repo thực tế)
git clone git@github.com:YOUR_USERNAME/vien-lua.git

# Di chuyển vào thư mục dự án
cd vien-lua
```

## 6. Tạo file .env cho Backend

```bash
# Tạo file .env trong thư mục backend
cd ~/vien-lua/backend

# Tạo file .env từ template
cat > .env << 'EOF'
# Node Environment
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=your-database-host
DB_PORT=5432
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=vien_lua_db

# JWT Secret (tạo một chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Thêm các biến môi trường khác nếu cần
EOF

# Chỉnh sửa file .env với thông tin thực tế
nano .env
```

**Lưu ý:** Thay thế các giá trị placeholder bằng thông tin thực tế:

- `your-database-host`: địa chỉ database của bạn
- `your-database-user`: username database
- `your-database-password`: password database
- `your-super-secret-jwt-key-change-this`: secret key mạnh (có thể dùng `openssl rand -base64 32`)

## 7. Build và chạy Docker containers

```bash
# Quay lại thư mục root của dự án
cd ~/vien-lua

# Pull images và build containers
docker-compose pull
docker-compose build

# Chạy containers
docker-compose up -d

# Kiểm tra trạng thái containers
docker-compose ps

# Xem logs
docker-compose logs -f
```

## 8. Kiểm tra ứng dụng

```bash
# Kiểm tra backend
curl http://localhost:3001

# Kiểm tra frontend
curl http://localhost:8080
```

**Truy cập từ browser:**

- Frontend: `http://54.253.226.183:8080`
- Backend API: `http://54.253.226.183:3001`

## 9. Các lệnh Docker hữu ích

```bash
# Xem logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop services
docker-compose stop

# Stop và xóa containers
docker-compose down

# Rebuild và restart
docker-compose up -d --build

# Xóa volumes (cẩn thận, sẽ mất dữ liệu)
docker-compose down -v
```

## 10. Cập nhật code mới từ Git

```bash
cd ~/vien-lua

# Pull code mới
git pull origin main

# Rebuild và restart containers
docker-compose up -d --build
```

## Xử lý sự cố

### Lỗi: "permission denied" khi chạy docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Lỗi: "docker-compose: command not found"

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Lỗi: "Port already in use"

Kiểm tra port đã được sử dụng:

```bash
sudo lsof -i :8080
sudo lsof -i :3001
```

Dừng process đang sử dụng port hoặc thay đổi port trong [docker-compose.yml](docker-compose.yml)

### Kiểm tra logs chi tiết

```bash
docker-compose logs --tail=100 backend
docker-compose logs --tail=100 frontend
```

## Cấu hình CI/CD đã được setup

File [.github/workflows/deploy.yml](.github/workflows/deploy.yml) đã được cấu hình với:

- Tự động deploy khi push lên branch `main`
- Sử dụng SSH để kết nối EC2
- Tự động pull code, build và restart containers
- Đã thêm `sudo` cho các lệnh docker
