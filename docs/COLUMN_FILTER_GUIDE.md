# Hướng Dẫn Column Filter (Frontend-Backend)

## Tổng Quan

Module mới thường gặp lỗi column search không hoạt động. Hướng dẫn này giải thích cách frontend và backend phối hợp để thực hiện column filtering.

## Frontend - useColumnFilter Hook

**Location:** `frontend/src/hooks/useColumnFilter.tsx`

Hook này cung cấp 2 phương thức:

### 1. getColumnSearchProps (Text Search)

Dùng cho các trường text như: tài khoản, họ tên, email, sdt...

```tsx
const { getColumnSearchProps } = useColumnFilter();

const columns = [
  {
    title: "Tài khoản",
    dataIndex: "tai_khoan",
    key: "tai_khoan",
    ...getColumnSearchProps("tai_khoan", "Tài khoản"),
    filteredValue: filters.tai_khoan ? [filters.tai_khoan] : null,
    onFilter: () => true, // Server-side filtering
  },
];
```

### 2. getColumnDateProps (Date Search)

Dùng cho các trường ngày tháng: ngày sinh, ngày cập nhật...

```tsx
const { getColumnDateProps } = useColumnFilter();

const columns = [
  {
    title: "Ngày cập nhật",
    dataIndex: "ngay_cap_nhat",
    key: "ngay_cap_nhat",
    ...getColumnDateProps("ngay_cap_nhat", "Ngày cập nhật"),
    filteredValue: filters.ngay_cap_nhat ? [filters.ngay_cap_nhat] : null,
    onFilter: () => true, // Server-side filtering
  },
];
```

## Backend - QueryUtils

**Location:** `backend/src/shared/utils/query.utils.ts`

### Phương thức chính: applyQueryOptions

```typescript
QueryUtils.applyQueryOptions(
  queryBuilder,
  paginationDto,
  "alias",
  allowedFields // Mảng các field được phép filter
);
```

**Chức năng:**

1. Gọi `applyFieldFilters` - áp dụng LIKE filter cho các field
2. Áp dụng sort mặc định theo `ngay_tao DESC`
3. Gọi `applyPagination` - áp dụng phân trang

### applyFieldFilters

Áp dụng LIKE filter cho tất cả các field trong `allowedFields`:

```typescript
// Ví dụ: filter theo tai_khoan, ho_ten, email
const allowedFields = ["tai_khoan", "ho_ten", "email", "sdt"];

QueryUtils.applyQueryOptions(
  queryBuilder,
  paginationDto,
  "nguoi_dung", // alias của entity
  allowedFields
);
```

**SQL được tạo:**

```sql
WHERE nguoi_dung.tai_khoan LIKE '%value%'
  AND nguoi_dung.ho_ten LIKE '%value%'
  ...
```

## Quy Trình Hoạt Động

### 1. User nhập text vào filter dropdown

```
Frontend: getColumnSearchProps tạo Input field
→ User nhập "admin"
→ setSelectedKeys(["admin"])
→ Click "Áp dụng" → confirm()
```

### 2. Table onChange được trigger

```tsx
const handleTableChange = (
  newPagination: TablePaginationConfig,
  tableFilters: any // ← Chứa filters từ columns
) => {
  // Chuyển đổi filters
  const newFilters: Record<string, string> = {};
  Object.keys(tableFilters).forEach((key) => {
    if (tableFilters[key] && tableFilters[key][0]) {
      newFilters[key] = tableFilters[key][0];
    }
  });

  setFilters(newFilters);
  loadData(newPagination.current, newPagination.pageSize, newFilters);
};
```

### 3. API call với filters

```tsx
const response = await nguoiDungApi.getAll({
  page: 1,
  limit: 10,
  tai_khoan: "admin", // ← Filter được gửi đến backend
});
```

### 4. Backend xử lý

```typescript
async findAll(paginationDto: PaginationDto) {
  const queryBuilder = this.repository.createQueryBuilder('nguoi_dung');

  const allowedFields = ['tai_khoan', 'ho_ten', 'email', 'sdt'];

  // applyQueryOptions sẽ:
  // - Áp dụng LIKE filter: WHERE tai_khoan LIKE '%admin%'
  // - Sort: ORDER BY ngay_tao DESC
  // - Paginate: LIMIT 10 OFFSET 0
  QueryUtils.applyQueryOptions(
    queryBuilder,
    paginationDto,
    'nguoi_dung',
    allowedFields
  );

  const [data, total] = await queryBuilder.getManyAndCount();
  return QueryUtils.createPaginatedResult(data, total, paginationDto);
}
```

## Checklist Khi Tạo Module Mới

### Frontend

- [ ] Import `useColumnFilter` hook
- [ ] Khai báo `filters` state: `useState<Record<string, string>>({})`
- [ ] Thêm `...getColumnSearchProps(key, label)` vào columns cần filter
- [ ] Thêm `filteredValue: filters[key] ? [filters[key]] : null`
- [ ] Thêm `onFilter: () => true` (server-side filtering)
- [ ] Update `handleTableChange` để nhận `tableFilters` parameter
- [ ] Chuyển đổi `tableFilters` sang `newFilters` object
- [ ] Gọi `loadData()` với `newFilters`

### Backend

- [ ] Khai báo `allowedFields` array trong service
- [ ] Gọi `QueryUtils.applyQueryOptions()` với đúng alias và allowedFields
- [ ] Đảm bảo `paginationDto` được truyền đầy đủ từ controller

## Ví Dụ Hoàn Chỉnh

### Frontend Component

```tsx
function DanhSachNguoiDung() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { getColumnSearchProps } = useColumnFilter();

  const columns: ColumnsType<NguoiDung> = [
    {
      title: "Tài khoản",
      dataIndex: "tai_khoan",
      key: "tai_khoan",
      ...getColumnSearchProps("tai_khoan", "Tài khoản"),
      filteredValue: filters.tai_khoan ? [filters.tai_khoan] : null,
      onFilter: () => true,
    },
  ];

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    tableFilters: any
  ) => {
    const newFilters: Record<string, string> = {};
    Object.keys(tableFilters).forEach((key) => {
      if (tableFilters[key]?.[0]) {
        newFilters[key] = tableFilters[key][0];
      }
    });
    setFilters(newFilters);
    loadData(newPagination.current, newPagination.pageSize, newFilters);
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      onChange={handleTableChange}
    />
  );
}
```

### Backend Service

```typescript
async findAll(paginationDto: PaginationDto) {
  const queryBuilder = this.repository.createQueryBuilder('nguoi_dung');

  const allowedFields = [
    'tai_khoan',
    'ho_ten',
    'email',
    'sdt',
  ];

  QueryUtils.applyQueryOptions(
    queryBuilder,
    paginationDto,
    'nguoi_dung',
    allowedFields
  );

  const [data, total] = await queryBuilder.getManyAndCount();
  return QueryUtils.createPaginatedResult(data, total, paginationDto);
}
```

## Lỗi Thường Gặp

### 1. Column search không hoạt động

**Nguyên nhân:**

- Thiếu `handleTableChange` với parameter `tableFilters`
- Không chuyển đổi `tableFilters` sang format đúng
- Backend không khai báo field trong `allowedFields`

**Giải pháp:**

- Tham khảo module NguoiDung
- Đảm bảo field name khớp giữa frontend (column key) và backend (allowedFields)

### 2. Filter date không hoạt động đúng

**Nguyên nhân:**

- Backend dùng LIKE cho date field (không chính xác)

**Giải pháp:**

- Hiện tại backend dùng LIKE cho tất cả fields
- Cần format date ở frontend thành "YYYY-MM-DD" trước khi gửi
- Backend sẽ LIKE match với format đó

### 3. Filter reset khi chuyển trang

**Nguyên nhân:**

- `handleTableChange` không giữ filters cũ

**Giải pháp:**

```tsx
const handleTableChange = (newPagination, tableFilters) => {
  const newFilters = { ...filters }; // Giữ filters cũ
  Object.keys(tableFilters).forEach((key) => {
    if (tableFilters[key]?.[0]) {
      newFilters[key] = tableFilters[key][0];
    }
  });
  // ...
};
```

## Tóm Tắt

**Frontend:**

- `useColumnFilter` → cung cấp UI filter dropdown
- `handleTableChange` → nhận filters từ Table
- Gửi filters đến API qua query params

**Backend:**

- `QueryUtils.applyFieldFilters` → tạo WHERE ... LIKE conditions
- `allowedFields` → whitelist các field được phép filter
- Chỉ filter các field có trong `allowedFields`

**Công thức thành công:**

```
getColumnSearchProps + filteredValue + onFilter (frontend)
     ↓
handleTableChange converts filters
     ↓
API call with filters
     ↓
QueryUtils.applyQueryOptions with allowedFields (backend)
     ↓
SQL LIKE queries
```
