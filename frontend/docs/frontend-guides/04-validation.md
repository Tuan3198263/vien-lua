# Validation & Form Handling

## Validation Rules

**Tách validation theo module trong `src/validators/`:**

```typescript
// validators/auth.validator.ts
import type { Rule } from "antd/es/form";
import { MESSAGES } from "@/constants/messages";

export const LOGIN_VALIDATOR = {
  tai_khoan: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự" },
    { max: 50, message: "Tài khoản không được quá 50 ký tự" },
    { whitespace: true, message: "Tài khoản không được chỉ chứa khoảng trắng" },
  ] as Rule[],

  mat_khau: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
    { whitespace: true, message: "Mật khẩu không được chỉ chứa khoảng trắng" },
  ] as Rule[],
};
```

---

## Form Component với Notification

### ✅ ĐÚNG - Hiển thị notification cho cả validation error:

```typescript
import { Form, Input, Button } from "antd";
import { notifyError, notifySuccess } from "@/utils/notification";

function MyForm() {
  const [form] = Form.useForm();

  // Xử lý submit thành công
  const handleSubmit = async (values: any) => {
    try {
      await someApi.create(values);
      notifySuccess("Tạo thành công!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Thao tác thất bại", errorMsg);
    }
  };

  // Xử lý validation thất bại - QUAN TRỌNG
  const handleSubmitFailed = (errorInfo: any) => {
    console.log("Validation thất bại:", errorInfo);

    // Lấy lỗi đầu tiên để hiển thị
    const firstError = errorInfo.errorFields[0];
    if (firstError && firstError.errors.length > 0) {
      notifyError("Lỗi nhập liệu", firstError.errors[0]);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={handleSubmitFailed} // Bắt buộc
    >
      <Form.Item name="field" rules={MY_VALIDATOR.field}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
```

### ❌ SAI - Không xử lý validation error:

```typescript
// Thiếu onFinishFailed
<Form onFinish={handleSubmit}>
  <Form.Item name="field" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>
```

---

## Validation Rules Thường Dùng

```typescript
// Required
{ required: true, message: 'Trường này là bắt buộc' }

// Min/Max length
{ min: 3, message: 'Phải có ít nhất 3 ký tự' }
{ max: 50, message: 'Không được quá 50 ký tự' }

// Email
{ type: 'email' as const, message: 'Email không hợp lệ' }

// Pattern (regex)
{ pattern: /^[0-9]+$/, message: 'Chỉ được nhập số' }

// Whitespace
{ whitespace: true, message: 'Không được chỉ chứa khoảng trắng' }

// Custom validator
{
  validator: async (_, value) => {
    if (value && value.length < 6) {
      return Promise.reject('Mật khẩu quá ngắn');
    }
    return Promise.resolve();
  }
}
```

---

## Quy Tắc Validation

### ✅ DO:

- Luôn thêm `onFinishFailed` handler cho Form
- Hiển thị notification khi validation thất bại
- Thêm console.log để debug validation errors
- Sử dụng message tiếng Việt rõ ràng
- Thêm `whitespace: true` cho các trường text quan trọng
- Mỗi module có file validator riêng trong `validators/`

### ❌ DON'T:

- Không bỏ qua `onFinishFailed` - validation error sẽ không được thông báo
- Không để form submit mà không có validation
- Không hardcode validation message
