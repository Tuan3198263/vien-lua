# Ưu Tiên Sử Dụng Ant Design Components

## Nguyên Tắc Cơ Bản

**Ưu tiên sử dụng các component của Ant Design thay vì thẻ HTML và CSS thông thường.**

Chỉ custom CSS khi:

- Không có component Ant Design phù hợp
- Ant Design không đáp ứng được thiết kế đẹp hoặc yêu cầu đặc biệt

---

## Layout Components - Hạn Chế `div`

### ❌ KHÔNG NÊN:

```tsx
// Tránh dùng div với CSS flexbox thủ công
<div style={{ display: "flex", justifyContent: "space-between" }}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <button>Button</button>
  </div>
  <div>
    <span>Text</span>
  </div>
</div>
```

### ✅ NÊN LÀM:

```tsx
import { Flex, Space, Row, Col } from 'antd';

// Dùng Flex component
<Flex justify="space-between" align="center">
  <Flex align="center">
    <Button>Button</Button>
  </Flex>
  <span>Text</span>
</Flex>

// Dùng Space cho spacing
<Space size="large">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>

// Dùng Row/Col cho grid layout
<Row gutter={[16, 16]}>
  <Col span={12}><Card>Content 1</Card></Col>
  <Col span={12}><Card>Content 2</Card></Col>
</Row>
```

---

## Các Component Thường Dùng

### 1. Flex Component

```tsx
import { Flex } from 'antd';

// Horizontal layout (mặc định)
<Flex justify="space-between" align="center" gap="middle">
  <div>Left</div>
  <div>Right</div>
</Flex>

// Vertical layout
<Flex vertical gap="small">
  <div>Top</div>
  <div>Bottom</div>
</Flex>
```

**Props:** `justify`, `align`, `gap` (small|middle|large), `vertical`, `wrap`

### 2. Space Component

```tsx
import { Space } from 'antd';

<Space size="middle">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>

// Vertical spacing
<Space direction="vertical" size="large" style={{ width: '100%' }}>
  <Input placeholder="Input 1" />
  <Input placeholder="Input 2" />
</Space>
```

**Props:** `size` (8px|16px|24px), `direction`, `align`

### 3. Row & Col (Grid System - 24 columns)

```tsx
import { Row, Col } from 'antd';

<Row gutter={16}>
  <Col span={12}><div>50% width</div></Col>
  <Col span={12}><div>50% width</div></Col>
</Row>

// Responsive
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card>Responsive</Card>
  </Col>
</Row>
```

**Props:** `gutter`, `justify`, `align` | **Col:** `span`, `offset`, responsive breakpoints

---

## Khi Nào Cần CSS?

- Custom style cụ thể (màu sắc, border-radius, shadow...)
- Animation và transition
- Pseudo-classes (:hover, :active, :focus...)
- Media queries phức tạp

```tsx
// Flex cho layout + CSS cho styling
<Flex justify="center" align="center" className="custom-container">
  <Card className="custom-card">
    <Flex vertical gap="middle">
      <Title level={3}>Title</Title>
      <Button type="primary">Action</Button>
    </Flex>
  </Card>
</Flex>
```

```css
/* CSS chỉ cho styling, không layout */
.custom-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.custom-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s;
}
```

---

## Best Practices

### ✅ DO:

- Dùng `Flex` cho layout 1 chiều (horizontal/vertical)
- Dùng `Row/Col` cho grid layout phức tạp
- Dùng `Space` cho khoảng cách giữa elements
- Dùng `gap` prop thay vì margin/padding
- Kết hợp Ant Design components với CSS cho styling

### ❌ DON'T:

- Không dùng `<div style={{ display: 'flex' }}>`
- Không dùng `<div className="row">` với custom CSS
- Không hardcode margin/padding (dùng `gap`)
- Không tạo custom grid khi đã có Row/Col
