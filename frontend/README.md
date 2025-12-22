# Frontend - React + TypeScript + Vite + Ant Design

## 📋 Mô tả

Frontend của dự án Viện Lúa, xây dựng với React, TypeScript và Ant Design. Sử dụng Vite làm build tool để có tốc độ phát triển nhanh.

## 🎨 Công nghệ sử dụng

- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server siêu nhanh
- **Ant Design 5** - Component library
- **Axios** - HTTP client

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── pages/          # Các trang của ứng dụng
│   ├── main.tsx        # Entry point
│   └── App.tsx         # Root component với layout
├── index.html          # HTML template
├── vite.config.ts      # Cấu hình Vite
├── tsconfig.json       # Cấu hình TypeScript
└── package.json        # Dependencies
```

## 🚀 Chạy Development

```bash
# Install dependencies
npm install

# Chạy dev server
npm run dev

# Truy cập: http://localhost:3000
```

## 🏗️ Build Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## 🐳 Docker

```bash
# Build image
docker build -t vien-lua-frontend .

# Run container
docker run -p 80:80 vien-lua-frontend
```

## 🎯 Features

### Layout

- Header với tiêu đề trang
- Sidebar menu có thể thu gọn
- Content area responsive

### Dashboard

- Cards thống kê với số liệu mẫu
- Layout grid với Ant Design Row/Col
- Icons từ Ant Design

### Cấu hình

- Proxy API requests tới backend (`/api` → `http://localhost:3001`)
- Ngôn ngữ tiếng Việt cho Ant Design
- Hot Module Replacement (HMR)

## 📝 Scripts

```bash
npm run dev      # Development mode với HMR
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # Chạy ESLint
```

## 🔧 Cấu hình quan trọng

### vite.config.ts

- Server port: 3000
- Proxy: `/api` → backend:3001
- Plugin: React

### tsconfig.json

- Target: ES2020
- JSX: react-jsx
- Strict mode enabled

## 💡 Hướng dẫn mở rộng

### Thêm trang mới

1. Tạo component trong `src/pages/`
2. Thêm route (nếu dùng React Router)
3. Cập nhật menu trong `App.tsx`

### Gọi API

```typescript
import axios from "axios";

// API sẽ tự động proxy qua backend
const response = await axios.get("/api/users");
```

### Sử dụng Ant Design components

```typescript
import { Button, Table, Form } from "antd";
```

## 🎨 Theme customization

Có thể customize theme Ant Design trong `main.tsx`:

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#00b96b",
    },
  }}
>
  <App />
</ConfigProvider>
```

## 🔗 Links

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [TypeScript](https://www.typescriptlang.org/)
