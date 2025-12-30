# Styling Guidelines

## CSS Files

- **File name:** `ComponentName.css`
- **Sử dụng class names có ý nghĩa**
- **Dùng BEM hoặc prefix để tránh conflict**

```css
/* DangNhap.css */
.dang-nhap-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.dang-nhap-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s;
}
```

---

## Inline Styles

- **Chỉ dùng cho dynamic styles**
- **Không hardcode values, dùng constants/theme**

```typescript
<div style={{ color: isActive ? "green" : "gray" }} />
```

---

## Ant Design Theme

- Override theme trong `main.tsx` với ConfigProvider
- Sử dụng token để customize

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#52c41a",
    },
  }}
>
  <App />
</ConfigProvider>
```

---

## Best Practices

### ✅ DO:

- Dùng Ant Design components trước
- CSS cho styling, không layout
- Class names có ý nghĩa
- Responsive design

### ❌ DON'T:

- Không hardcode màu sắc, dùng theme
- Không dùng inline styles cho layout
- Không duplicate styles
