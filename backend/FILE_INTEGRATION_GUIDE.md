# Hướng Dẫn Tích Hợp Module File Vào Module Khác

## 📋 Tổng Quan

File này hướng dẫn cách tích hợp tính năng upload file vào bất kỳ module nào (ví dụ: HopDong, NhanVien, SanPham...).

---

## 🎯 Ví Dụ: Module HopDong (Hợp Đồng)

Giả sử bạn có module **HopDong** với các trường:

- `so_hop_dong`: Số hợp đồng
- `ten_hop_dong`: Tên hợp đồng
- `ngay_ky`: Ngày ký
- **`file_hop_dong`**: File hợp đồng (PDF) ← Trường cần upload file

---

## 🔧 Bước 1: Import Module và Service

### 1.1. Trong Module (`hop-dong.module.ts`)

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HopDongController } from "./hop-dong.controller";
import { HopDongService } from "./hop-dong.service";
import { HopDong } from "./hop-dong.entity";
import { FileHeThongModule } from "../FileHeThong/file-he-thong.module"; // ← Import

@Module({
  imports: [
    TypeOrmModule.forFeature([HopDong]),
    FileHeThongModule, // ← Thêm vào imports
  ],
  controllers: [HopDongController],
  providers: [HopDongService],
})
export class HopDongModule {}
```

### 1.2. Trong Service (`hop-dong.service.ts`)

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HopDong } from "./hop-dong.entity";
import { FileHeThongService } from "../FileHeThong/file-he-thong.service"; // ← Import

@Injectable()
export class HopDongService {
  constructor(
    @InjectRepository(HopDong)
    private hopDongRepository: Repository<HopDong>,
    private fileHeThongService: FileHeThongService // ← Inject
  ) {}

  // ... methods
}
```

---

## 📝 Bước 2: Implement CRUD Có File

### 2.1. CREATE - Tạo Mới (Có Upload File)

#### **Controller (`hop-dong.controller.ts`)**

```typescript
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("hop-dong")
export class HopDongController {
  constructor(private readonly hopDongService: HopDongService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
    })
  )
  async create(
    @Body() dto: CreateHopDongDto,
    @UploadedFile() file: Express.Multer.File, // ← File từ form
    @CurrentUser() user: any
  ) {
    const data = await this.hopDongService.create(dto, file, user.id);
    return {
      success: true,
      message: "Tạo hợp đồng thành công",
      data,
    };
  }
}
```

#### **Service (`hop-dong.service.ts`)**

```typescript
async create(
  dto: CreateHopDongDto,
  file: Express.Multer.File,
  nguoi_tao_id: number,
): Promise<HopDong> {
  // 1. Tạo bản ghi hợp đồng
  const hopDong = await this.hopDongRepository.save({
    so_hop_dong: dto.so_hop_dong,
    ten_hop_dong: dto.ten_hop_dong,
    ngay_ky: dto.ngay_ky,
    // ... các trường khác
  });

  // 2. Nếu có file → Upload
  if (file) {
    await this.fileHeThongService.uploadFile(
      file,
      {
        module: 'HOP_DONG',
        ban_ghi_id: hopDong.id,
        ten_truong: 'file_hop_dong',
      },
      nguoi_tao_id,
    );
  }

  return hopDong;
}
```

---

### 2.2. READ - Xem Chi Tiết (Kèm File)

#### **Service (`hop-dong.service.ts`)**

```typescript
async findOne(id: number): Promise<any> {
  // 1. Lấy thông tin hợp đồng
  const hopDong = await this.hopDongRepository.findOne({
    where: { id },
  });

  if (!hopDong) {
    throw new NotFoundException('Không tìm thấy hợp đồng');
  }

  // 2. Lấy file (nếu có)
  const file = await this.fileHeThongService.layFile({
    module: 'HOP_DONG',
    ban_ghi_id: id,
    ten_truong: 'file_hop_dong',
  });

  // 3. Trả về kèm thông tin file
  return {
    ...hopDong,
    file_hop_dong: file, // null hoặc { id, ten_goc, url_xem, ... }
  };
}
```

---

### 2.3. UPDATE - Cập Nhật (Có Thể Đổi File)

#### **Controller (`hop-dong.controller.ts`)**

```typescript
@Patch(':id')
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 4 * 1024 * 1024 },
  }),
)
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateHopDongDto,
  @UploadedFile() file: Express.Multer.File,
  @CurrentUser() user: any,
) {
  const data = await this.hopDongService.update(id, dto, file, user.id);
  return {
    success: true,
    message: 'Cập nhật hợp đồng thành công',
    data,
  };
}
```

#### **Service (`hop-dong.service.ts`)**

```typescript
async update(
  id: number,
  dto: UpdateHopDongDto,
  file: Express.Multer.File,
  nguoi_cap_nhat_id: number,
): Promise<HopDong> {
  // 1. Cập nhật thông tin hợp đồng
  await this.hopDongRepository.update(id, {
    so_hop_dong: dto.so_hop_dong,
    ten_hop_dong: dto.ten_hop_dong,
    ngay_ky: dto.ngay_ky,
    // ... các trường khác
  });

  // 2. Nếu có file mới → Upload (sẽ tự động thay thế file cũ)
  if (file) {
    await this.fileHeThongService.uploadFile(
      file,
      {
        module: 'HOP_DONG',
        ban_ghi_id: id,
        ten_truong: 'file_hop_dong',
      },
      nguoi_cap_nhat_id,
    );
  }

  return await this.hopDongRepository.findOne({ where: { id } });
}
```

---

### 2.4. DELETE - Xóa (Cascade Xóa File)

#### **Service (`hop-dong.service.ts`)**

```typescript
async remove(id: number): Promise<void> {
  // 1. Xóa tất cả file liên quan (nếu có)
  await this.fileHeThongService.xoaFileCuaBanGhi({
    module: 'HOP_DONG',
    ban_ghi_id: id,
  });

  // 2. Xóa bản ghi hợp đồng
  await this.hopDongRepository.delete(id);
}
```

---

## 🗑️ Bước 3: API Xóa File (Không Xóa Bản Ghi)

Nếu muốn có API riêng để xóa file mà không xóa bản ghi hợp đồng:

#### **Controller (`hop-dong.controller.ts`)**

```typescript
@Delete(':id/xoa-file')
async xoaFile(
  @Param('id', ParseIntPipe) id: number,
) {
  await this.hopDongService.xoaFile(id);
  return {
    success: true,
    message: 'Xóa file thành công',
  };
}
```

#### **Service (`hop-dong.service.ts`)**

```typescript
async xoaFile(id: number): Promise<void> {
  await this.fileHeThongService.xoaFile({
    module: 'HOP_DONG',
    ban_ghi_id: id,
    ten_truong: 'file_hop_dong',
  });
}
```

---

## 📤 Bước 4: Flow Frontend (Tham Khảo)

### 4.1. Tạo Mới (Upload File)

```typescript
// Frontend code (React/Vue)
const formData = new FormData();
formData.append("so_hop_dong", "HD001");
formData.append("ten_hop_dong", "Hợp đồng ABC");
formData.append("ngay_ky", "2024-01-01");
formData.append("file", selectedFile); // File object

const response = await axios.post("/api/hop-dong", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});
```

### 4.2. Chỉnh Sửa (Đổi File)

**Trường hợp 1: Upload file mới**

```typescript
const formData = new FormData();
formData.append("so_hop_dong", "HD001-V2");
formData.append("file", newFile); // File mới

await axios.patch("/api/hop-dong/5", formData);
```

**Trường hợp 2: Xóa file (không upload file mới)**

```typescript
await axios.delete("/api/hop-dong/5/xoa-file");
```

**Trường hợp 3: Không thay đổi file**

```typescript
// Không gửi field 'file' trong formData
const data = {
  so_hop_dong: "HD001-V3",
  ten_hop_dong: "Hợp đồng ABC Updated",
};

await axios.patch("/api/hop-dong/5", data);
```

### 4.3. Hiển Thị File

```typescript
// Lấy chi tiết hợp đồng
const response = await axios.get('/api/hop-dong/5');

if (response.data.file_hop_dong) {
  const file = response.data.file_hop_dong;

  console.log('Tên file:', file.ten_goc);
  console.log('Kích thước:', file.kich_thuoc, 'bytes');
  console.log('Loại file:', file.loai_file);

  // URL để xem/download (có thời hạn 1 giờ)
  const downloadUrl = file.url_xem;

  // Hiển thị link download
  <a href={downloadUrl} target="_blank">
    Tải file: {file.ten_goc}
  </a>
}
```

---

## 📋 Bước 5: Checklist Tích Hợp

Khi tích hợp vào module mới, kiểm tra:

- [ ] Import `FileHeThongModule` vào module
- [ ] Inject `FileHeThongService` vào service
- [ ] Thêm `@UseInterceptors(FileInterceptor('file'))` vào controller
- [ ] Implement upload trong `create()`
- [ ] Implement upload trong `update()` (nếu cho phép đổi file)
- [ ] Implement lấy file trong `findOne()`
- [ ] Implement xóa file trong `remove()`
- [ ] Test API với Postman/Thunder Client
- [ ] Kiểm tra file đã lên S3 chưa

---

## 🎨 Bước 6: Mẹo Hay

### 6.1. Upload Nhiều Trường File Trong 1 Entity

Ví dụ: Nhân viên có 2 file: `anh_dai_dien` và `file_cv`

```typescript
async create(
  dto: CreateNhanVienDto,
  anhDaiDien: Express.Multer.File,
  fileCV: Express.Multer.File,
  nguoi_tao_id: number,
): Promise<NhanVien> {
  const nhanVien = await this.nhanVienRepository.save({ ...dto });

  // Upload ảnh đại diện
  if (anhDaiDien) {
    await this.fileHeThongService.uploadFile(
      anhDaiDien,
      {
        module: 'NHAN_VIEN',
        ban_ghi_id: nhanVien.id,
        ten_truong: 'anh_dai_dien',
      },
      nguoi_tao_id,
    );
  }

  // Upload file CV
  if (fileCV) {
    await this.fileHeThongService.uploadFile(
      fileCV,
      {
        module: 'NHAN_VIEN',
        ban_ghi_id: nhanVien.id,
        ten_truong: 'file_cv',
      },
      nguoi_tao_id,
    );
  }

  return nhanVien;
}
```

**Controller:**

```typescript
@Post()
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'anh_dai_dien', maxCount: 1 },
    { name: 'file_cv', maxCount: 1 },
  ]),
)
async create(
  @Body() dto: CreateNhanVienDto,
  @UploadedFiles() files: {
    anh_dai_dien?: Express.Multer.File[],
    file_cv?: Express.Multer.File[],
  },
  @CurrentUser() user: any,
) {
  const anhDaiDien = files.anh_dai_dien?.[0];
  const fileCV = files.file_cv?.[0];

  const data = await this.nhanVienService.create(
    dto,
    anhDaiDien,
    fileCV,
    user.id,
  );

  return { success: true, data };
}
```

### 6.2. Validate File Type Theo Module

Nếu muốn chỉ cho phép PDF cho hợp đồng:

```typescript
// Trong controller
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Chỉ cho phép file PDF'), false);
      }
    },
  }),
)
```

---

## ✅ Tóm Tắt

**3 bước chính:**

1. Import `FileHeThongModule` + Inject `FileHeThongService`
2. Gọi `uploadFile()` khi create/update
3. Gọi `xoaFileCuaBanGhi()` khi delete

**Rất đơn giản và reusable cho mọi module!**

---

**Chúc bạn tích hợp thành công! 🚀**
