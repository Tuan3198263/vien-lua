# 🚀 Hướng dẫn Đẩy Code lên GitHub và Setup CI/CD

## 📋 Bước 1: Khởi tạo Git Repository (Local)

```powershell
# Mở terminal tại thư mục dự án
cd d:\vien_lua

# Khởi tạo Git repository
git init

# Thêm tất cả files vào staging
git add .

# Commit lần đầu
git commit -m "Initial commit: Setup project với React + NestJS + Docker"
```

## 📦 Bước 2: Tạo Repository trên GitHub

### 2.1. Tạo Repository mới

1. Truy cập: https://github.com/new
2. Điền thông tin:
   - **Repository name**: `vien-lua` (hoặc tên bạn muốn)
   - **Description**: "Dashboard quản lý với React + NestJS + TypeORM + Docker"
   - **Visibility**:
     - ✅ **Public** (nếu muốn public)
     - ✅ **Private** (nếu muốn riêng tư)
   - ⚠️ **KHÔNG** chọn "Add a README file"
   - ⚠️ **KHÔNG** chọn "Add .gitignore"
   - ⚠️ **KHÔNG** chọn "Choose a license"
3. Click **"Create repository"**

### 2.2. Kết nối với Remote Repository

GitHub sẽ hiển thị hướng dẫn. Chọn phần **"...or push an existing repository from the command line"**:

```powershell
# Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/vien-lua.git

# Đổi branch thành main (nếu đang là master)
git branch -M main

# Đẩy code lên GitHub
git push -u origin main
```

**Lưu ý**:

- Thay `YOUR_USERNAME` bằng username GitHub của bạn
- Thay `vien-lua` bằng tên repository bạn đã tạo

## 🔐 Bước 3: Setup GitHub Secrets cho CI/CD

### 3.1. Tại sao cần GitHub Secrets?

GitHub Secrets lưu trữ thông tin nhạy cảm (SSH keys, passwords) để CI/CD có thể deploy lên server mà không lộ thông tin.

### 3.2. Các Secrets cần tạo

Vào GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Tạo 3 secrets sau:

#### Secret 1: `EC2_HOST`

- **Name**: `EC2_HOST`
- **Value**: Địa chỉ IP public của EC2 instance
- **Ví dụ**: `54.123.45.67`

#### Secret 2: `EC2_USER`

- **Name**: `EC2_USER`
- **Value**: Username SSH (thường là `ubuntu`)
- **Ví dụ**: `ubuntu`

#### Secret 3: `EC2_SSH_KEY`

- **Name**: `EC2_SSH_KEY`
- **Value**: Nội dung file private key (.pem)
- **Cách lấy**:

  ```powershell
  # Trên Windows
  Get-Content your-key.pem | Out-String

  # Hoặc mở file .pem bằng notepad và copy toàn bộ
  ```

- **Lưu ý**: Copy từ `-----BEGIN RSA PRIVATE KEY-----` đến `-----END RSA PRIVATE KEY-----`

### 3.3. Secrets cho Database (Tùy chọn)

Nếu muốn bảo mật thông tin database, thêm các secrets:

- `DB_HOST`: `sql.freedb.tech`
- `DB_USER`: `freedb_tuanle2901`
- `DB_PASSWORD`: `8KWDRXuY!AbwG%S`
- `DB_NAME`: `freedb_vien_lua`

## ✅ Bước 4: Kiểm tra CI/CD hoạt động

### 4.1. Xem Actions Tab

1. Vào repository trên GitHub
2. Click tab **"Actions"**
3. Bạn sẽ thấy:
   - Danh sách các workflows
   - Lịch sử chạy
   - Status: ✅ Success, ❌ Failed, 🟡 In progress

### 4.2. Trigger CI/CD lần đầu

**Cách 1: Push code mới**

```powershell
# Sửa một file bất kỳ
echo "# Test CI/CD" >> README.md

# Commit và push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

**Cách 2: Manually trigger (nếu có setup)**

- Vào Actions → Chọn workflow → **"Run workflow"**

### 4.3. Theo dõi workflow

1. Sau khi push code, vào tab **Actions**
2. Click vào workflow run mới nhất
3. Xem từng job:

   - ✅ **backend-build**: Build và test backend
   - ✅ **frontend-build**: Build và test frontend
   - ✅ **docker-build**: Build Docker images
   - ✅ **deploy**: Deploy lên EC2

4. Click vào từng job để xem logs chi tiết

### 4.4. Các trạng thái workflow

- 🟡 **Queued**: Đang chờ
- 🔵 **In progress**: Đang chạy
- ✅ **Success**: Thành công (màu xanh)
- ❌ **Failure**: Thất bại (màu đỏ)
- ⚫ **Cancelled**: Đã hủy

## 🔧 Bước 5: Debug nếu CI/CD fail

### 5.1. Kiểm tra logs

Click vào job bị fail → Xem logs → Tìm dòng lỗi (thường có màu đỏ)

### 5.2. Lỗi thường gặp

#### Lỗi 1: GitHub Secrets chưa setup

```
Error: Input required and not supplied: key
```

**Giải pháp**: Kiểm tra lại GitHub Secrets đã tạo đúng tên chưa

#### Lỗi 2: SSH connection failed

```
ssh: connect to host x.x.x.x port 22: Connection timed out
```

**Giải pháp**:

- Kiểm tra EC2 Security Group đã mở port 22
- Kiểm tra `EC2_HOST` có đúng IP không

#### Lỗi 3: Build failed

```
npm ERR! code ELIFECYCLE
```

**Giải pháp**:

- Kiểm tra `package.json` có đúng không
- Chạy thử local: `npm install && npm run build`

#### Lỗi 4: Permission denied

```
Permission denied (publickey)
```

**Giải pháp**:

- Kiểm tra `EC2_SSH_KEY` có đúng nội dung không
- Đảm bảo copy đầy đủ từ BEGIN đến END

### 5.3. Test deploy manual trước

Nếu CI/CD fail, test manual trước:

```powershell
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone repo
cd ~
git clone https://github.com/YOUR_USERNAME/vien-lua.git
cd vien-lua

# Chạy docker compose
docker-compose up -d --build
```

## 📊 Bước 6: Theo dõi sau khi deploy

### 6.1. Verify deployment thành công

```powershell
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Kiểm tra containers
docker-compose ps

# Kiểm tra logs
docker-compose logs -f

# Test API
curl http://localhost:3001/api
```

### 6.2. Status Badge

Thêm badge vào README để hiển thị status:

```markdown
![CI/CD Status](https://github.com/YOUR_USERNAME/vien-lua/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## 🎯 Workflow hoạt động như thế nào?

```
Developer push code
         ↓
GitHub Actions trigger
         ↓
   ┌─────────────┐
   │ 1. Backend  │ → npm install → build → test
   │    Build    │
   └─────────────┘
         ↓
   ┌─────────────┐
   │ 2. Frontend │ → npm install → build
   │    Build    │
   └─────────────┘
         ↓
   ┌─────────────┐
   │ 3. Docker   │ → Build backend image
   │    Build    │ → Build frontend image
   └─────────────┘
         ↓
   ┌─────────────┐
   │ 4. Deploy   │ → SSH to EC2
   │    to EC2   │ → Pull latest code
   └─────────────┘ → docker-compose up
         ↓
   Deploy Success! ✅
```

## 📝 Checklist hoàn thành

- [ ] Khởi tạo Git local
- [ ] Tạo repository trên GitHub
- [ ] Push code lên GitHub
- [ ] Setup 3 GitHub Secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY)
- [ ] Kiểm tra tab Actions
- [ ] Push code để trigger CI/CD
- [ ] Xem workflow chạy thành công
- [ ] Verify deployment trên EC2

## 💡 Tips

### Tạm thời tắt CI/CD (nếu chưa có EC2)

Nếu chưa có EC2 để deploy, bạn có thể comment out job `deploy`:

**File: `.github/workflows/deploy.yml`**

```yaml
# deploy:
#   name: Deploy to AWS EC2
#   runs-on: ubuntu-latest
#   needs: [docker-build]
#   if: github.ref == 'refs/heads/main'
#   steps:
#     ...
```

Như vậy chỉ chạy build và test, không deploy.

### Chạy CI/CD cho branch develop

Workflow hiện tại chỉ deploy khi push lên `main`. Để test trên `develop`:

```yaml
on:
  push:
    branches:
      - main
      - develop # Thêm dòng này
```

### Notification khi deploy

Thêm vào cuối workflow để nhận thông báo:

```yaml
- name: Send notification
  if: always()
  run: |
    echo "Deployment finished with status: ${{ job.status }}"
```

## 🆘 Cần trợ giúp?

1. Xem logs trong Actions tab
2. Kiểm tra file `.github/workflows/deploy.yml`
3. Test manual deploy trước
4. Đảm bảo tất cả secrets đã setup

---

**Chúc bạn deploy thành công!** 🚀
