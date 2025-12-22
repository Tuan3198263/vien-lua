# 🎯 Hướng dẫn Mở rộng Dự án

## 📚 Mục lục

1. [Thêm Module mới](#1-thêm-module-mới)
2. [Thêm Entity/Table mới](#2-thêm-entitytable-mới)
3. [Tạo API CRUD đầy đủ](#3-tạo-api-crud-đầy-đủ)
4. [Thêm Page mới Frontend](#4-thêm-page-mới-frontend)
5. [Thêm Authentication](#5-thêm-authentication)
6. [Thêm Validation](#6-thêm-validation)
7. [Testing](#7-testing)

---

## 1. Thêm Module mới

### Backend - Tạo Product Module

```bash
cd backend

# Dùng NestJS CLI
npx nest generate module modules/product
npx nest generate controller modules/product
npx nest generate service modules/product
```

Hoặc tạo thủ công:

**backend/src/modules/product/product.entity.ts**

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column("text")
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**backend/src/modules/product/product.module.ts**

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
```

**backend/src/modules/product/product.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @Post()
  create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() product: Partial<Product>
  ): Promise<Product> {
    return this.productService.update(+id, product);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.productService.remove(+id);
  }
}
```

**backend/src/modules/product/product.service.ts**

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.findOne(id); // Check exists
    await this.productRepository.update(id, product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
```

**Import vào AppModule (backend/src/app.module.ts)**

```typescript
import { ProductModule } from "./modules/product/product.module";

@Module({
  imports: [
    // ...existing imports
    ProductModule,
  ],
  // ...
})
export class AppModule {}
```

---

## 2. Thêm Entity/Table mới

### Tạo Category Entity với Relationship

**backend/src/modules/category/category.entity.ts**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Product } from "../product/product.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
```

**Cập nhật Product Entity để có relationship**

```typescript
import { ManyToOne, JoinColumn } from "typeorm";
import { Category } from "../category/category.entity";

@Entity("products")
export class Product {
  // ...existing columns

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;
}
```

---

## 3. Tạo API CRUD đầy đủ

### Thêm DTO và Validation

**Cài đặt dependencies**

```bash
cd backend
npm install class-validator class-transformer
```

**backend/src/modules/product/dto/create-product.dto.ts**

```typescript
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
```

**backend/src/modules/product/dto/update-product.dto.ts**

```typescript
import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

**Cập nhật Controller để dùng DTO**

```typescript
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
export class ProductController {
  // ...

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
}
```

**Enable validation globally (backend/src/main.ts)**

```typescript
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // ...rest of code
}
```

---

## 4. Thêm Page mới Frontend

### Tạo Product List Page

**frontend/src/pages/ProductList.tsx**

```typescript
import { useState, useEffect } from "react";
import { Table, Button, Space, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    { title: "Tồn kho", dataIndex: "stock", key: "stock" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          <Button icon={<EditOutlined />} size="small">
            Sửa
          </Button>
          <Button icon={<DeleteOutlined />} size="small" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách sản phẩm"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sản phẩm
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
}
```

**Cập nhật App.tsx để thêm route**

```typescript
// Nếu dùng React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";

// Trong component App
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/products" element={<ProductList />} />
</Routes>;
```

---

## 5. Thêm Authentication

### Backend - JWT Authentication

**Cài đặt packages**

```bash
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

**Tạo Auth Module**

```bash
npx nest generate module auth
npx nest generate service auth
npx nest generate controller auth
```

**backend/src/auth/auth.service.ts** (đơn giản hóa)

```typescript
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

**backend/src/auth/auth.module.ts**

```typescript
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    JwtModule.register({
      secret: "your-secret-key", // Nên dùng env variable
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
```

---

## 6. Thêm Validation

Đã hướng dẫn ở phần 3 với class-validator và DTO.

---

## 7. Testing

### Backend Unit Tests

**backend/src/modules/product/product.service.spec.ts**

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "./product.entity";

describe("ProductService", () => {
  let service: ProductService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all products", async () => {
    const products = [{ id: 1, name: "Test" }];
    mockRepository.find.mockResolvedValue(products);

    expect(await service.findAll()).toEqual(products);
  });
});
```

**Chạy tests**

```bash
npm test
npm run test:cov  # Với coverage
```

### Frontend Tests (Vitest)

**frontend/src/App.test.tsx**

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders dashboard title", () => {
    render(<App />);
    expect(screen.getByText(/Dashboard Quản Lý/i)).toBeDefined();
  });
});
```

---

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [React Documentation](https://react.dev/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 💡 Best Practices

1. **Luôn tạo DTO cho API**
2. **Validation ở cả frontend và backend**
3. **Error handling đầy đủ**
4. **Comment code bằng tiếng Việt**
5. **Write tests cho business logic quan trọng**
6. **Environment variables cho sensitive data**
7. **Pagination cho list lớn**
8. **Logging cho debug**

---

**Chúc bạn mở rộng dự án thành công!** 🚀
