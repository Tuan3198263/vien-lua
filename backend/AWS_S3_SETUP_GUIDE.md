# Hướng Dẫn Setup AWS S3 cho Module File Hệ Thống

## 📋 Tổng Quan

Module File Hệ Thống sử dụng **AWS S3** để lưu trữ file. Bạn cần:

1. Tạo tài khoản AWS (miễn phí)
2. Tạo S3 Bucket
3. Tạo IAM User và lấy Access Key
4. Cấu hình vào file `.env`

---

## 🚀 Bước 1: Đăng Ký AWS Account

1. Truy cập: https://aws.amazon.com/
2. Click **"Create an AWS Account"**
3. Điền thông tin:
   - Email
   - Password
   - AWS Account Name
   - Thông tin thanh toán (cần thẻ tín dụng, nhưng sẽ dùng **Free Tier**)
4. Hoàn tất đăng ký

> **Lưu ý:** AWS Free Tier bao gồm:
>
> - **5GB** storage trên S3
> - **20,000** GET requests
> - **2,000** PUT requests
> - **15GB** data transfer mỗi tháng
>
> → **Đủ cho dự án nhỏ/vừa hoàn toàn miễn phí!**

---

## 📦 Bước 2: Tạo S3 Bucket

### 2.1. Truy cập S3 Console

1. Đăng nhập AWS Console: https://console.aws.amazon.com/
2. Tìm kiếm **"S3"** trong thanh tìm kiếm
3. Click vào **"S3"** service

### 2.2. Tạo Bucket Mới

1. Click nút **"Create bucket"**
2. Điền thông tin:

   **General configuration:**
   - **Bucket name:** `vien-lua-files` (hoặc tên bạn muốn, phải unique toàn cầu)
   - **AWS Region:** `ap-southeast-2` (sedney )

   **Object Ownership:**
   - Chọn: **ACLs disabled (recommended)**

   **Block Public Access settings:**
   - ✅ **Giữ nguyên:** Block all public access
   - (File sẽ truy cập qua presigned URL, không public trực tiếp)

   **Bucket Versioning:**
   - Chọn: **Disable** (không cần version cho dự án này)

   **Default encryption:**
   - Chọn: **Server-side encryption with Amazon S3 managed keys (SSE-S3)**

3. Click **"Create bucket"**

### 2.3. Cấu Hình CORS (Nếu cần upload trực tiếp từ frontend)

1. Vào bucket vừa tạo
2. Tab **"Permissions"**
3. Scroll xuống **"Cross-origin resource sharing (CORS)"**
4. Click **"Edit"** và paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

5. Click **"Save changes"**

> **Lưu ý:** Trong production, thay `"*"` bằng domain cụ thể (vd: `"https://yourdomain.com"`)

---

## 🔑 Bước 3: Tạo IAM User và Lấy Access Key

### 3.1. Truy cập IAM Console

1. Tìm kiếm **"IAM"** trong thanh tìm kiếm AWS Console
2. Click vào **"IAM"** service

### 3.2. Tạo User Mới

1. Sidebar: Click **"Users"**
2. Click nút **"Create user"**
3. **User name:** `vien-lua-s3-user`
4. **Permissions options:** Chọn **"Attach policies directly"**
5. Tìm và chọn policy: **`AmazonS3FullAccess`**
   - (Hoặc tạo custom policy nếu muốn giới hạn quyền chỉ cho bucket cụ thể)
6. Click **"Next"** → **"Create user"**

### 3.3. Tạo Access Key

1. Click vào user vừa tạo (`vien-lua-s3-user`)
2. Tab **"Security credentials"**
3. Scroll xuống **"Access keys"**
4. Click **"Create access key"**
5. **Use case:** Chọn **"Application running outside AWS"**
6. Click **"Next"** → **"Create access key"**

7. **LƯU LẠI NGAY:**
   - ✅ **Access key ID:** `AKIAIOSFODNN7EXAMPLE` (ví dụ)
   - ✅ **Secret access key:** `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` (ví dụ)

   > ⚠️ **Cực kỳ quan trọng:** Secret key chỉ hiển thị 1 lần duy nhất!
   > Nếu mất → Phải tạo lại access key mới

8. Click **"Done"**

---

## ⚙️ Bước 4: Cấu Hình `.env`

Mở file `backend/.env` và cập nhật các biến sau:

```env
# AWS S3 Configuration
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=vien-lua-files
```

**Thay thế:**

- `AWS_REGION`: Region bạn chọn khi tạo bucket (vd: `ap-southeast-1`)
- `AWS_ACCESS_KEY_ID`: Access key ID từ bước 3.3
- `AWS_SECRET_ACCESS_KEY`: Secret access key từ bước 3.3
- `AWS_S3_BUCKET_NAME`: Tên bucket từ bước 2.2

---

## 🧪 Bước 5: Test Module

### 5.1. Chạy Backend

```bash
cd backend
npm run start:dev
```

### 5.2. Test API Upload (Dùng Postman/Thunder Client)

**Request:**

```
POST http://localhost:3001/api/file-he-thong/upload
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: multipart/form-data

Body (form-data):
  file: <chọn file>
  module: "TEST"
  ban_ghi_id: 1
  ten_truong: "file_test"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Upload file thành công",
  "data": {
    "id": 1,
    "ten_goc": "test.pdf",
    "ten_luu_tru": "test_1640995200000_a1b2c3d4.pdf",
    "kich_thuoc": 102400,
    "loai_file": "application/pdf",
    "url_xem": "https://vien-lua-file.s3.ap-southeast-2.amazonaws.com/test_1640995200000_a1b2c3d4.pdf?X-Amz-Algorithm=..."
  }
}
```

### 5.3. Kiểm Tra File Trên S3

1. Vào S3 Console
2. Vào bucket `vien-lua-file`
3. Bạn sẽ thấy file đã upload với tên unique

---

## 🔒 Bước 6: Best Practices (Tùy Chọn)

### 6.1. Tạo Custom IAM Policy (Giới Hạn Quyền)

Thay vì dùng `AmazonS3FullAccess`, tạo policy chỉ cho phép:

- Read/Write vào bucket cụ thể
- Không cho phép xóa bucket

**Custom Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::vien-lua-files",
        "arn:aws:s3:::vien-lua-files/*"
      ]
    }
  ]
}
```

**Cách áp dụng:**

1. IAM Console → Policies → Create policy
2. JSON tab → Paste policy trên (thay `vien-lua-files` bằng tên bucket của bạn)
3. Đặt tên policy: `VienLuaS3Policy`
4. Gán policy này cho user thay vì `AmazonS3FullAccess`

### 6.2. Setup Lifecycle Rules (Tự Động Xóa File Cũ)

Nếu muốn tự động xóa file sau X ngày:

1. Vào S3 bucket
2. Tab **"Management"**
3. Click **"Create lifecycle rule"**
4. Cấu hình:
   - Name: `DeleteOldFiles`
   - Rule scope: Apply to all objects
   - Lifecycle rule actions: ✅ Expire current versions of objects
   - Days after object creation: `365` (xóa file sau 1 năm)

---

## ❓ Troubleshooting

### Lỗi: "Access Denied"

**Nguyên nhân:** IAM User không có quyền S3
**Giải pháp:** Kiểm tra lại policy đã gán cho user

### Lỗi: "The specified bucket does not exist"

**Nguyên nhân:** Sai tên bucket hoặc region
**Giải pháp:** Kiểm tra `AWS_S3_BUCKET_NAME` và `AWS_REGION` trong `.env`

### Lỗi: "InvalidAccessKeyId"

**Nguyên nhân:** Access key không đúng
**Giải pháp:** Tạo lại access key mới và cập nhật vào `.env`

### File không thể access qua URL

**Nguyên nhân:** Bucket public access bị chặn
**Giải pháp:** Không cần thay đổi! Module sử dụng **presigned URL** nên vẫn access được

---

## 📝 Tóm Tắt

✅ **Đã setup:**

- AWS Account
- S3 Bucket: `vien-lua-files` (region: `ap-southeast-1`)
- IAM User: `vien-lua-s3-user`
- Access Key: Đã lưu vào `.env`

✅ **Backend đã sẵn sàng:**

- Module FileHeThong đã được implement
- APIs: Upload, Get, Delete file
- Tự động xóa file cũ khi upload file mới

✅ **Có thể sử dụng:**

- Tích hợp vào bất kỳ module nào cần upload file
- Ví dụ: HopDong, NhanVien, SanPham...

---

## 🔗 Links Hữu Ích

- AWS Free Tier: https://aws.amazon.com/free/
- S3 Pricing: https://aws.amazon.com/s3/pricing/
- IAM Best Practices: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- S3 SDK Documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/

---

**Chúc bạn setup thành công! 🎉**
