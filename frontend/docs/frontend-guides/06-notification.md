# Thông Báo (Notification)

## Sử Dụng Notification Helper

```typescript
import {
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo,
} from "@/utils/notification";

// Success - thông báo ngắn
notifySuccess("Thao tác thành công");

// Success - có mô tả chi tiết
notifySuccess("Đăng nhập thành công", "Chào mừng bạn quay trở lại");

// Error
notifyError("Đã xảy ra lỗi", "Vui lòng thử lại sau");

// Warning
notifyWarning("Cảnh báo", "Dữ liệu chưa được lưu");

// Info
notifyInfo("Thông tin", "Hệ thống đang bảo trì");
```

---

## Cấu Hình

- **File:** `src/utils/notification.ts`
- **Vị trí:** `topRight`
- **Thời gian hiển thị:** 3 giây
- **Số lượng tối đa:** 3 notification cùng lúc

---

## Best Practices

### ✅ DO:

- Dùng notification cho mọi thành công/thất bại
- Dùng validation error notification (`onFinishFailed`)
- Message ngắn gọn, rõ ràng
- Có description khi cần chi tiết

### ❌ DON'T:

- Không dùng antd `message` API
- Không để API error im lặng
- Không spam quá nhiều notification
