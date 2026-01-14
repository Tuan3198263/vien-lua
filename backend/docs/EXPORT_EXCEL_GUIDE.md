# Hướng dẫn Export Excel API

## 📋 Tổng quan tính năng

Tính năng **Export Excel** cho phép xuất danh sách đề tài ra file Excel (.xlsx) với đầy đủ bộ lọc và sắp xếp, giống như API lấy danh sách nhưng **không có phân trang**.

### Đặc điểm chính:

- ✅ **Hỗ trợ filter đầy đủ**: search, sort, filter theo các field
- ✅ **Không phân trang**: Export toàn bộ kết quả (tối đa 10,000 bản ghi)
- ✅ **File Excel định dạng**: Header màu xám, border, auto-filter
- ✅ **Tên file tự động**: `DanhSachDeTai_YYYY-MM-DD.xlsx`
- ✅ **Yêu cầu quyền**: Phải có quyền `XEM` module `DE_TAI`

---

## 🎯 Cách hoạt động

### Flow xử lý:

```
1. Client gọi GET /api/de-tai/export?search=xxx&sort=xxx
                    ↓
2. Backend kiểm tra quyền XEM của user
                    ↓
3. DeTaiService.layDanhSachExport(filterDto)
   - Tạo query builder với filter
   - KHÔNG áp dụng phân trang (page/limit)
   - Kiểm tra giới hạn 10,000 bản ghi
   - Trả về mảng dữ liệu đầy đủ
                    ↓
4. ExcelUtils.generateExcel(data, columns, sheetName)
   - Tạo workbook + worksheet
   - Thêm header với style (bold, màu xám)
   - Thêm dữ liệu từ mảng
   - Thêm border và auto-filter
   - Trả về Buffer
                    ↓
5. Controller set response headers:
   - Content-Type: Excel file
   - Content-Disposition: attachment (download)
   - Content-Length: Kích thước file
                    ↓
6. Browser tự động download file
```

### Các thành phần:

1. **ExcelUtils** (`backend/src/shared/utils/excel.utils.ts`):
   - Class tiện ích tái sử dụng
   - Method: `generateExcel(data, columns, sheetName)`
   - Sử dụng thư viện `exceljs`
   - Hỗ trợ nested fields (ví dụ: `nguoi_cap_nhat.ho_ten`)

2. **DeTaiService.layDanhSachExport()**:
   - Copy logic từ `layDanhSach()`
   - Bỏ phân trang (skip/take)
   - Giữ nguyên filter và sort
   - Kiểm tra max 10,000 bản ghi

3. **DeTaiController.export()**:
   - Endpoint: `GET /api/de-tai/export`
   - Guard: JWT + Permission (XEM)
   - Set response headers
   - Trả về Buffer (file download)

---

## 🔌 API Endpoint

### Request

```
GET /api/de-tai/export
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters** (Tất cả optional):

| Parameter            | Type   | Mô tả                                          | Ví dụ                         |
| -------------------- | ------ | ---------------------------------------------- | ----------------------------- |
| `search`             | string | Tìm kiếm theo tên đề tài, mã đề tài, chủ nhiệm | `search=lúa`                  |
| `sort`               | string | Sắp xếp (format: `field:order`)                | `sort=ngay_tao:DESC`          |
| `cap_quan_ly_de_tai` | string | Filter theo cấp quản lý                        | `cap_quan_ly_de_tai=Cấp bộ`   |
| `linh_vuc_khoa_hoc`  | string | Filter theo lĩnh vực                           | `linh_vuc_khoa_hoc=Di truyền` |
| `nguon_goc_de_tai`   | string | Filter theo nguồn gốc                          | `nguon_goc_de_tai=Nhà nước`   |
| _...các filter khác_ | string | Bất kỳ field nào trong `allowedFields`         |                               |

### Response

**Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

**Content-Disposition:** `attachment; filename="DanhSachDeTai_2026-01-14.xlsx"`

**Body:** Binary (Excel file buffer)

### Cột trong file Excel:

| STT | Cột              | Width | Key                     |
| --- | ---------------- | ----- | ----------------------- |
| 1   | STT              | 8     | `id`                    |
| 2   | Mã đề tài        | 15    | `ma_de_tai`             |
| 3   | Tên đề tài       | 45    | `ten_de_tai`            |
| 4   | Chủ nhiệm        | 25    | `chu_nhiem_de_tai`      |
| 5   | Thư ký           | 25    | `thu_ky_de_tai`         |
| 6   | Cấp quản lý      | 20    | `cap_quan_ly_de_tai`    |
| 7   | Lĩnh vực         | 25    | `linh_vuc_khoa_hoc`     |
| 8   | Nguồn gốc        | 25    | `nguon_goc_de_tai`      |
| 9   | Đơn vị phê duyệt | 30    | `don_vi_phe_duyet`      |
| 10  | Ngày bắt đầu     | 15    | `ngay_bat_dau`          |
| 11  | Ngày kết thúc    | 15    | `ngay_ket_thuc`         |
| 12  | Người cập nhật   | 25    | `nguoi_cap_nhat.ho_ten` |

---

## 🧪 Test với Postman

### Bước 1: Đăng nhập để lấy token

**Request:**

```
POST http://localhost:3001/api/nguoi-dung/dang-nhap
Content-Type: application/json

{
  "ten_dang_nhap": "admin",
  "mat_khau": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

Copy `accessToken` để dùng cho các request sau.

### Bước 2: Test export (không filter)

**Request:**

```
GET http://localhost:3001/api/de-tai/export
Authorization: Bearer <ACCESS_TOKEN>
```

**Postman Settings:**

1. Method: `GET`
2. URL: `http://localhost:3001/api/de-tai/export`
3. Headers:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGci...` (paste token từ bước 1)
4. Ấn **Send**
5. Postman sẽ nhận file binary → Click **Save Response** → **Save to file**

**Kết quả:** File `DanhSachDeTai_2026-01-14.xlsx` được download

### Bước 3: Test export với filter

**Request:**

```
GET http://localhost:3001/api/de-tai/export?search=lúa&sort=ngay_tao:DESC&cap_quan_ly_de_tai=Cấp bộ
Authorization: Bearer <ACCESS_TOKEN>
```

**Params trong Postman:**
| Key | Value |
|-----|-------|
| `search` | `lúa` |
| `sort` | `ngay_tao:DESC` |
| `cap_quan_ly_de_tai` | `Cấp bộ` |

**Kết quả:** File Excel chỉ chứa đề tài có từ "lúa", cấp bộ, sắp xếp theo ngày tạo mới nhất

### Bước 4: Test export với nhiều bản ghi

Nếu database có > 10,000 bản ghi thỏa điều kiện:

**Response:**

```json
{
  "statusCode": 400,
  "message": "Số lượng bản ghi vượt quá giới hạn export (10000). Vui lòng sử dụng bộ lọc để giảm dữ liệu."
}
```

---

## 🧪 Test với cURL (Terminal)

### Export toàn bộ:

```bash
curl -X GET "http://localhost:3001/api/de-tai/export" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  --output "DanhSachDeTai.xlsx"
```

### Export với filter:

```bash
curl -X GET "http://localhost:3001/api/de-tai/export?search=lúa&sort=ngay_tao:DESC" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  --output "DanhSachDeTai_Lua.xlsx"
```

### Export với multiple filters:

```bash
curl -X GET "http://localhost:3001/api/de-tai/export?cap_quan_ly_de_tai=Cấp%20bộ&linh_vuc_khoa_hoc=Di%20truyền" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  --output "DanhSachDeTai_Filtered.xlsx"
```

**Lưu ý:** Phải encode URL (space → `%20`)

---

## ⚡ Performance & Giới hạn

### Tài nguyên:

- **Memory usage**: ~50MB cho 10,000 rows
- **Processing time**: 2-4 giây cho 10,000 rows
- **File size**: ~1-2MB cho 10,000 rows

### Giới hạn:

- **Max rows**: 10,000 bản ghi
- **Timeout**: 30 giây (NestJS default)
- **Nếu vượt quá**: Trả về lỗi 400, yêu cầu dùng filter

### Tối ưu:

- Sử dụng query builder (TypeORM) → hiệu năng cao
- Stream mode của exceljs → tiết kiệm RAM
- Không load relations không cần thiết

---

## 🔒 Bảo mật

### Authentication:

- Yêu cầu JWT token hợp lệ
- Token có thời hạn (mặc định 24h)

### Authorization:

- Kiểm tra quyền `XEM` trên module `DE_TAI`
- Nếu không có quyền → 403 Forbidden

### Rate limiting (nên thêm):

```typescript
// Giới hạn 10 requests/phút cho export
@Throttle(10, 60)
@Get('export')
```

---

## 🚀 Mở rộng cho module khác

### Copy pattern sang DauThau, HopDong, v.v.:

**1. Service:**

```typescript
async layDanhSachExport(paginationDto: PaginationDto): Promise<any[]> {
  // Copy từ DeTaiService.layDanhSachExport()
  // Đổi repository, allowedFields
}
```

**2. Controller:**

```typescript
@Get('export')
@RequirePermission('MODULE_NAME', HanhDong.XEM)
async export(@Query() filterDto: FilterDto, @Res() res: Response) {
  const danhSach = await this.service.layDanhSachExport(filterDto);

  const columns = [ /* cấu hình cột */ ];

  const excelBuffer = await ExcelUtils.generateExcel(
    danhSach,
    columns,
    'Tên sheet',
  );

  const fileName = `TenFile_${new Date().toISOString().split('T')[0]}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(excelBuffer);
}
```

**Thời gian:** ~15 phút/module sau khi có mẫu DeTai

---

## ❓ Troubleshooting

### Lỗi: "Cannot find module 'exceljs'"

```bash
cd backend
npm install exceljs
```

### Lỗi: 401 Unauthorized

- Token không hợp lệ hoặc hết hạn
- Đăng nhập lại để lấy token mới

### Lỗi: 403 Forbidden

- User không có quyền `XEM` module `DE_TAI`
- Liên hệ admin để cấp quyền

### Lỗi: 400 Bad Request - "Số lượng bản ghi vượt quá giới hạn"

- Kết quả > 10,000 bản ghi
- Thêm filter để giảm số lượng: `?search=xxx` hoặc filter cụ thể

### File download nhưng không mở được:

- Kiểm tra response có phải binary không
- Đảm bảo save với extension `.xlsx`
- Mở bằng Excel hoặc LibreOffice

---

## 📚 Tài liệu tham khảo

- [ExcelJS Documentation](https://github.com/exceljs/exceljs)
- [NestJS Response Handling](https://docs.nestjs.com/controllers#request-payloads)
- [TypeORM Query Builder](https://typeorm.io/select-query-builder)
