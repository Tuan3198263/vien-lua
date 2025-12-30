# Cách Viết Component

## Function Components (Modern React)

```typescript
import { useState } from "react";
import { Button, Form } from "antd";

interface DangNhapProps {
  onSuccess?: () => void;
}

/**
 * Component đăng nhập
 */
function DangNhap({ onSuccess }: DangNhapProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    // Logic xử lý
  };

  return <Form onFinish={handleSubmit}>{/* UI */}</Form>;
}

export default DangNhap;
```

---

## Thứ Tự Trong Component

1. **Imports** (React → Third-party → Local)
2. **Interfaces/Types** (Props, Form values, etc.)
3. **Component Definition**
   - State declarations
   - Hooks (useDispatch, useSelector, custom hooks)
   - useEffect
   - Event handlers
   - Helper functions
   - Render logic
4. **Export**

---

## Quy Tắc Component

- Mỗi component 1 file
- Component nhỏ gọn, tập trung vào 1 nhiệm vụ
- Tách logic phức tạp ra custom hooks
- Sử dụng React.memo() cho component render nhiều lần

---

## CRUD Pages Structure

```
pages/NguoiDung/
├── NguoiDung.tsx          # Main component
├── DanhSachNguoiDung.tsx  # List/Table component
├── FormNguoiDung.tsx      # Form component (reusable)
├── ThemNguoiDung.tsx      # Create page
├── SuaNguoiDung.tsx       # Edit page
└── types.ts               # Local types
```

---

## Consistency Rules

- Tất cả list page phải có: search, filter, pagination, sort
- Tất cả form phải có validation với antd Form
- Tất cả API call phải có loading state
- Tất cả error phải được handle và hiển thị notification
- Tất cả success action phải có notification
