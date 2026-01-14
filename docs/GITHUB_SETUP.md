# Hướng dẫn Setup GitHub và CI/CD

## Tổng quan

Dự án sử dụng GitHub Actions để tự động:

1. Build và test code
2. Build Docker images → Push lên Docker Hub
3. Deploy lên EC2 khi push code lên branch `main`

## Bước 1: Tạo GitHub Repository

1. Truy cập: https://github.com/new
2. Điền thông tin:
   - **Repository name**: `vien-lua`
   - **Description**: "Dashboard quản lý với React + NestJS"
   - **Visibility**: Chọn `Public` hoặc `Private`
   - ⚠️ **KHÔNG** chọn các option khác (README, .gitignore, license)
3. Click **Create repository**

## Bước 2: Push code lên GitHub

```bash
# Di chuyển vào thư mục dự án
cd d:\vien_lua

# Khởi tạo Git (nếu chưa có)
git init

# Thêm remote
git remote add origin https://github.com/your-username/vien-lua.git

# Commit và push
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

## Bước 3: Setup GitHub Secrets

GitHub Secrets lưu trữ thông tin nhạy cảm (SSH keys, passwords) để CI/CD có thể tự động deploy.

### 3.1. Vào Settings

**GitHub Repository** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 3.2. Tạo các Secrets sau

#### Secret 1: Docker Hub Credentials

**DOCKER_USERNAME**

- Name: `DOCKER_USERNAME`
- Value: Username Docker Hub của bạn
- Ví dụ: `tuanle2901`

**DOCKER_PASSWORD**

- Name: `DOCKER_PASSWORD`
- Value: Password hoặc Access Token Docker Hub
- Lấy ở: https://hub.docker.com/settings/security

#### Secret 2: EC2 SSH Information

**EC2_HOST**

- Name: `EC2_HOST`
- Value: IP public của EC2 instance
- Ví dụ: `54.123.45.67`

**EC2_USER**

- Name: `EC2_USER`
- Value: Username SSH
- Ví dụ: `ubuntu` (hoặc `ec2-user` cho Amazon Linux)

**EC2_SSH_KEY**

- Name: `EC2_SSH_KEY`
- Value: Nội dung file private key (.pem)

**Cách lấy EC2_SSH_KEY:**

Windows PowerShell:

```powershell
Get-Content your-key.pem | Out-String
```

Linux/Mac:

```bash
cat your-key.pem
```

Lưu ý: Copy toàn bộ từ `-----BEGIN RSA PRIVATE KEY-----` đến `-----END RSA PRIVATE KEY-----`

### 3.3. Tóm tắt Secrets cần tạo

| Secret Name       | Mô tả                     | Ví dụ                 |
| ----------------- | ------------------------- | --------------------- |
| `DOCKER_USERNAME` | Docker Hub username       | `your-dockerhub-user` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `dckr_pat_xxxxx`      |
| `EC2_HOST`        | EC2 IP public             | `54.123.45.67`        |
| `EC2_USER`        | SSH username              | `ubuntu`              |
| `EC2_SSH_KEY`     | Private key (.pem)        | `-----BEGIN RSA...`   |

## Bước 4: Kiểm tra CI/CD hoạt động

### 4.1. Push code để trigger CI/CD

```bash
# Sửa một file bất kỳ
echo "# Test CI/CD" >> README.md

# Commit và push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### 4.2. Theo dõi workflow

1. Vào GitHub Repository → Tab **Actions**
2. Xem workflow đang chạy
3. Click vào workflow để xem chi tiết

**Các jobs sẽ chạy:**

- ✅ **backend-build**: Build và test backend
- ✅ **frontend-build**: Build frontend
- ✅ **docker-build**: Build Docker images → Push lên Docker Hub
- ✅ **deploy**: SSH vào EC2 → Pull images mới → Restart containers

### 4.3. Các trạng thái

- 🟡 **In progress**: Đang chạy
- ✅ **Success**: Thành công (màu xanh)
- ❌ **Failure**: Thất bại (màu đỏ)

## Bước 5: Debug khi có lỗi

### Lỗi: Docker Hub login failed

**Nguyên nhân:** DOCKER_USERNAME hoặc DOCKER_PASSWORD sai

**Giải pháp:**

- Kiểm tra lại username Docker Hub
- Tạo Access Token mới tại: https://hub.docker.com/settings/security
- Update lại DOCKER_PASSWORD secret

### Lỗi: SSH connection failed

**Nguyên nhân:** Không kết nối được EC2

**Giải pháp:**

- Kiểm tra EC2_HOST có đúng IP không
- Kiểm tra EC2 Security Group đã mở port 22 (SSH)
- Kiểm tra EC2_SSH_KEY có đúng không (copy đầy đủ)

### Lỗi: Backend không start trên EC2

**Nguyên nhân:** File `.env` trên EC2 chưa có hoặc sai

**Giải pháp:**

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Kiểm tra file .env
cd ~/vien-lua
cat .env

# Kiểm tra logs
docker logs vien-lua-backend
```

## Workflow tự động hoạt động như thế nào?

```
Developer push code to GitHub (main branch)
                ↓
        GitHub Actions trigger
                ↓
    ┌───────────────────────┐
    │ 1. Build & Test       │
    │    - Backend build    │
    │    - Frontend build   │
    └───────────────────────┘
                ↓
    ┌───────────────────────┐
    │ 2. Build Docker Images│
    │    - Backend image    │
    │    - Frontend image   │
    └───────────────────────┘
                ↓
    ┌───────────────────────┐
    │ 3. Push to Docker Hub │
    │    - tuanle2901/      │
    │      vien-lua-backend │
    │      vien-lua-frontend│
    └───────────────────────┘
                ↓
    ┌───────────────────────┐
    │ 4. Deploy to EC2      │
    │    - SSH to EC2       │
    │    - Pull images      │
    │    - Restart containers│
    └───────────────────────┘
                ↓
         Deploy Success! ✅
```

## Tips

### Chỉ deploy khi push lên main

Workflow hiện tại chỉ deploy khi push lên branch `main`. Push lên branch khác sẽ chỉ build và test, không deploy.

### Xem logs chi tiết

Click vào từng job trong Actions tab để xem logs chi tiết từng bước.

### Tắt tạm thời CI/CD

Nếu muốn push code mà không trigger CI/CD, thêm `[skip ci]` vào commit message:

```bash
git commit -m "Update docs [skip ci]"
```

## Checklist hoàn thành

- [ ] Tạo GitHub Repository
- [ ] Push code lên GitHub
- [ ] Tạo 5 GitHub Secrets (DOCKER_USERNAME, DOCKER_PASSWORD, EC2_HOST, EC2_USER, EC2_SSH_KEY)
- [ ] Setup file `.env` trên EC2
- [ ] Test push code và xem workflow chạy
- [ ] Kiểm tra ứng dụng deploy thành công trên EC2

---

**Chúc bạn setup thành công!** 🚀
