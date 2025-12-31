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

**Sử dụng constants từ messages.ts:**

```typescript
import { notifySuccess, notifyError } from "@/utils/notification";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

try {
  await api.create(values);
  notifySuccess(SUCCESS_MESSAGES.CREATE);
} catch (error: any) {
  const errorMessage = error.response?.data?.message || error.message;
  notifyError(ERROR_MESSAGES.CREATE_FAILED, errorMessage);
}
```

**Messages constants:**

```typescript
// constants/messages.ts
export const SUCCESS_MESSAGES = {
  CREATE: "Thêm thành công",
  UPDATE: "Cập nhật thành công",
  DELETE: "Xóa thành công",
};

export const ERROR_MESSAGES = {
  CREATE_FAILED: "Thêm thất bại",
  UPDATE_FAILED: "Cập nhật thất bại",
  DELETE_FAILED: "Xóa thất bại",
  FETCH_FAILED: "Lấy dữ liệu thất bại",
};
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
