# Frontend - Viện Lúa

Ứng dụng web quản lý viện lúa, xây dựng với React + TypeScript + Ant Design.

## 🎨 Công nghệ

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing

## 📁 Cấu trúc chính

```
src/
├── pages/            # Các trang chức năng
│   ├── TrangChu/    # Dashboard
│   ├── DeTai/       # Quản lý đề tài
│   ├── DauThau/     # Quản lý đấu thầu
│   ├── NhaLuoi/     # Nhà lưới
│   ├── DeCuongTN/   # Đề cương Thí Nghiệm
│   ├── HopDong/     # Quản lý hợp đồng
│   ├── TaiLieu/     # Tài liệu
│   ├── NguoiDung/   # Quản lý người dùng
│   └── VaiTro/      # Quản lý vai trò
├── components/      # Components tái sử dụng
├── layouts/         # Layouts (MainLayout, AuthLayout)
├── services/        # API services
├── stores/          # Redux stores
├── hooks/           # Custom hooks
├── utils/           # Utilities
├── constants/       # Constants, routes, permissions
└── validators/      # Form validators
```

## 🚀 Chạy dự án

**Development:**

```bash
npm install
npm run dev
```

Ứng dụng chạy tại: `http://localhost:3000`

**Production:**

```bash
npm run build
npm run preview
```

## 🎯 Tính năng chính

### Authentication

- Đăng nhập/đăng xuất
- Phân quyền dựa trên vai trò
- Protected routes

### Quản lý nghiên cứu

- **Đề tài**: CRUD, quản lý người tham gia, sản phẩm, file
- **Đấu thầu**: Quản lý gói thầu, tiến độ
- **Đề cương thí nghiệm**: Nhà lưới, lần sử dụng, sổ bề
- **Hợp đồng**: Theo dõi hợp đồng nghiên cứu
- **Tài liệu**: Upload/download tài liệu chung
  ...

### UI/UX Features

- Table với pagination, sort, filter
- Form validation chi tiết
- Upload/preview file (PDF, Word, Excel, images)
- Responsive design
- Vietnamese locale

### Components tái sử dụng

- **ApiSelect** - Select box load data từ API
- **DanhMucSelect** - Select danh mục
- **FileUpload** - Upload file với preview
- **HeaderPageForm** - Header form thống nhất
- **PrivateRoute** - Route yêu cầu đăng nhập

## ⚙️ Cấu hình

**API Proxy** (vite.config.ts):

- `/api` → `http://localhost:3001` (backend)

**Theme** (main.tsx):

- Font chữ: System font stack
- Form spacing: Giảm khoảng cách label
- Menu: Font size 15px, font-weight 500/600

## 📝 Hướng dẫn

Chi tiết từng module:

- `DANH_MUC_GUIDE.md` - Sử dụng DanhMucSelect
- `docs/frontend-guides/` - Hướng dẫn phát triển

## 🏗️ Pattern

**CRUD Pattern**:

- Tách biệt form thêm/sửa
- Modal riêng với `themModalOpen`, `suaModalOpen`
- Methods: `handleAdd`, `handleEdit`, `handleDelete`
- Table với file preview, pagination, filters

**State Management**:

- Redux cho auth state
- Local state cho form và table data

**API Handling**:

- Services trong `src/services/`
- Error handling với notification
- Loading states

## 🔗 Links

- [React Docs](https://react.dev/)
- [Ant Design](https://ant.design/)
- [Vite Docs](https://vitejs.dev/)
