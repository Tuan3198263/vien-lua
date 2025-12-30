# API Handling

## API Call Pattern

```typescript
// Service file: src/services/api/nguoiDungApi.ts
import { getData, postData, updateData, deleteData } from "./coreApi";

export const nguoiDungApi = {
  getAll: (params: PaginationParams) =>
    getData<PaginatedResponse<NguoiDung>>(API_URL.NGUOI_DUNG.LIST, params),

  getById: (id: number) =>
    getData<NguoiDung>(`${API_URL.NGUOI_DUNG.DETAIL}/${id}`),

  create: (data: CreateNguoiDungDto) =>
    postData<NguoiDung>(API_URL.NGUOI_DUNG.CREATE, data),

  update: (id: number, data: UpdateNguoiDungDto) =>
    updateData<NguoiDung>(`${API_URL.NGUOI_DUNG.UPDATE}/${id}`, data),

  delete: (id: number) => deleteData(`${API_URL.NGUOI_DUNG.DELETE}/${id}`),
};
```

---

## Error Handling

```typescript
import { notifySuccess, notifyError } from "@/utils/notification";

try {
  const response = await authApi.login(values);
  notifySuccess("Đăng nhập thành công");
} catch (error: any) {
  const errorMessage = error.response?.data?.message || "Lỗi không xác định";
  notifyError("Đăng nhập thất bại", errorMessage);
  console.error("Lỗi:", error);
}
```

---

## Loading States

- Luôn có loading state cho API calls
- Disable form/button khi đang submit
- Hiển thị skeleton/spinner khi đang load data

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async (values: any) => {
  try {
    setLoading(true);
    await api.create(values);
    notifySuccess("Thành công!");
  } catch (error) {
    notifyError("Thất bại!");
  } finally {
    setLoading(false);
  }
};
```
