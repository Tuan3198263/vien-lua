# Hướng Dẫn Sử Dụng Danh Mục Select

## 📋 Tổng Quan

Component `DanhMucSelect` và các hooks hỗ trợ để load dropdown options từ backend một cách đơn giản.

---

## 🎯 Cách Sử Dụng

### Cách 1: Component DanhMucSelect (Đơn giản nhất)

Dùng khi chỉ có 1 select trong form.

```tsx
import { DanhMucSelect } from "@/components/DanhMucSelect";

function MyForm() {
  const [donVi, setDonVi] = useState<string>();

  return (
    <Form>
      <Form.Item label="Đơn vị phê duyệt">
        <DanhMucSelect
          maDanhMuc="DON_VI_PHE_DUYET"
          value={donVi}
          onChange={setDonVi}
          placeholder="Chọn đơn vị"
        />
      </Form.Item>
    </Form>
  );
}
```

### Cách 2: Hook useDanhMucs (Nhiều select)

Dùng khi form có nhiều select từ danh mục khác nhau.

```tsx
import { Select } from "antd";
import { useDanhMucs } from "@/components/DanhMucSelect";

function MyForm() {
  const [donVi, setDonVi] = useState<string>();
  const [linhVuc, setLinhVuc] = useState<string>();

  // Load nhiều danh mục cùng lúc (chỉ 1 API call)
  const { loading, getOptions } = useDanhMucs([
    "DON_VI_PHE_DUYET",
    "LINH_VUC_KHOA_HOC",
  ]);

  return (
    <Form>
      <Form.Item label="Đơn vị phê duyệt">
        <Select value={donVi} onChange={setDonVi} loading={loading}>
          {getOptions("DON_VI_PHE_DUYET").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Lĩnh vực khoa học">
        <Select value={linhVuc} onChange={setLinhVuc} loading={loading}>
          {getOptions("LINH_VUC_KHOA_HOC").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}
```

### Cách 3: Hook useDanhMucsByModule (Theo module)

Dùng khi muốn load **TẤT CẢ** danh mục của 1 module.

```tsx
import { Select } from "antd";
import { useDanhMucsByModule } from "@/components/DanhMucSelect";

function HopDongForm() {
  const [loaiHopDong, setLoaiHopDong] = useState<string>();
  const [trangThai, setTrangThai] = useState<string>();

  // Load tất cả danh mục của module HOP_DONG
  const { loading, getOptions } = useDanhMucsByModule("HOP_DONG");

  return (
    <Form>
      <Form.Item label="Loại hợp đồng">
        <Select value={loaiHopDong} onChange={setLoaiHopDong} loading={loading}>
          {getOptions("LOAI_HOP_DONG").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Trạng thái">
        <Select value={trangThai} onChange={setTrangThai} loading={loading}>
          {getOptions("TRANG_THAI_HOP_DONG").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}
```

---

## 📚 API Reference

### Component: DanhMucSelect

**Props:**

| Prop             | Type          | Required | Description                     |
| ---------------- | ------------- | -------- | ------------------------------- |
| `maDanhMuc`      | `string`      | Yes      | Mã danh mục cần load            |
| `label`          | `string`      | No       | Label hiển thị                  |
| `...selectProps` | `SelectProps` | No       | Các props của Ant Design Select |

**Ví dụ:**

```tsx
<DanhMucSelect
  maDanhMuc="DON_VI_PHE_DUYET"
  value={value}
  onChange={setValue}
  placeholder="Chọn đơn vị"
  disabled={false}
  allowClear
/>
```

---

### Hook: useDanhMucs

**Parameters:**

- `maDanhMucs: string[]` - Danh sách mã danh mục cần load

**Returns:**

```typescript
{
  loading: boolean;
  danhMucs: Record<string, DanhMucInfo>;
  getOptions: (maDanhMuc: string) => string[];
}
```

**Ví dụ:**

```tsx
const { loading, danhMucs, getOptions } = useDanhMucs([
  "DON_VI_PHE_DUYET",
  "LINH_VUC_KHOA_HOC",
]);

// Lấy options
const donViOptions = getOptions("DON_VI_PHE_DUYET");

// Lấy thông tin đầy đủ
const donViInfo = danhMucs["DON_VI_PHE_DUYET"];
console.log(donViInfo.ten_danh_muc); // "Đơn vị phê duyệt"
```

---

### Hook: useDanhMucsByModule

**Parameters:**

- `module: string` - Mã module (VD: 'HOP_DONG')

**Returns:**

```typescript
{
  loading: boolean;
  danhMucs: Record<string, DanhMucInfo>;
  getOptions: (maDanhMuc: string) => string[];
}
```

**Ví dụ:**

```tsx
const { loading, getOptions } = useDanhMucsByModule("HOP_DONG");

const loaiHopDongOptions = getOptions("LOAI_HOP_DONG");
const trangThaiOptions = getOptions("TRANG_THAI_HOP_DONG");
```

---

## 💡 Tips & Best Practices

### 1. Chọn cách phù hợp

- **1 select** → Dùng `DanhMucSelect`
- **2-3 select từ danh mục khác nhau** → Dùng `useDanhMucs`
- **Nhiều select của cùng module** → Dùng `useDanhMucsByModule`

### 2. Tránh gọi API nhiều lần

❌ **Không nên:**

```tsx
// Mỗi select gọi 1 API riêng
<DanhMucSelect maDanhMuc="DON_VI_PHE_DUYET" />
<DanhMucSelect maDanhMuc="LINH_VUC_KHOA_HOC" />
<DanhMucSelect maDanhMuc="LOAI_HOP_DONG" />
```

✅ **Nên:**

```tsx
// Gọi 1 API cho tất cả
const { getOptions } = useDanhMucs([
  "DON_VI_PHE_DUYET",
  "LINH_VUC_KHOA_HOC",
  "LOAI_HOP_DONG",
]);
```

### 3. Cache data nếu cần

Nếu muốn cache data để tránh load lại khi component re-mount:

```tsx
// Tạo context hoặc dùng Redux để cache
const DanhMucContext = createContext({});

// Hoặc dùng React Query
const { data } = useQuery("danh-muc-hop-dong", () =>
  danhMucApi.layTheoModule("HOP_DONG")
);
```

---

## 🔧 Danh Sách Mã Danh Mục

### Danh mục dùng chung

- `DON_VI_PHE_DUYET` - Đơn vị phê duyệt
- `LINH_VUC_KHOA_HOC` - Lĩnh vực khoa học

### Module HOP_DONG

- `LOAI_HOP_DONG` - Loại hợp đồng
- `TRANG_THAI_HOP_DONG` - Trạng thái hợp đồng

_(Xem đầy đủ tại: `backend/src/shared/constants/danh-muc.constant.ts`)_

---

## ❓ FAQ

**Q: Làm sao thêm danh mục mới?**

A: Thêm vào file `backend/src/shared/constants/danh-muc.constant.ts`, restart backend.

**Q: Làm sao biết mã danh mục nào có sẵn?**

A: Xem file constant backend hoặc gọi API `GET /api/danh-muc` để xem tất cả.

**Q: Component có cache không?**

A: Hiện tại chưa cache. Mỗi lần component mount sẽ fetch lại. Nếu cần cache, dùng React Query hoặc Redux.

**Q: Có thể custom style Select không?**

A: Có, truyền props `style`, `className` như Select bình thường.

---

**Cập nhật:** 07/01/2026
