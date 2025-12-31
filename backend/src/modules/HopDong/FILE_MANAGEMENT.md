# Quản Lý File Hợp Đồng

## Kiến Trúc

### ❌ KHÔNG có trường file trong HopDong Entity

- Entity `HopDong` chỉ chứa thông tin hợp đồng cốt lõi
- Không có trường `file_hop_dong`, `file_path`, hay `file_name`
- File được quản lý hoàn toàn qua bảng `file_he_thong`

### ✅ Quản lý file qua FileHeThong

File được liên kết với hợp đồng thông qua:

- `module`: 'HOP_DONG'
- `ban_ghi_id`: ID của hợp đồng
- `ten_truong`: 'file_hop_dong'

**Unique constraint**: Mỗi hợp đồng chỉ có 1 file duy nhất (module + ban_ghi_id + ten_truong)

## API Endpoints

### ✅ Tất cả thao tác file qua API Hợp Đồng

#### 1. Tạo Hợp Đồng + Upload File

```
POST /api/hop-dong
Content-Type: multipart/form-data

Body:
- so_hop_dong: string (required)
- doi_tac: string (required)
- ghi_chu: string (optional)
- file: binary (optional)
```

**Flow**:

1. Tạo hợp đồng
2. Upload file (nếu có) → lưu vào `file_he_thong`
3. Trả về hợp đồng + thông tin file

#### 2. Lấy Danh Sách Hợp Đồng

```
GET /api/hop-dong?page=1&limit=10&so_hop_dong=...
```

**Response**: Mỗi hợp đồng kèm theo:

```json
{
  "id": 1,
  "so_hop_dong": "HD-2025-001",
  "doi_tac": "Công ty ABC",
  "file_hop_dong": {
    "id": 10,
    "ten_goc": "hop-dong-abc.pdf",
    "url_xem": "https://s3.amazonaws.com/..."
  }
}
```

**Lưu ý**: File info bao gồm URL để frontend có thể view trực tiếp

#### 3. Lấy Chi Tiết Hợp Đồng

```
GET /api/hop-dong/:id
```

**Response**: Hợp đồng kèm file (không có URL):

```json
{
  "id": 1,
  "so_hop_dong": "HD-2025-001",
  "file_hop_dong": {
    "id": 10,
    "ten_goc": "hop-dong-abc.pdf"
  }
}
```

**Lưu ý**: Không include URL để tiết kiệm tài nguyên (không generate presigned URL không cần thiết)

#### 4. Cập Nhật Hợp Đồng + File

```
PATCH /api/hop-dong/:id
Content-Type: multipart/form-data

Body:
- so_hop_dong: string (optional)
- doi_tac: string (optional)
- ghi_chu: string (optional)
- file: binary (optional - upload file mới)
- xoa_file: boolean (optional - xóa file hiện tại)
```

**Flow**:

1. Cập nhật thông tin hợp đồng
2. Nếu `xoa_file=true`: xóa file hiện tại
3. Nếu có `file` mới: upload và ghi đè file cũ
4. Trả về hợp đồng + file info

**Lưu ý**: Upload file mới sẽ tự động ghi đè file cũ (unique constraint)

#### 5. Xóa Hợp Đồng

```
DELETE /api/hop-dong/:id
```

**Flow**:

1. Xóa tất cả file liên quan (qua `xoaFileCuaBanGhi`)
2. Xóa hợp đồng
3. Trả về thông báo thành công

### ❌ KHÔNG có các endpoint file riêng lẻ

Các endpoint này **KHÔNG** tồn tại:

- ~~`POST /api/hop-dong/:id/upload-file`~~
- ~~`DELETE /api/hop-dong/:id/delete-file`~~
- ~~`GET /api/hop-dong/:id/file`~~

**Lý do**: Tất cả thao tác file đều được thực hiện qua các endpoint chính của hợp đồng để:

- Code clean hơn
- Đảm bảo tính nhất quán
- Dễ bảo trì và mở rộng

## Service Methods

### Public Methods

#### `findAll(filterDto)`

- Trả về danh sách hợp đồng có phân trang
- **Bao gồm**: file info với URL (id, ten_goc, url_xem)
- Sử dụng Promise.all để lấy file parallel

#### `findOne(id)`

- Trả về hợp đồng cơ bản
- **Không** bao gồm file info

#### `findOneWithFile(id)`

- Trả về hợp đồng + file info
- **Bao gồm**: id, ten_goc (không có URL)

#### `create(dto, userId)`

- Tạo hợp đồng mới
- **Không** xử lý file (do controller xử lý)

#### `update(id, dto, userId)`

- Cập nhật hợp đồng
- **Không** xử lý file (do controller xử lý)

#### `remove(id)`

- Xóa hợp đồng
- **Tự động xóa file** qua FileHeThongService

### Private Methods

#### `layFileCuaHopDong(hopDongId)`

- Method private để lấy file kèm URL
- Sử dụng trong `findAll()`
- Gọi `fileHeThongService.layFile()`

## Best Practices

### ✅ Nên làm

1. Luôn upload/xóa file qua API hợp đồng
2. Sử dụng multipart/form-data cho create/update
3. Kiểm tra file tồn tại trước khi xóa
4. Log lỗi file nhưng không block operation chính

### ❌ Không nên làm

1. Tạo trường file trong HopDong entity
2. Tạo endpoint file riêng lẻ
3. Query file trong mọi request (chỉ khi cần)
4. Throw error khi file operation fail (log thay vì)

## Module Mở Rộng Sau Này

Cấu trúc này được thiết kế để áp dụng cho tất cả module có file:

```typescript
// Module ABC có file
export class ModuleABC {
  // Không có trường file trong entity

  async findAll() {
    // Lấy file kèm URL cho danh sách
    const files = await this.layFileCuaModuleABC(ids);
  }

  async findOne() {
    // Lấy file không cần URL cho chi tiết
    const file = await this.fileService.layFile({
      module: "MODULE_ABC",
      ban_ghi_id: id,
      ten_truong: "file_xyz",
    });
  }

  async remove() {
    // Xóa file trước khi xóa bản ghi
    await this.fileService.xoaFileCuaBanGhi({
      module: "MODULE_ABC",
      ban_ghi_id: id,
    });
  }
}
```

## Tối Ưu Hiệu Năng

### Danh Sách (findAll)

- Lấy file parallel với Promise.all
- Chỉ lấy field cần thiết (id, ten_goc, url_xem)
- Generate presigned URL (expire sau 1h)

### Chi Tiết (findOne)

- **Không** generate URL nếu không cần
- Chỉ lấy id và tên file
- Giảm request đến S3

### Xóa (remove)

- Xóa file trước (cleanup)
- Không block nếu file không tồn tại
- Log error nhưng vẫn xóa hợp đồng

## Lợi Ích Kiến Trúc Này

1. **Đơn giản**: Không cần maintain trường file trong entity
2. **Linh hoạt**: Dễ dàng thêm nhiều file cho 1 hợp đồng
3. **Tách biệt**: Logic file độc lập với logic hợp đồng
4. **Nhất quán**: Tất cả module dùng chung cách quản lý file
5. **Tiết kiệm**: Chỉ generate URL khi thực sự cần
6. **Clean**: Không có endpoint file riêng lẻ
