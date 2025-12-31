# Hướng Dẫn Tích Hợp FileHeThong Vào Module Mới

## 📋 Mục Đích

Hướng dẫn này giải thích cách tích hợp module FileHeThong vào module mới (ví dụ: HopDong) để quản lý file upload.

## 🎯 Tổng Quan Tích Hợp

Module FileHeThong cung cấp:

- Upload file lên AWS S3
- Tạo presigned URL để xem file (hết hạn sau 1 giờ)
- Xóa file khỏi S3 và database
- Quản lý metadata file (tên, kích thước, loại file...)

**Nguyên tắc:**

- Mỗi module có thể có nhiều file
- Mỗi file được xác định bởi: `(module, ban_ghi_id, ten_truong)`
- Unique constraint đảm bảo 1 trường chỉ có 1 file

## 📝 Bước 1: Import FileHeThongModule

### Trong `hop-dong.module.ts`:

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HopDong } from "./hop-dong.entity";
import { HopDongService } from "./hop-dong.service";
import { HopDongController } from "./hop-dong.controller";
import { FileHeThongModule } from "../FileHeThong/file-he-thong.module"; // ← Import
import { PhanQuyenModule } from "../PhanQuyen/phan-quyen.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([HopDong]),
    FileHeThongModule, // ← Thêm vào imports
    PhanQuyenModule,
  ],
  controllers: [HopDongController],
  providers: [HopDongService],
  exports: [HopDongService],
})
export class HopDongModule {}
```

## 📝 Bước 2: Inject FileHeThongService

### Trong `hop-dong.service.ts`:

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

## 📝 Bước 3: Lấy File Khi Xem Chi Tiết

### Method `findOneWithFile()` trong Service:

```typescript
/**
 * Lấy hợp đồng kèm thông tin file
 */
async findOneWithFile(id: number): Promise<any> {
  const hopDong = await this.findOne(id);

  // Lấy file của hợp đồng (nếu có)
  const file = await this.fileHeThongService.layFile({
    module: 'HOP_DONG',        // ← Mã module (khai báo trong modules.constant.ts)
    ban_ghi_id: id,            // ← ID hợp đồng
    ten_truong: 'file_hop_dong', // ← Tên trường (tùy chọn)
  });

  return {
    ...hopDong,
    file_hop_dong: file,  // ← Thêm file vào response
  };
}
```

**Lưu ý:**

- `module`: Phải khớp với mã module trong `modules.constant.ts`
- `ban_ghi_id`: ID của bản ghi (hợp đồng, người dùng, v.v.)
- `ten_truong`: Tên trường, ví dụ: `file_hop_dong`, `anh_dai_dien`, `cv_xin_viec`
- Nếu không có file, trả về `null`

## 📝 Bước 4: Xóa File Khi Xóa Bản Ghi

### Method `remove()` trong Service:

```typescript
/**
 * Xóa hợp đồng và file liên quan
 */
async remove(id: number): Promise<{ message: string }> {
  const hopDong = await this.findOne(id);

  // Xóa file liên quan (nếu có)
  try {
    await this.fileHeThongService.xoaFileCuaBanGhi({
      module: 'HOP_DONG',
      ban_ghi_id: id,
    });
  } catch (error) {
    console.error('Lỗi khi xóa file hợp đồng:', error);
    // Không throw error, vẫn tiếp tục xóa hợp đồng
  }

  // Xóa hợp đồng
  await this.hopDongRepository.remove(hopDong);

  return { message: 'Xóa hợp đồng thành công' };
}
```

**Lưu ý:**

- `xoaFileCuaBanGhi()` xóa **TẤT CẢ** file của bản ghi đó
- Nếu chỉ muốn xóa 1 file cụ thể, dùng `xoaFile()` với `ten_truong`
- Wrap trong try-catch để tránh lỗi khi file không tồn tại

## 📝 Bước 5: API Upload File

### Trong `hop-dong.controller.ts`:

```typescript
import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { HanhDong } from "../../shared/constants/app.constants";
import { FileHeThongService } from "../FileHeThong/file-he-thong.service";
import { UploadFileDto } from "../FileHeThong/dto/file-he-thong.dto";

@Controller("hop-dong")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class HopDongController {
  constructor(
    private readonly hopDongService: HopDongService,
    private readonly fileHeThongService: FileHeThongService // ← Inject
  ) {}

  /**
   * Upload file hợp đồng
   * POST /api/hop-dong/:id/upload-file
   */
  @Post(":id/upload-file")
  @RequirePermission("HOP_DONG", HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor("file")) // ← Multer interceptor
  async uploadFile(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, // ← File từ form-data
    @CurrentUser() user: any
  ) {
    // Kiểm tra hợp đồng có tồn tại không
    await this.hopDongService.findOne(id);

    // Upload file
    const uploadDto: UploadFileDto = {
      module: "HOP_DONG",
      ban_ghi_id: id,
      ten_truong: "file_hop_dong",
    };

    const data = await this.fileHeThongService.uploadFile(
      file,
      uploadDto,
      user.id // ← ID người upload
    );

    return {
      success: true,
      data,
    };
  }
}
```

**Key Points:**

- `@UseInterceptors(FileInterceptor('file'))`: Nhận file từ form-data key `file`
- `@UploadedFile()`: Decorator để lấy file
- `uploadFile()` tự động xóa file cũ nếu đã tồn tại (unique constraint)

## 📝 Bước 6: API Xóa File

### Trong `hop-dong.controller.ts`:

```typescript
/**
 * Xóa file hợp đồng
 * DELETE /api/hop-dong/:id/xoa-file
 */
@Delete(':id/xoa-file')
@RequirePermission('HOP_DONG', HanhDong.THAO_TAC)
async deleteFile(@Param('id', ParseIntPipe) id: number) {
  // Kiểm tra hợp đồng có tồn tại không
  await this.hopDongService.findOne(id);

  // Xóa file
  await this.fileHeThongService.xoaFile({
    module: 'HOP_DONG',
    ban_ghi_id: id,
    ten_truong: 'file_hop_dong',
  });

  return {
    success: true,
    data: { message: 'Xóa file hợp đồng thành công' },
  };
}
```

## 📝 Bước 7: Thêm Module Vào Constants

### Trong `modules.constant.ts`:

```typescript
export const DANH_SACH_MODULE: ModuleInfo[] = [
  {
    ma_module: "VAI_TRO",
    ten_module: "Vai trò",
    thu_tu: 1,
  },
  {
    ma_module: "NGUOI_DUNG",
    ten_module: "Người dùng",
    thu_tu: 2,
  },
  {
    ma_module: "HOP_DONG", // ← Thêm mã module mới
    ten_module: "Hợp đồng",
    thu_tu: 3,
  },
];
```

## 🎓 Các Methods Quan Trọng

### FileHeThongService Methods:

#### 1. `uploadFile(file, uploadDto, nguoi_cap_nhat_id)`

Upload file lên S3 và lưu metadata vào database.

**Parameters:**

- `file`: File từ multer
- `uploadDto`: `{ module, ban_ghi_id, ten_truong }`
- `nguoi_cap_nhat_id`: ID người upload

**Returns:** Thông tin file + presigned URL

**Lưu ý:**

- Tự động xóa file cũ nếu đã tồn tại
- Giới hạn 4MB
- Chỉ cho phép: PDF, Word, TXT, Image

#### 2. `layFile(getFileDto)`

Lấy thông tin file theo module/ban_ghi_id/ten_truong.

**Parameters:**

- `getFileDto`: `{ module, ban_ghi_id, ten_truong }`

**Returns:** File info + presigned URL hoặc `null`

#### 3. `xoaFile(deleteFileDto)`

Xóa 1 file cụ thể.

**Parameters:**

- `deleteFileDto`: `{ module, ban_ghi_id, ten_truong }`

**Returns:** void

#### 4. `xoaFileCuaBanGhi(deleteRecordFilesDto)`

Xóa TẤT CẢ file của 1 bản ghi.

**Parameters:**

- `deleteRecordFilesDto`: `{ module, ban_ghi_id }`

**Returns:** void

#### 5. `layFileTheoId(id)`

Lấy file theo ID.

**Parameters:**

- `id`: ID file trong bảng file_he_thong

**Returns:** File info + presigned URL

## 🔍 Ví Dụ Thực Tế

### Module có nhiều file:

```typescript
// Hợp đồng có 2 file: file hợp đồng chính và phụ lục
async findOneWithFiles(id: number) {
  const hopDong = await this.findOne(id);

  // File chính
  const fileChiTiet = await this.fileHeThongService.layFile({
    module: 'HOP_DONG',
    ban_ghi_id: id,
    ten_truong: 'file_hop_dong',
  });

  // File phụ lục
  const filePhuLuc = await this.fileHeThongService.layFile({
    module: 'HOP_DONG',
    ban_ghi_id: id,
    ten_truong: 'file_phu_luc',
  });

  return {
    ...hopDong,
    file_hop_dong: fileChiTiet,
    file_phu_luc: filePhuLuc,
  };
}
```

### Upload nhiều file:

```typescript
// Upload file phụ lục
@Post(':id/upload-phu-luc')
@UseInterceptors(FileInterceptor('file'))
async uploadPhuLuc(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFile() file: Express.Multer.File,
  @CurrentUser() user: any,
) {
  const data = await this.fileHeThongService.uploadFile(
    file,
    {
      module: 'HOP_DONG',
      ban_ghi_id: id,
      ten_truong: 'file_phu_luc', // ← Tên trường khác
    },
    user.id,
  );

  return { success: true, data };
}
```

## 🐛 Troubleshooting

### Lỗi: "Module HOP_DONG không hợp lệ"

**Nguyên nhân:** Chưa thêm vào `modules.constant.ts`  
**Giải pháp:** Thêm module vào `DANH_SACH_MODULE`

### Lỗi: "Không thể upload file"

**Nguyên nhân:**

- File > 4MB
- File type không được phép
- Lỗi AWS credentials

**Giải pháp:** Kiểm tra file size, type và AWS config

### Lỗi: "Cannot inject FileHeThongService"

**Nguyên nhân:** Chưa import `FileHeThongModule`  
**Giải pháp:** Thêm vào imports array trong module

### File bị xóa nhầm

**Nguyên nhân:** Dùng `xoaFileCuaBanGhi()` thay vì `xoaFile()`  
**Giải pháp:**

- `xoaFile()`: Xóa 1 file cụ thể
- `xoaFileCuaBanGhi()`: Xóa tất cả file

## ✅ Checklist Tích Hợp

- [ ] Import `FileHeThongModule` vào module mới
- [ ] Inject `FileHeThongService` vào service
- [ ] Thêm mã module vào `modules.constant.ts`
- [ ] Tạo API upload file với `FileInterceptor`
- [ ] Tạo API xóa file
- [ ] Sử dụng `layFile()` khi lấy chi tiết
- [ ] Sử dụng `xoaFileCuaBanGhi()` khi xóa bản ghi
- [ ] Test upload/xóa file trên Postman
- [ ] Cập nhật API documentation

---

**Tạo ngày:** 31/12/2025  
**Module:** FileHeThong Integration Guide
