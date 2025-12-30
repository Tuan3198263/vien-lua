# Checklist Trước Khi Commit

## Code Quality

- [ ] Dùng function (không dùng React.FC)
- [ ] Import chỉ những gì cần
- [ ] Ưu tiên dùng Ant Design components/features
- [ ] TypeScript types đầy đủ
- [ ] Không có unused imports/variables
- [ ] Không có TypeScript errors

---

## Validation & Forms

- [ ] Validation dùng Ant Design Form
- [ ] Có `onFinishFailed` handler
- [ ] Validators tách riêng theo module
- [ ] Form có loading state

---

## API & Error Handling

- [ ] Error handling cho mọi API call
- [ ] Notification cho success/error
- [ ] Console.log để debug
- [ ] Loading states được xử lý

---

## UI/UX

- [ ] Routes định nghĩa trong constants
- [ ] Comments tiếng Việt khi cần
- [ ] Responsive design
- [ ] Accessibility (có thể truy cập bằng keyboard)

---

## Testing

- [ ] Test trên browser
- [ ] Test validation errors
- [ ] Test API errors
- [ ] Test loading states

---

**Mục tiêu:** Code sạch, dễ đọc, dễ bảo trì, tuân thủ chuẩn dự án
