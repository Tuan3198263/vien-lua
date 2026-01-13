# Hướng Dẫn Tích Hợp Module FileHeThong Vào Module Khác

## 📋 Tổng Quan

Tài liệu này hướng dẫn cách tích hợp chức năng upload/quản lý file từ **module FileHeThong** vào các module khác trong hệ thống (ví dụ: HopDong, NguoiDung, SanPham...).

**Lưu ý quan trọng:** Module FileHeThong **KHÔNG được sử dụng độc lập**. Nó chỉ được gọi và sử dụng thông qua các module khác. Tất cả các thao tác file (upload, xóa, xem) đều được thực hiện thông qua API của module cha (HopDong, NguoiDung...), không trực tiếp gọi API của FileHeThong.

---

## 🎯 Cách Thức Hoạt Động

### Kiến Trúc Module FileHeThong

FileHeThong là một **service module** cung cấp các chức năng:

- Upload file lên AWS S3
- Lưu metadata file vào database
- Tạo presigned URL để xem/download file (URL có thời hạn 1 giờ)
- Xóa file khỏi S3 và database
- Tự động thay thế file cũ khi upload file mới cho cùng một trường

### Entity FileHeThong

Mỗi file được lưu với các thông tin:

- `ten_goc`: Tên file gốc do người dùng upload
- `ten_luu_tru`: Tên file unique trên S3 (tránh trùng lặp)
- `duong_dan_s3`: Đường dẫn đầy đủ trên S3
- `kich_thuoc`: Kích thước file (bytes)
- `loai_file`: MIME type (application/pdf, image/png...)
- **`module`**: Module sử dụng file (HOP_DONG, NGUOI_DUNG...)
- **`ban_ghi_id`**: ID bản ghi trong module
- **`ten_truong`**: Tên trường file (file_hop_dong, anh_dai_dien...)
- `nguoi_cap_nhat`: ID người upload file

### Unique Constraint

File được xác định duy nhất bởi: `(module, ban_ghi_id, ten_truong)`

Điều này đảm bảo:

- Mỗi bản ghi chỉ có 1 file cho 1 trường cụ thể
- Upload file mới sẽ tự động thay thế file cũ
- Có thể có nhiều trường file cho 1 bản ghi (ví dụ: hợp đồng chính + phụ lục)

---

## 🔧 Bước 1: Setup Module

### 1.1. Import FileHeThongModule

Trong file module của bạn (ví dụ: `hop-dong.module.ts`):

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
    // ... các module khác
  ],
  controllers: [HopDongController],
  providers: [HopDongService],
})
export class HopDongModule {}
```

### 1.2. Inject FileHeThongService

Trong service của module (ví dụ: `hop-dong.service.ts`):

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

Trong controller của module (ví dụ: `hop-dong.controller.ts`):

```typescript
import { Controller } from "@nestjs/common";
import { HopDongService } from "./hop-dong.service";
import { FileHeThongService } from "../FileHeThong/file-he-thong.service"; // ← Import

@Controller("hop-dong")
export class HopDongController {
  constructor(
    private readonly hopDongService: HopDongService,
    private readonly fileHeThongService: FileHeThongService // ← Inject
  ) {}

  // ... methods
}
```

### 1.3. Khai Báo Module Trong Constants

Trong file `src/shared/constants/modules.constant.ts`, thêm module vào danh sách:

```typescript
export const DANH_SACH_MODULE: ModuleInfo[] = [
  // ... các module khác
  {
    ma_module: "HOP_DONG",
    ten_module: "Hợp đồng",
    thu_tu: 3,
  },
];
```

---

## 📝 Bước 2: Implement CRUD Có File

### 2.1. CREATE - Tạo Mới Kèm File

**Controller:**

```typescript
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { HopDongService } from "./hop-dong.service";
import { FileHeThongService } from "../FileHeThong/file-he-thong.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { HanhDong } from "../../shared/constants/hanh-dong.enum";

@Controller("hop-dong")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class HopDongController {
  constructor(
    private readonly hopDongService: HopDongService,
    private readonly fileHeThongService: FileHeThongService // ← Inject
  ) {}

  /**
   * Tạo hợp đồng kèm file
   * POST /api/hop-dong
   * Content-Type: multipart/form-data
   */
  @Post()
  @RequirePermission("HOP_DONG", HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor("file"))
  async createWithFile(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    // Validate
    if (!body.so_hop_dong || !body.doi_tac) {
      throw new BadRequestException("Thiếu thông tin bắt buộc");
    }

    // 1. Tạo hợp đồng trước
    const hopDong = await this.hopDongService.create(
      {
        so_hop_dong: body.so_hop_dong,
        doi_tac: body.doi_tac,
        ghi_chu: body.ghi_chu,
      },
      user.id
    );

    // 2. Upload file (nếu có)
    let fileInfo = null;
    if (file) {
      try {
        fileInfo = await this.fileHeThongService.uploadFile(
          file,
          {
            module: "HOP_DONG",
            ban_ghi_id: hopDong.id,
            ten_truong: "file_hop_dong",
          },
          user.id
        );
      } catch (error) {
        console.error("Lỗi upload file:", error);
        // Không throw error, vẫn trả về hợp đồng
      }
    }

    return {
      success: true,
      data: {
        ...hopDong,
        file_hop_dong: fileInfo,
      },
    };
  }
}
```

**Service:**

```typescript
async create(dto: CreateHopDongDto, nguoi_cap_nhat_id: number): Promise<HopDong> {
  // Validate nghiệp vụ
  const existing = await this.hopDongRepository.findOne({
    where: { so_hop_dong: dto.so_hop_dong },
  });
  if (existing) {
    throw new ConflictException('Số hợp đồng đã tồn tại');
  }

  // Tạo bản ghi
  const hopDong = this.hopDongRepository.create({
    ...dto,
    nguoi_cap_nhat_id,
  });

  return await this.hopDongRepository.save(hopDong);
}
```

### 2.2. READ - Xem Chi Tiết Kèm File

**Controller:**

```typescript
/**
 * Lấy chi tiết hợp đồng
 * GET /api/hop-dong/:id
 */
@Get(':id')
@RequirePermission('HOP_DONG', HanhDong.XEM)
async findOne(@Param('id', ParseIntPipe) id: number) {
  const data = await this.hopDongService.findOneWithFile(id);
  return {
    success: true,
    data,
  };
}
```

**Service:**

```typescript
/**
 * Lấy hợp đồng kèm thông tin file
 */
async findOneWithFile(id: number): Promise<any> {
  // 1. Lấy thông tin hợp đồng
  const hopDong = await this.hopDongRepository.findOne({
    where: { id },
    relations: ['nguoi_cap_nhat'],
  });

  if (!hopDong) {
    throw new NotFoundException(`Không tìm thấy hợp đồng với ID ${id}`);
  }

  // 2. Lấy file (nếu có)
  const file = await this.fileHeThongService.layFile({
    module: 'HOP_DONG',
    ban_ghi_id: id,
    ten_truong: 'file_hop_dong',
  });

  // 3. Map relation (chỉ lấy id và ho_ten)
  return {
    ...hopDong,
    nguoi_cap_nhat: hopDong.nguoi_cap_nhat ? {
      id: hopDong.nguoi_cap_nhat.id,
      ho_ten: hopDong.nguoi_cap_nhat.ho_ten,
    } : null,
    file_hop_dong: file ? {
      id: file.id,
      ten_goc: file.ten_goc,
    } : null,
  };
}
```

### 2.3. READ - Danh Sách Kèm File

**Service:**

```typescript
/**
 * Lấy danh sách hợp đồng (có phân trang)
 */
async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<any>> {
  // 1. Query builder
  const queryBuilder = this.hopDongRepository
    .createQueryBuilder('hop_dong')
    .leftJoinAndSelect('hop_dong.nguoi_cap_nhat', 'nguoi_dung');

  // 2. Áp dụng filter + phân trang
  const allowedFields = ['so_hop_dong', 'doi_tac', 'ghi_chu', 'ngay_cap_nhat'];
  QueryUtils.applyQueryOptions(queryBuilder, paginationDto, 'hop_dong', allowedFields);

  // 3. Lấy dữ liệu
  const [hopDongs, total] = await queryBuilder.getManyAndCount();

  // 4. Lấy file cho từng hợp đồng (parallel)
  const dataWithFiles = await Promise.all(
    hopDongs.map(async (hopDong) => {
      const file = await this.fileHeThongService.layFile({
        module: 'HOP_DONG',
        ban_ghi_id: hopDong.id,
        ten_truong: 'file_hop_dong',
      });

      return {
        ...hopDong,
        nguoi_cap_nhat: hopDong.nguoi_cap_nhat ? {
          id: hopDong.nguoi_cap_nhat.id,
          ho_ten: hopDong.nguoi_cap_nhat.ho_ten,
        } : null,
        file_hop_dong: file ? {
          id: file.id,
          ten_goc: file.ten_goc,
          url_xem: file.url_xem,
        } : null,
      };
    }),
  );

  // 5. Trả về kết quả phân trang
  return QueryUtils.createPaginatedResult(dataWithFiles, total, paginationDto);
}
```

### 2.4. UPDATE - Cập Nhật Kèm File

**Controller:**

```typescript
/**
 * Cập nhật hợp đồng (có thể thay file)
 * PATCH /api/hop-dong/:id
 * Content-Type: multipart/form-data
 *
 * Fields:
 * - so_hop_dong, doi_tac, ghi_chu: cập nhật thông tin
 * - file: upload file mới (tự động thay thế file cũ)
 * - xoa_file: true/false (xóa file hiện tại)
 */
@Patch(':id')
@RequirePermission('HOP_DONG', HanhDong.THAO_TAC)
@UseInterceptors(FileInterceptor('file'))
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
  @CurrentUser() user: any,
) {
  // 1. Cập nhật thông tin (nếu có)
  let hopDong = null;
  if (body.so_hop_dong || body.doi_tac || body.ghi_chu) {
    hopDong = await this.hopDongService.update(
      id,
      {
        so_hop_dong: body.so_hop_dong,
        doi_tac: body.doi_tac,
        ghi_chu: body.ghi_chu,
      },
      user.id,
    );
  } else {
    hopDong = await this.hopDongService.findOne(id);
  }

  // 2. Xóa file (nếu yêu cầu)
  if (body.xoa_file === 'true' || body.xoa_file === true) {
    try {
      await this.fileHeThongService.xoaFile({
        module: 'HOP_DONG',
        ban_ghi_id: id,
        ten_truong: 'file_hop_dong',
      });
    } catch (error) {
      console.error('Lỗi xóa file:', error);
    }
  }

  // 3. Upload file mới (nếu có)
  let fileInfo = null;
  if (file) {
    try {
      fileInfo = await this.fileHeThongService.uploadFile(
        file,
        {
          module: 'HOP_DONG',
          ban_ghi_id: id,
          ten_truong: 'file_hop_dong',
        },
        user.id,
      );
    } catch (error) {
      console.error('Lỗi upload file:', error);
    }
  }

  return {
    success: true,
    data: {
      ...hopDong,
      file_hop_dong: fileInfo,
    },
  };
}
```

### 2.5. DELETE - Xóa Bản Ghi Và File

**Service:**

```typescript
/**
 * Xóa hợp đồng (bao gồm file nếu có)
 */
async remove(id: number): Promise<{ message: string }> {
  // 1. Kiểm tra tồn tại
  const hopDong = await this.findOne(id);

  // 2. Xóa TẤT CẢ file liên quan (nếu có)
  try {
    await this.fileHeThongService.xoaFileCuaBanGhi({
      module: 'HOP_DONG',
      ban_ghi_id: id,
    });
  } catch (error) {
    console.error('Lỗi xóa file:', error);
    // Không throw, vẫn xóa hợp đồng
  }

  // 3. Xóa bản ghi
  await this.hopDongRepository.remove(hopDong);

  return { message: 'Xóa hợp đồng thành công' };
}
```

---

## 🔍 Các Methods Của FileHeThongService

### 1. `uploadFile(file, uploadDto, nguoi_cap_nhat_id)`

Upload file lên S3 và lưu metadata vào database. Tự động thay thế file cũ nếu đã tồn tại.

**Parameters:**

- `file`: File object từ multer
- `uploadDto`: `{ module, ban_ghi_id, ten_truong }`
- `nguoi_cap_nhat_id`: ID người upload

**Returns:**

```typescript
{
  id: number;
  ten_goc: string;
  ten_luu_tru: string;
  duong_dan_s3: string;
  kich_thuoc: number;
  loai_file: string;
  url_xem: string; // Presigned URL (hết hạn sau 1 giờ)
  // ... các field khác
}
```

**Giới hạn:**

- Kích thước: tối đa 4MB
- Loại file: PDF, Word, TXT, Image (png, jpg, jpeg, gif)

### 2. `layFile(getFileDto)`

Lấy thông tin file theo module/ban_ghi_id/ten_truong.

**Parameters:**

- `getFileDto`: `{ module, ban_ghi_id, ten_truong }`

**Returns:** File info + presigned URL hoặc `null` nếu không tìm thấy

### 3. `layFileTheoId(id)`

Lấy file theo ID.

**Parameters:**

- `id`: ID file

**Returns:** File info + presigned URL

### 4. `xoaFile(deleteFileDto)`

Xóa 1 file cụ thể (xóa khỏi S3 và database).

**Parameters:**

- `deleteFileDto`: `{ module, ban_ghi_id, ten_truong }`

**Returns:** void

### 5. `xoaFileCuaBanGhi(deleteRecordFilesDto)`

Xóa **TẤT CẢ** file của 1 bản ghi (dùng khi xóa bản ghi).

**Parameters:**

- `deleteRecordFilesDto`: `{ module, ban_ghi_id }`

**Returns:** void

---

## 🎨 Use Cases Nâng Cao

### Case 1: Module Có Nhiều File

Ví dụ: Nhân viên có 2 file: `anh_dai_dien` và `file_cv`

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
  @UploadedFiles()
  files: {
    anh_dai_dien?: Express.Multer.File[];
    file_cv?: Express.Multer.File[];
  },
  @CurrentUser() user: any,
) {
  // Tạo nhân viên
  const nhanVien = await this.nhanVienService.create(dto, user.id);

  // Upload ảnh đại diện
  if (files.anh_dai_dien?.[0]) {
    await this.fileHeThongService.uploadFile(
      files.anh_dai_dien[0],
      {
        module: 'NHAN_VIEN',
        ban_ghi_id: nhanVien.id,
        ten_truong: 'anh_dai_dien',
      },
      user.id,
    );
  }

  // Upload CV
  if (files.file_cv?.[0]) {
    await this.fileHeThongService.uploadFile(
      files.file_cv[0],
      {
        module: 'NHAN_VIEN',
        ban_ghi_id: nhanVien.id,
        ten_truong: 'file_cv',
      },
      user.id,
    );
  }

  return { success: true, data: nhanVien };
}
```

**Lấy nhiều file:**

```typescript
async findOneWithFiles(id: number): Promise<any> {
  const nhanVien = await this.nhanVienRepository.findOne({ where: { id } });

  // Lấy ảnh đại diện
  const anhDaiDien = await this.fileHeThongService.layFile({
    module: 'NHAN_VIEN',
    ban_ghi_id: id,
    ten_truong: 'anh_dai_dien',
  });

  // Lấy CV
  const fileCV = await this.fileHeThongService.layFile({
    module: 'NHAN_VIEN',
    ban_ghi_id: id,
    ten_truong: 'file_cv',
  });

  return {
    ...nhanVien,
    anh_dai_dien: anhDaiDien,
    file_cv: fileCV,
  };
}
```

### Case 2: Validate File Type Riêng

Chỉ cho phép PDF cho hợp đồng:

```typescript
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Chỉ chấp nhận file PDF'), false);
      }
    },
  }),
)
```

---

## ✅ Checklist Tích Hợp

Khi tích hợp FileHeThong vào module mới:

- [ ] Import `FileHeThongModule` vào module
- [ ] Inject `FileHeThongService` vào service và controller
- [ ] Thêm mã module vào `modules.constant.ts`
- [ ] Implement upload file trong controller (sử dụng `FileInterceptor`)
- [ ] Gọi `uploadFile()` sau khi tạo/cập nhật bản ghi
- [ ] Gọi `layFile()` khi xem chi tiết
- [ ] Gọi `xoaFileCuaBanGhi()` khi xóa bản ghi
- [ ] Map relation để chỉ trả về thông tin cần thiết
- [ ] Test các trường hợp: upload, update, xóa file
- [ ] Kiểm tra file trên S3 (AWS Console)

---

## 🐛 Troubleshooting

### Lỗi: "Module XXX không hợp lệ"

**Nguyên nhân:** Chưa khai báo module trong `modules.constant.ts`  
**Giải pháp:** Thêm vào `DANH_SACH_MODULE`

### Lỗi: "Cannot inject FileHeThongService"

**Nguyên nhân:** Chưa import `FileHeThongModule`  
**Giải pháp:** Thêm `FileHeThongModule` vào imports array

### File không upload được

**Nguyên nhân:**

- File > 4MB
- Loại file không được phép
- Lỗi AWS credentials/S3 config

**Giải pháp:** Kiểm tra file size, type và cấu hình AWS

### URL xem file hết hạn

**Nguyên nhân:** Presigned URL có thời hạn 1 giờ  
**Giải pháp:** Gọi lại API để lấy URL mới

---

## 📚 Tài Liệu Liên Quan

- [BACKEND_STYLE_GUIDE.md](./BACKEND_STYLE_GUIDE.md) - Quy tắc coding backend
- [HOP_DONG_API_GUIDE.md](./HOP_DONG_API_GUIDE.md) - Ví dụ API module HopDong

---

**Cập nhật:** 07/01/2026  
**Version:** 2.0
