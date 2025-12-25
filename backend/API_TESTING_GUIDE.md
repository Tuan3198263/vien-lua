# Hướng Dẫn Test API Trên Postman

## Mục Lục

1. [Chuẩn Bị](#chuẩn-bị)
2. [API Vai Trò](#api-vai-trò)
3. [API Authentication](#api-authentication)
4. [API Người Dùng](#api-người-dùng)

---

## Chuẩn Bị

### 1. Khởi Động Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### 2. Cấu Hình Postman

#### 2.1. Tạo Environment trong Postman

- Tên: `Vien Lua Development`
- Variables:
  - `base_url`: `http://localhost:3001/api`
  - `access_token`: (sẽ tự động set sau khi login)

#### 2.2. Import Collection (Tùy chọn)

Bạn có thể tạo một Collection tên `Vien Lua API` để quản lý các request.

---

## API Vai Trò

### 1. Tạo Vai Trò Mới

**Request:**

- Method: `POST`
- URL: `{{base_url}}/vai-tro`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON):
  ```json
  {
    "ma_vai_tro": "ADMIN",
    "ten_vai_tro": "Quản trị viên",
    "mo_ta": "Vai trò quản trị hệ thống"
  }
  ```

**Response Thành Công (201):**

```json
{
  "id": 1,
  "ma_vai_tro": "ADMIN",
  "ten_vai_tro": "Quản trị viên",
  "mo_ta": "Vai trò quản trị hệ thống",
  "ngay_tao": "2024-12-25T10:30:00.000Z",
  "ngay_cap_nhat": "2024-12-25T10:30:00.000Z"
}
```

---

### 2. Lấy Danh Sách Vai Trò

**Request:**

- Method: `GET`
- URL: `{{base_url}}/vai-tro`
- Query Parameters (tất cả đều optional):
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số bản ghi/trang (mặc định: 10, max: 100)
  - `sort_field`: Trường sắp xếp (vd: `ngay_tao`, `ten_vai_tro`)
  - `sort_order`: Thứ tự sắp xếp (`ASC` hoặc `DESC`)
  - `search`: Từ khóa tìm kiếm

**Ví dụ:**

- Lấy trang 1, 10 bản ghi: `{{base_url}}/vai-tro?page=1&limit=10`
- Tìm kiếm: `{{base_url}}/vai-tro?search=admin`
- Sắp xếp theo tên: `{{base_url}}/vai-tro?sort_field=ten_vai_tro&sort_order=ASC`

**Response Thành Công (200):**

```json
{
  "data": [
    {
      "id": 1,
      "ma_vai_tro": "ADMIN",
      "ten_vai_tro": "Quản trị viên",
      "mo_ta": "Vai trò quản trị hệ thống",
      "ngay_tao": "2024-12-25T10:30:00.000Z",
      "ngay_cap_nhat": "2024-12-25T10:30:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1,
    "has_previous": false,
    "has_next": false
  }
}
```

---

### 3. Lấy Chi Tiết Một Vai Trò

**Request:**

- Method: `GET`
- URL: `{{base_url}}/vai-tro/1`
- Headers:
  ```
  Authorization: Bearer {{access_token}}
  ```

**Response Thành Công (200):**

```json
{
  "id": 1,
  "ma_vai_tro": "ADMIN",
  "ten_vai_tro": "Quản trị viên",
  "mo_ta": "Vai trò quản trị hệ thống",
  "ngay_tao": "2024-12-25T10:30:00.000Z",
  "ngay_cap_nhat": "2024-12-25T10:30:00.000Z"
}
```

---

### 4. Cập Nhật Vai Trò

**Request:**

- Method: `PATCH`
- URL: `{{base_url}}/vai-tro/1`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON):
  ```json
  {
    "ten_vai_tro": "Quản trị viên cấp cao",
    "mo_ta": "Vai trò quản trị hệ thống cấp cao"
  }
  ```

**Response Thành Công (200):**

```json
{
  "id": 1,
  "ma_vai_tro": "ADMIN",
  "ten_vai_tro": "Quản trị viên cấp cao",
  "mo_ta": "Vai trò quản trị hệ thống cấp cao",
  "ngay_tao": "2024-12-25T10:30:00.000Z",
  "ngay_cap_nhat": "2024-12-25T11:00:00.000Z"
}
```

---

### 5. Xóa Một Vai Trò

**Request:**

- Method: `DELETE`
- URL: `{{base_url}}/vai-tro/1`
- Headers:
  ```
  Authorization: Bearer {{access_token}}
  ```

**Response Thành Công (200):**

```json
{
  "message": "Xóa vai trò thành công"
}
```

---

### 6. Xóa Nhiều Vai Trò

**Request:**

- Method: `DELETE`
- URL: `{{base_url}}/vai-tro`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON):
  ```json
  {
    "ids": [1, 2, 3]
  }
  ```

**Response Thành Công (200):**

```json
{
  "message": "Xóa vai trò thành công",
  "count": 3
}
```

---

## API Authentication

### 1. Đăng Ký Tài Khoản

**Request:**

- Method: `POST`
- URL: `{{base_url}}/nguoi-dung/auth/register`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
    "tai_khoan": "john_doe",
    "mat_khau": "123456",
    "ho_ten": "John Doe",
    "email": "john@example.com"
  }
  ```

**Response Thành Công (201):**

```json
{
  "message": "Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.",
  "user": {
    "id": 1,
    "tai_khoan": "john_doe",
    "ho_ten": "John Doe",
    "email": "john@example.com",
    "vai_tro": {
      "id": 1,
      "ma_vai_tro": "USER",
      "ten_vai_tro": "Người dùng"
    }
  }
}
```

**Lưu ý:** Sau khi đăng ký thành công, bạn cần đăng nhập để lấy `access_token`.

---

### 2. Đăng Nhập

**Request:**

- Method: `POST`
- URL: `{{base_url}}/nguoi-dung/auth/login`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
    "tai_khoan": "john_doe",
    "mat_khau": "123456"
  }
  ```

**Response Thành Công (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "tai_khoan": "john_doe",
    "ho_ten": "John Doe",
    "email": "john@example.com",
    "vai_tro": {
      "id": 1,
      "ma_vai_tro": "USER",
      "ten_vai_tro": "Người dùng"
    }
  }
}
```

**Script để tự động lưu token (Tests tab trong Postman):**

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set("access_token", jsonData.access_token);
}
```

---

### 3. Lấy Thông Tin Profile

**Request:**

- Method: `GET`
- URL: `{{base_url}}/nguoi-dung/auth/profile`
- Headers:
  ```
  Authorization: Bearer {{access_token}}
  ```

**Response Thành Công (200):**

```json
{
  "id": 1,
  "tai_khoan": "john_doe",
  "ho_ten": "John Doe",
  "email": "john@example.com",
  "sdt": null,
  "ngay_sinh": null,
  "gioi_tinh": null,
  "dia_chi": null,
  "ghi_chu": null,
  "vai_tro": {
    "id": 1,
    "ma_vai_tro": "USER",
    "ten_vai_tro": "Người dùng"
  },
  "ngay_tao": "2024-12-25T10:30:00.000Z",
  "ngay_cap_nhat": "2024-12-25T10:30:00.000Z"
}
```

---

### 4. Đổi Mật Khẩu

**Request:**

- Method: `POST`
- URL: `{{base_url}}/nguoi-dung/auth/change-password`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON):
  ```json
  {
    "mat_khau_cu": "123456",
    "mat_khau_moi": "654321"
  }
  ```

**Response Thành Công (200):**

```json
{
  "message": "Đổi mật khẩu thành công"
}
```

---

## API Người Dùng

### 1. Tạo Người Dùng Mới (bởi Admin)

**Request:**

- Method: `POST`
- URL: `{{base_url}}/nguoi-dung`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON):
  ```json
  {
    "tai_khoan": "jane_smith",
    "mat_khau": "123456",
    "ho_ten": "Jane Smith",
    "email": "jane@example.com",
    "sdt": "0123456789",
    "ngay_sinh": "1990-05-15",
    "gioi_tinh": "Nữ",
    "dia_chi": "123 Main St, Hanoi",
    "ghi_chu": "VIP Customer",
    "vai_tro_id": 1
  }
  ```

**Response Thành Công (201):**

```json
{
  "id": 2,
  "tai_khoan": "jane_smith",
  "ho_ten": "Jane Smith",
  "email": "jane@example.com",
  "sdt": "0123456789",
  "ngay_sinh": "1990-05-15",
  "gioi_tinh": "Nữ",
  "dia_chi": "123 Main St, Hanoi",
  "ghi_chu": "VIP Customer",
  "vai_tro": {
    "id": 1,
    "ma_vai_tro": "USER",
    "ten_vai_tro": "Người dùng"
  },
  "ngay_tao": "2024-12-25T11:00:00.000Z",
  "ngay_cap_nhat": "2024-12-25T11:00:00.000Z"
}
```

---

### 2. Lấy Danh Sách Người Dùng

**Request:**

- Method: `GET`
- URL: `{{base_url}}/nguoi-dung`
- Headers:
  ```
  Authorization: Bearer {{access_token}}
  ```
- Query Parameters (tất cả đều optional):
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số bản ghi/trang (mặc định: 10)
  - `sort_field`: Trường sắp xếp (vd: `ngay_tao`, `ho_ten`)
  - `sort_order`: Thứ tự sắp xếp (`ASC` hoặc `DESC`)
  - `search`: Tìm kiếm theo tài khoản, họ tên, email, sdt

**Ví dụ:**

```
{{base_url}}/nguoi-dung?page=1&limit=10&search=john&sort_field=ho_ten&sort_order=ASC
```

**Response Thành Công (200):**

```json
{
  "data": [
    {
      "id": 1,
      "tai_khoan": "john_doe",
      "ho_ten": "John Doe",
      "email": "john@example.com",
      "sdt": null,
      "ngay_sinh": null,
      "gioi_tinh": null,
      "dia_chi": null,
      "ghi_chu": null,
      "vai_tro": {
        "id": 1,
        "ma_vai_tro": "USER",
        "ten_vai_tro": "Người dùng"
      },
      "ngay_tao": "2024-12-25T10:30:00.000Z",
      "ngay_cap_nhat": "2024-12-25T10:30:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1,
    "has_previous": false,
    "has_next": false
  }
}
```

---

### 3. Lấy Chi Tiết Một Người Dùng

**Request:**

- Method: `GET`
- URL: `{{base_url}}/nguoi-dung/1`
- Headers:
  ```
  Authorization: Bearer {{access_token}}
  ```

**Response Thành Công (200):**

```json
{
  "id": 1,
  "tai_khoan": "john_doe",
  "ho_ten": "John Doe",
  "email": "john@example.com",
  "sdt": null,
  "ngay_sinh": null,
  "gioi_tinh": null,
  "dia_chi": null,
  "ghi_chu": null,
  "vai_tro": {
    "id": 1,
    "ma_vai_tro": "USER",
    "ten_vai_tro": "Người dùng"
  },
  "ngay_tao": "2024-12-25T10:30:00.000Z",
  "ngay_cap_nhat": "2024-12-25T10:30:00.000Z"
}
```

---

### 4. Cập Nhật Người Dùng

**Request:**

- Method: `PATCH`
- URL: `{{base_url}}/nguoi-dung/1`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON - chỉ cần gửi các field muốn cập nhật):
  ```json
  {
    "ho_ten": "John Doe Updated",
    "sdt": "0987654321",
    "dia_chi": "456 New Address"
  }
  ```

**Response Thành Công (200):**

```json
{
  "id": 1,
  "tai_khoan": "john_doe",
  "ho_ten": "John Doe Updated",
  "email": "john@example.com",
  "sdt": "0987654321",
  "ngay_sinh": null,
  "gioi_tinh": null,
  "dia_chi": "456 New Address",
  "ghi_chu": null,
  "vai_tro": {
    "id": 1,
    "ma_vai_tro": "USER",
    "ten_vai_tro": "Người dùng"
  },
  "ngay_tao": "2024-12-25T10:30:00.000Z",
  "ngay_cap_nhat": "2024-12-25T12:00:00.000Z"
}
```

---

### 5. Xóa Một Người Dùng

**Request:**

- Method: `DELETE`
- URL: `{{base_url}}/nguoi-dung/1`
- Headers:
  ```
  Authorization: Bearer {{access_token}}
  ```

**Response Thành Công (200):**

```json
{
  "message": "Xóa người dùng thành công"
}
```

---

### 6. Xóa Nhiều Người Dùng

**Request:**

- Method: `DELETE`
- URL: `{{base_url}}/nguoi-dung`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- Body (raw JSON):
  ```json
  {
    "ids": [1, 2, 3]
  }
  ```

**Response Thành Công (200):**

```json
{
  "message": "Xóa người dùng thành công",
  "count": 3
}
```

---

## Các Lỗi Thường Gặp

### 1. 401 Unauthorized

**Lỗi:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Nguyên nhân:** Token không hợp lệ hoặc đã hết hạn.

**Giải pháp:** Đăng nhập lại để lấy token mới.

---

### 2. 400 Bad Request

**Lỗi:**

```json
{
  "statusCode": 400,
  "message": ["Email không đúng định dạng", "Mật khẩu phải có ít nhất 6 ký tự"],
  "error": "Bad Request"
}
```

**Nguyên nhân:** Dữ liệu gửi lên không hợp lệ (không đúng validation).

**Giải pháp:** Kiểm tra lại dữ liệu trong Body theo đúng format yêu cầu.

---

### 3. 404 Not Found

**Lỗi:**

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy người dùng với ID 999"
}
```

**Nguyên nhân:** Resource không tồn tại.

**Giải pháp:** Kiểm tra lại ID trong URL.

---

### 4. 409 Conflict

**Lỗi:**

```json
{
  "statusCode": 409,
  "message": "Tài khoản hoặc email đã tồn tại"
}
```

**Nguyên nhân:** Dữ liệu bị trùng lặp (unique constraint).

**Giải pháp:** Sử dụng tài khoản hoặc email khác.

---

## Testing Workflow Đề Xuất

### Bước 1: Setup Vai Trò

1. Tạo vai trò USER (nếu chưa có)
2. Tạo vai trò ADMIN (nếu cần)

### Bước 2: Test Authentication

1. Đăng ký tài khoản mới
2. Đăng nhập để lấy token
3. Lấy thông tin profile
4. Đổi mật khẩu

### Bước 3: Test CRUD Vai Trò

1. Lấy danh sách vai trò
2. Tạo vai trò mới
3. Cập nhật vai trò
4. Xóa vai trò

### Bước 4: Test CRUD Người Dùng

1. Lấy danh sách người dùng
2. Tạo người dùng mới (admin)
3. Cập nhật người dùng
4. Xóa người dùng

### Bước 5: Test Pagination & Search

1. Test phân trang với các giá trị page và limit khác nhau
2. Test tìm kiếm với từ khóa
3. Test sắp xếp theo các trường khác nhau

---

## Lưu Ý Quan Trọng

1. **Token Expiration:** Token có thời hạn 24 giờ. Sau khi hết hạn cần đăng nhập lại.

2. **CORS:** Backend đã bật CORS, có thể gọi từ bất kỳ origin nào.

3. **Validation:** Tất cả API đều có validation. Đọc kỹ message lỗi để biết field nào không hợp lệ.

4. **Cascade Delete:** Khi xóa vai trò, cần chú ý có người dùng nào đang sử dụng vai trò đó không.

5. **Password Hashing:** Mật khẩu được hash tự động bằng bcrypt, không bao giờ lưu plain text.

6. **Date Format:** Ngày sinh sử dụng format ISO 8601: `YYYY-MM-DD`

7. **Giới Tính:** Chỉ chấp nhận 3 giá trị: `Nam`, `Nữ`, `Khác`

---

## Troubleshooting

### Backend không chạy được?

- Kiểm tra đã cài đặt dependencies: `npm install`
- Kiểm tra database đã được cấu hình đúng trong file `.env`
- Kiểm tra MySQL server đã chạy chưa

### Token không hoạt động?

- Kiểm tra format: `Bearer <token>`
- Kiểm tra token đã hết hạn chưa
- Đăng nhập lại để lấy token mới

### API trả về lỗi validation?

- Đọc kỹ message lỗi
- Kiểm tra lại format của request body
- So sánh với ví dụ trong tài liệu này

---

**Chúc bạn test API thành công! 🚀**
