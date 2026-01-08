import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DeTai } from './entities/de-tai.entity';
import { KinhPhiNam } from './entities/kinh-phi-nam.entity';
import { SanPham } from './entities/san-pham.entity';
import { SanPhamThucTe } from './entities/san-pham-thuc-te.entity';
import { HoSoLuuTru } from './entities/ho-so-luu-tru.entity';

// Services
import { DeTaiService } from './de-tai.service';
import { KinhPhiNamService } from './kinh-phi-nam.service';
import { SanPhamService } from './san-pham.service';
import { SanPhamThucTeService } from './san-pham-thuc-te.service';
import { HoSoLuuTruService } from './ho-so-luu-tru.service';

// Controllers
import { DeTaiController } from './de-tai.controller';
import { KinhPhiNamController } from './kinh-phi-nam.controller';
import { SanPhamController } from './san-pham.controller';
import { SanPhamThucTeController } from './san-pham-thuc-te.controller';
import { HoSoLuuTruController } from './ho-so-luu-tru.controller';

// Modules
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';
import { FileHeThongModule } from '../FileHeThong/file-he-thong.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeTai,
      KinhPhiNam,
      SanPham,
      SanPhamThucTe,
      HoSoLuuTru,
    ]),
    PhanQuyenModule, // Import để sử dụng PermissionGuard
    FileHeThongModule, // Import để sử dụng FileHeThongService
  ],
  controllers: [
    DeTaiController,
    KinhPhiNamController,
    SanPhamController,
    SanPhamThucTeController,
    HoSoLuuTruController,
  ],
  providers: [
    DeTaiService,
    KinhPhiNamService,
    SanPhamService,
    SanPhamThucTeService,
    HoSoLuuTruService,
  ],
  exports: [
    DeTaiService,
    KinhPhiNamService,
    SanPhamService,
    SanPhamThucTeService,
    HoSoLuuTruService,
  ],
})
export class DeTaiModule {}
