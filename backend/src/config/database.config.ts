import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

// Import tất cả entities (phải import thủ công để tránh lỗi runtime)
import { VaiTro } from '../modules/VaiTro/vai-tro.entity';
import { NguoiDung } from '../modules/NguoiDung/nguoi-dung.entity';
import { PhanQuyen } from '../modules/PhanQuyen/phan-quyen.entity';
import { FileHeThong } from '../modules/FileHeThong/file-he-thong.entity';
import { HopDong } from '../modules/HopDong/hop-dong.entity';
import { DeTai } from '../modules/DeTai/entities/de-tai.entity';
import { KinhPhiNam } from '../modules/DeTai/entities/kinh-phi-nam.entity';
import { SanPham } from '../modules/DeTai/entities/san-pham.entity';
import { SanPhamThucTe } from '../modules/DeTai/entities/san-pham-thuc-te.entity';
import { HoSoLuuTru } from '../modules/DeTai/entities/ho-so-luu-tru.entity';
import { DauThau } from '../modules/DauThau/entities/dau-thau.entity';
import { DanhSachDauThau } from '../modules/DauThau/entities/danh-sach-dau-thau.entity';

/**
 * Cấu hình kết nối database
 * Sử dụng TypeORM để kết nối MySQL
 * 
 * LƯU Ý: Khi thêm module mới có entity, phải import thủ công vào đây
 */
@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      
      // Import thủ công tất cả entities (bao gồm cả sub-entities)
      entities: [
        VaiTro,
        NguoiDung,
        PhanQuyen,
        FileHeThong,
        HopDong,
        DeTai,
        KinhPhiNam,
        SanPham,
        SanPhamThucTe,
        HoSoLuuTru,
        DauThau,
        DanhSachDauThau,
      ],
      
      // Chỉ bật synchronize trong development
      // KHÔNG bật trong production
      synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
      
      // Tắt logging để giảm log query
      logging: false,
      
      // Timezone
      timezone: '+07:00',
      
      // Connection pool
      extra: {
        connectionLimit: 10,
      },
    };
  }
}
