# Hướng dẫn Hệ thống Phân quyền và Filtering Mới

## Tổng quan

Hệ thống được thiết kế lại với 2 mục tiêu chính:

1. **Đơn giản hóa Phân quyền**: Từ 6+ hành động → 2 hành động (XEM, THAO_TAC)
2. **Nâng cao Filtering**: Từ search chung → Filter theo từng field cụ thể

---

## 1. Hệ thống Phân quyền (Permission System)

### 1.1. Backend

#### Enum HanhDong

**File**: `backend/src/shared/constants/hanh-dong.enum.ts`

```typescript
export enum HanhDong {
  XEM = "xem", // Default permission
  THAO_TAC = "thao_tac", // Full access
}
```

#### Logic Phân quyền

**File**: `backend/src/modules/PhanQuyen/phan-quyen.service.ts`

```typescript
async kiemTraQuyen(nguoiDungId: number, maModule: string, hanhDong: HanhDong) {
  // XEM: Luôn return true (không cần DB record)
  if (hanhDong === HanhDong.XEM) {
    return true;
  }

  // THAO_TAC: Kiểm tra DB
  const count = await this.phanQuyenRepository.count({
    where: {
      vai_tro_id: user.vai_tro.id,
      ma_module: maModule,
      hanh_dong: HanhDong.THAO_TAC,
    },
  });

  return count > 0; // Có THAO_TAC = Toàn quyền
}
```

#### Sử dụng trong Controller

**File**: `backend/src/modules/NguoiDung/nguoi-dung.controller.ts`

```typescript
@Controller("nguoi-dung")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NguoiDungController {
  @Post()
  @RequirePermission("NGUOI_DUNG", HanhDong.THAO_TAC)
  create(@Body() dto: CreateNguoiDungDto) {}

  @Get()
  @RequirePermission("NGUOI_DUNG", HanhDong.XEM)
  findAll(@Query() paginationDto: PaginationDto) {}

  @Patch(":id")
  @RequirePermission("NGUOI_DUNG", HanhDong.THAO_TAC)
  update(@Param("id") id: string, @Body() dto: UpdateNguoiDungDto) {}

  @Delete(":id")
  @RequirePermission("NGUOI_DUNG", HanhDong.THAO_TAC)
  remove(@Param("id") id: string) {}
}
```

### 1.2. Frontend

#### Constants

**File**: `frontend/src/constants/permissions.ts`

```typescript
export enum HanhDong {
  XEM = "xem",
  THAO_TAC = "thao_tac",
}

// Helper functions
export const taoPermission = (module: string, hanhDong: HanhDong): string => {
  return `${module}:${hanhDong}`;
};

export const kiemTraThaoTac = (
  userPermissions: string[] | undefined,
  module: string
): boolean => {
  if (!userPermissions) return false;
  return userPermissions.includes(taoPermission(module, HanhDong.THAO_TAC));
};
```

#### Sử dụng trong Component

```tsx
import { kiemTraThaoTac, HanhDong } from "@/constants";
import { useSelector } from "react-redux";

function NguoiDung() {
  const user = useSelector((state: RootState) => state.auth.user);
  const coQuyenThaoTac = kiemTraThaoTac(user?.permissions, "NGUOI_DUNG");

  return (
    <>
      {/* Luôn hiển thị danh sách (có quyền XEM mặc định) */}
      <DanhSachNguoiDung />

      {/* Chỉ hiển thị nút thêm nếu có THAO_TAC */}
      {coQuyenThaoTac && <Button onClick={openThemForm}>Thêm mới</Button>}
    </>
  );
}
```

---

## 2. Hệ thống Filtering

### 2.1. Backend

#### PaginationDto

**File**: `backend/src/shared/dto/pagination.dto.ts`

```typescript
export class PaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  // Dynamic fields cho filtering
  [key: string]: any;
}
```

**Cách hoạt động**:

- Frontend gửi: `?page=1&limit=10&tai_khoan=admin&ho_ten=Nguyen`
- Backend nhận được: `{ page: 1, limit: 10, tai_khoan: 'admin', ho_ten: 'Nguyen' }`

#### QueryUtils

**File**: `backend/src/shared/utils/query.utils.ts`

```typescript
static applyFieldFilters<T>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
  alias: string,
  allowedFields: string[],
) {
  const excludedKeys = ['page', 'limit', 'id'];

  Object.keys(paginationDto).forEach((key) => {
    const value = paginationDto[key];

    if (
      excludedKeys.includes(key) ||
      !allowedFields.includes(key) ||
      value === null || value === undefined || value === ''
    ) {
      return;
    }

    // Áp dụng LIKE filter
    queryBuilder.andWhere(`${alias}.${key} LIKE :${key}`, {
      [key]: `%${value}%`,
    });
  });

  return queryBuilder;
}
```

#### Sử dụng trong Service

**File**: `backend/src/modules/NguoiDung/nguoi-dung.service.ts`

```typescript
async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<NguoiDung>> {
  const queryBuilder = this.nguoiDungRepository
    .createQueryBuilder('nguoi_dung')
    .leftJoinAndSelect('nguoi_dung.vai_tro', 'vai_tro');

  // Các field được phép filter (trừ id, mat_khau)
  const allowedFields = [
    'tai_khoan',
    'ho_ten',
    'email',
    'sdt',
    'dia_chi',
    'ngay_sinh',
    'gioi_tinh',
  ];

  // Áp dụng field filtering + phân trang
  // Mặc định sort theo ngay_tao DESC
  QueryUtils.applyQueryOptions(
    queryBuilder,
    paginationDto,
    'nguoi_dung',
    allowedFields,
  );

  const [data, total] = await queryBuilder.getManyAndCount();
  return QueryUtils.createPaginatedResult(data, total, paginationDto);
}
```

### 2.2. Frontend

#### Custom Hook: useColumnFilter

**File**: `frontend/src/hooks/useColumnFilter.tsx`

```tsx
export const useColumnFilter = () => {
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: string,
    placeholder?: string
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${placeholder || dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
          >
            Tìm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)}>
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  });

  return getColumnSearchProps;
};
```

#### Sử dụng trong Component

**File**: `frontend/src/pages/NguoiDung/DanhSachNguoiDung.tsx`

```tsx
function DanhSachNguoiDung() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const getColumnSearchProps = useColumnFilter();

  const loadData = async (
    page: number = 1,
    pageSize: number = 10,
    currentFilters: Record<string, string> = filters
  ) => {
    const response = await nguoiDungApi.getAll({
      page,
      limit: pageSize,
      ...currentFilters, // Spread field filters vào API call
    });
    setDataSource(response.data);
  };

  const columns: ColumnsType<NguoiDung> = [
    {
      title: "Tài khoản",
      dataIndex: "tai_khoan",
      key: "tai_khoan",
      ...getColumnSearchProps("tai_khoan", "tài khoản"), // Thêm filter
    },
    {
      title: "Họ tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      ...getColumnSearchProps("ho_ten", "họ tên"), // Thêm filter
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email", "email"), // Thêm filter
    },
  ];

  const handleTableChange = async (
    newPagination: TablePaginationConfig,
    tableFilters: Record<string, any>
  ) => {
    // Chuyển đổi filters từ Table sang API params
    const apiFilters: Record<string, string> = {};
    Object.keys(tableFilters).forEach((key) => {
      if (tableFilters[key] && tableFilters[key].length > 0) {
        apiFilters[key] = tableFilters[key][0];
      }
    });

    setFilters(apiFilters);
    await loadData(newPagination.current, newPagination.pageSize, apiFilters);
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      onChange={(pagination, filters) => handleTableChange(pagination, filters)}
    />
  );
}
```

---

## 3. So sánh Hệ thống Cũ vs Mới

### 3.1. Phân quyền

| Khía cạnh      | Cũ                                                | Mới                     |
| -------------- | ------------------------------------------------- | ----------------------- |
| Số hành động   | 6+ (XEM, XEM_CHI_TIET, THEM, SUA, XOA, XUAT_FILE) | 2 (XEM, THAO_TAC)       |
| Logic XEM      | Cần DB record                                     | Không cần DB (mặc định) |
| Logic THAO_TAC | Cần 4+ records (THEM, SUA, XOA...)                | Chỉ cần 1 record        |
| DB records     | Nhiều bản ghi cho mỗi vai trò                     | Ít bản ghi hơn          |
| Dễ quản lý     | Phức tạp                                          | Đơn giản                |

### 3.2. Filtering

| Khía cạnh     | Cũ                          | Mới                              |
| ------------- | --------------------------- | -------------------------------- |
| UI Filter     | Row với nhiều Input         | Column dropdown tích hợp         |
| API Call      | `?search=keyword`           | `?tai_khoan=admin&ho_ten=Nguyen` |
| Backend Logic | Concat nhiều field với OR   | WHERE field LIKE %value%         |
| Chính xác     | Thấp (search chung)         | Cao (field cụ thể)               |
| UX            | Cần scroll xuống tìm filter | Click icon ngay trên cột         |

### 3.3. Sorting

| Khía cạnh      | Cũ                                  | Mới                    |
| -------------- | ----------------------------------- | ---------------------- |
| UI             | Column header có sorter             | Không có               |
| API Params     | `?sort_field=ho_ten&sort_order=ASC` | Không có               |
| Backend        | Dynamic sort theo request           | Fixed: `ngay_tao DESC` |
| Lý do thay đổi | Ít sử dụng, phức tạp hóa code       | Đơn giản, đủ dùng      |

---

## 4. Migration Guide

### 4.1. Migrate Permission Data

Nếu đã có dữ liệu cũ trong bảng `phan_quyen`, cần migrate:

```sql
-- Xóa tất cả quyền cũ
DELETE FROM phan_quyen;

-- Thêm quyền THAO_TAC cho admin
INSERT INTO phan_quyen (vai_tro_id, ma_module, hanh_dong)
SELECT vt.id, 'NGUOI_DUNG', 'thao_tac'
FROM vai_tro vt
WHERE vt.ma_vai_tro = 'ADMIN';

INSERT INTO phan_quyen (vai_tro_id, ma_module, hanh_dong)
SELECT vt.id, 'VAI_TRO', 'thao_tac'
FROM vai_tro vt
WHERE vt.ma_vai_tro = 'ADMIN';

-- User không có THAO_TAC = chỉ có quyền XEM (mặc định)
```

### 4.2. Update Frontend Code

```typescript
// CŨ
import { HanhDong } from "@/constants";
const hasPermission = user.permissions.includes(`NGUOI_DUNG:${HanhDong.THEM}`);

// MỚI
import { kiemTraThaoTac } from "@/constants";
const hasPermission = kiemTraThaoTac(user.permissions, "NGUOI_DUNG");
```

### 4.3. Update Filter Calls

```typescript
// CŨ
nguoiDungApi.getAll({
  page: 1,
  limit: 10,
  search: "admin",
});

// MỚI
nguoiDungApi.getAll({
  page: 1,
  limit: 10,
  tai_khoan: "admin",
  ho_ten: "Nguyen",
});
```

---

## 5. Best Practices

### 5.1. Backend

1. **Luôn định nghĩa allowedFields** khi gọi `applyFieldFilters`:

   ```typescript
   const allowedFields = ["tai_khoan", "ho_ten", "email"]; // Không bao gồm 'id', 'mat_khau'
   ```

2. **Validate module name** trong controller:

   ```typescript
   @RequirePermission('NGUOI_DUNG', HanhDong.THAO_TAC) // Dùng constant
   // Không: @RequirePermission('nguoi-dung', HanhDong.THAO_TAC)
   ```

3. **Default sort luôn là ngay_tao DESC** (không cần config thêm)

### 5.2. Frontend

1. **Chỉ dùng kiemTraThaoTac cho action buttons**:

   ```tsx
   {
     kiemTraThaoTac(user?.permissions, "NGUOI_DUNG") && (
       <Button onClick={handleDelete}>Xóa</Button>
     );
   }
   ```

2. **Không cần check permission cho GET/view** (đã có XEM mặc định)

3. **Thêm filter cho các cột quan trọng**:

   - Tài khoản, Họ tên, Email: Nên có filter
   - STT, Ngày tạo, Hành động: Không cần filter

4. **Xử lý trường hợp null/undefined** trong filter:
   ```typescript
   if (value === null || value === undefined || value === "") return;
   ```

---

## 6. Troubleshooting

### Vấn đề: User không có quyền THAO_TAC nhưng vẫn thấy nút "Thêm"

**Nguyên nhân**: Frontend không check permission
**Giải pháp**:

```tsx
// Thêm check
{
  kiemTraThaoTac(user?.permissions, "NGUOI_DUNG") && <Button>Thêm mới</Button>;
}
```

### Vấn đề: Filter không hoạt động

**Nguyên nhân**: Field không nằm trong `allowedFields`
**Giải pháp**:

```typescript
// Backend: Thêm field vào allowedFields
const allowedFields = ['tai_khoan', 'ho_ten', 'email', 'sdt']; // Thêm 'sdt'

// Frontend: Thêm filter prop
{
  title: "SĐT",
  dataIndex: "sdt",
  ...getColumnSearchProps("sdt", "số điện thoại"),
}
```

### Vấn đề: API trả về tất cả data khi filter

**Nguyên nhân**: Frontend không gửi filters trong API call
**Giải pháp**:

```typescript
await nguoiDungApi.getAll({
  page,
  limit,
  ...currentFilters, // Đừng quên spread filters
});
```

---

## 7. Changelog

### Version 2.0 (Hiện tại)

- ✅ Đơn giản hóa permissions từ 6 xuống 2
- ✅ XEM là default permission (không cần DB)
- ✅ THAO_TAC = toàn quyền (1 record thay vì 4+)
- ✅ Field-specific filtering thay vì search chung
- ✅ Column filter dropdown tích hợp trong Table
- ✅ Xóa dynamic sorting (fixed ngay_tao DESC)
- ✅ Custom hook `useColumnFilter` cho reusability

### Version 1.0 (Cũ)

- ❌ 6+ permissions (XEM, XEM_CHI_TIET, THEM, SUA, XOA, XUAT_FILE)
- ❌ Tất cả permissions cần DB records
- ❌ Search chung với param `search`
- ❌ Bộ lọc riêng biệt (Row với Input)
- ❌ Dynamic sorting với `sort_field`, `sort_order`

---

## 8. Next Steps

1. Áp dụng hệ thống mới cho module **VaiTro**
2. Áp dụng cho các module khác (nếu có)
3. Tạo API documentation với Swagger/OpenAPI
4. Thêm unit tests cho `applyFieldFilters`
5. Thêm E2E tests cho column filtering UI
