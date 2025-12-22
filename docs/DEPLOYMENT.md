# Hướng dẫn Deploy

## 📋 Tổng quan

Hướng dẫn deploy ứng dụng Viện Lúa lên AWS EC2 sử dụng Docker và GitHub Actions.

## 🎯 Prerequisites

### 1. Chuẩn bị AWS EC2

```bash
# Instance requirements:
- OS: Ubuntu 22.04 LTS
- Type: t2.small hoặc cao hơn
- Storage: 20GB+
- Security Group: Mở port 80, 443, 22
```

### 2. Cài đặt trên EC2

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version

# Logout và login lại để apply group
exit
```

### 3. Clone Repository trên EC2

```bash
# SSH lại vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone repo
cd ~
git clone <your-repo-url> vien-lua
cd vien-lua

# Setup environment
cp .env.example .env
# Edit .env nếu cần
nano .env
```

## 🔑 Setup GitHub Secrets

Vào GitHub repository → Settings → Secrets and variables → Actions

Thêm các secrets sau:

```
EC2_HOST       = your-ec2-public-ip
EC2_USER       = ubuntu
EC2_SSH_KEY    = (paste nội dung file .pem)
```

### Lấy SSH key content:

```bash
# Trên máy local
cat your-key.pem
# Copy toàn bộ nội dung (bao gồm BEGIN và END)
```

## 🚀 Deploy Manual (Lần đầu)

```bash
# Trên EC2
cd ~/vien-lua

# Build và chạy
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Kiểm tra
docker-compose ps
curl http://localhost:3001/api
```

## 🔄 Deploy với GitHub Actions

### Workflow tự động khi push code:

1. **Push code lên GitHub**

   ```bash
   git add .
   git commit -m "Update code"
   git push origin main
   ```

2. **GitHub Actions sẽ tự động:**

   - ✅ Checkout code
   - ✅ Build và test frontend
   - ✅ Build và test backend
   - ✅ Build Docker images
   - ✅ SSH vào EC2
   - ✅ Pull code mới
   - ✅ Rebuild containers
   - ✅ Verify deployment

3. **Theo dõi progress:**
   - Vào GitHub → Actions tab
   - Xem log của workflow

## 🔍 Verify Deployment

### 1. Kiểm tra containers

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
docker-compose ps
```

Output mong đợi:

```
NAME                   STATUS              PORTS
vien-lua-backend       Up X minutes        0.0.0.0:3001->3001/tcp
vien-lua-frontend      Up X minutes        0.0.0.0:80->80/tcp
```

### 2. Kiểm tra health

```bash
# Backend API
curl http://your-ec2-ip:3001/api

# Database connection
curl http://your-ec2-ip:3001/api/database-check

# Frontend
curl http://your-ec2-ip
```

### 3. Kiểm tra logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

## 🛠️ Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Rebuild từ đầu
docker-compose down
docker-compose up -d --build
```

### Database connection failed

```bash
# Kiểm tra env variables
cat .env

# Test connection từ EC2
telnet sql.freedb.tech 3306

# Xem logs backend
docker-compose logs backend | grep -i database
```

### Port đã được sử dụng

```bash
# Kiểm tra port
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3001

# Kill process nếu cần
sudo kill -9 <PID>
```

### Không đủ disk space

```bash
# Xem dung lượng
df -h

# Dọn dẹp Docker
docker system prune -a
docker volume prune
```

## 🔐 Security Best Practices

### 1. Firewall (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### 2. SSL/HTTPS với Let's Encrypt

```bash
# Cài đặt Certbot
sudo apt install certbot python3-certbot-nginx

# Lấy certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 3. Environment Variables

```bash
# KHÔNG commit .env vào Git
# Luôn dùng .env.example làm template
# Quản lý secrets qua GitHub Secrets hoặc AWS Parameter Store
```

## 📊 Monitoring

### 1. Container Health

```bash
# Xem resource usage
docker stats

# Xem logs realtime
docker-compose logs -f --tail=100
```

### 2. Application Logs

```bash
# Backend logs
docker-compose exec backend tail -f /app/logs/app.log

# Nginx access logs
docker-compose exec frontend tail -f /var/log/nginx/access.log
```

## 🔄 Update & Rollback

### Update ứng dụng

```bash
cd ~/vien-lua
git pull origin main
docker-compose up -d --build
```

### Rollback nếu có lỗi

```bash
# Rollback code
git log --oneline -n 10
git checkout <previous-commit-hash>

# Rebuild
docker-compose up -d --build
```

## 🎯 Production Checklist

- [ ] EC2 instance đã cài Docker & Docker Compose
- [ ] Security Group mở đúng ports
- [ ] SSH key đã thêm vào GitHub Secrets
- [ ] .env file đã cấu hình đúng
- [ ] Database connection test thành công
- [ ] UFW firewall đã enable
- [ ] SSL certificate đã cài (nếu có domain)
- [ ] Monitoring đã setup
- [ ] Backup strategy đã có
- [ ] CI/CD pipeline test thành công

## 📝 Useful Commands

```bash
# Deploy
docker-compose up -d --build

# Stop
docker-compose down

# Restart
docker-compose restart

# Logs
docker-compose logs -f

# Remove all
docker-compose down -v

# Rebuild single service
docker-compose up -d --build backend

# Execute command in container
docker-compose exec backend npm run migration:run
```

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker-compose logs`
2. Kiểm tra GitHub Actions logs
3. Verify env variables
4. Test database connection
5. Check firewall rules
