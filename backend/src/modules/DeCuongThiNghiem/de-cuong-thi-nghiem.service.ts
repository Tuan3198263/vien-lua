import {
  Injectable,
  NotFoundException,
 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeCuongThiNghiem } from './entities/de-cuong-thi-nghiem.entity';
import { 
  CreateDeCuongThiNghiemDto, 
  UpdateDeCuongThiNghiemDto, 
  FilterDeCuongThiNghiemDto 
} from './dto/de-cuong-thi-nghiem.dto';
import { PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import { DanhSachSoLuongThiNghiemService } from './danh-sach-so-luong-thi-nghiem.service';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';

/**
 * Service xử lý logic cho module Đề Cương Thí Nghiệm
 */
@Injectable()
export class DeCuongThiNghiemService {
  constructor(
    @InjectRepository(DeCuongThiNghiem)
    private readonly deCuongThiNghiemRepository: Repository<DeCuongThiNghiem>,
    private readonly danhSachSoLuongThiNghiemService: DanhSachSoLuongThiNghiemService,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo đề cương thí nghiệm mới
   * @param createDto - Dữ liệu đề cương cần tạo
   * @param nguoi_cap_nhat_id - ID người tạo
   * @param file_de_cuong_id - ID file đề cương (nếu có upload)
   * @returns Đề cương vừa được tạo
   */
  async tao(
    createDto: CreateDeCuongThiNghiemDto, 
    nguoi_cap_nhat_id: number,
    file_de_cuong_id?: number,
  ): Promise<any> {
    const deCuong = this.deCuongThiNghiemRepository.create({
      ...createDto,
      nguoi_cap_nhat_id,
      file_de_cuong_id: file_de_cuong_id || null,
    });

    const saved = await this.deCuongThiNghiemRepository.save(deCuong);

    // Load lại relation (không cần file_de_cuong eager)
    const result = await this.deCuongThiNghiemRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat', 'deTai'],
    });

    // Lấy file động (nếu có)
    const file = await this.layFileCuaDeCuong(result.id);
    
    return {
      ...this.mapRelations(result),
      file_de_cuong: file ? {
        id: file.id,
        ten_goc: file.ten_goc,
        url_xem: file.url_xem,
      } : null,
    };
  }

  /**
   * Map thông tin relations (chỉ lấy fields cần thiết)
   * Xóa file_de_cuong_id khỏi response
   * @param deCuong - Đề cương có relations
   * @returns Đề cương với relations đã được map
   */
  private mapRelations(deCuong: any): any {
    const { file_de_cuong_id, ...rest } = deCuong; // Loại bỏ file_de_cuong_id
    return {
      ...rest,
      nguoi_cap_nhat: deCuong.nguoi_cap_nhat ? {
        id: deCuong.nguoi_cap_nhat.id,
        ho_ten: deCuong.nguoi_cap_nhat.ho_ten,
      } : null,
      deTai: deCuong.deTai ? {
        id: deCuong.deTai.id,
        ten_de_tai: deCuong.deTai.ten_de_tai,
        don_vi_phe_duyet: deCuong.deTai.don_vi_phe_duyet,
        cap_quan_ly_de_tai: deCuong.deTai.cap_quan_ly_de_tai,
        chu_nhiem_de_tai: deCuong.deTai.chu_nhiem_de_tai,
      } : null,
    };
  }

  /**
   * Lấy file của một đề cương (động, với URL)
   * @param deCuongId - ID đề cương
   * @returns Thông tin file với URL hoặc null
   */
  private async layFileCuaDeCuong(deCuongId: number): Promise<any> {
    return await this.fileHeThongService.layFile({
      module: 'DE_CUONG_THI_NGHIEM',
      ban_ghi_id: deCuongId,
      ten_truong: 'file_de_cuong',
    });
  }

  /**
   * Lấy danh sách đề cương thí nghiệm với phân trang và filter
   * @param filterDto - Thông tin phân trang và filter
   * @returns Danh sách đề cương đã phân trang
   */
  async layDanhSach(filterDto: FilterDeCuongThiNghiemDto): Promise<PaginatedResult<any>> {
    const queryBuilder = this.deCuongThiNghiemRepository
      .createQueryBuilder('de_cuong_thi_nghiem')
      .leftJoinAndSelect('de_cuong_thi_nghiem.nguoi_cap_nhat', 'nguoi_cap_nhat')
      .leftJoinAndSelect('de_cuong_thi_nghiem.deTai', 'deTai');

    // Các field được phép filter
    const allowedFields = [
      'ten_thi_nghiem',
      'loai_hinh_thi_nghiem',
      'ngay_bat_dau',
      'ngay_ket_thuc',
      'mua_vu',
      'nguoi_thuc_hien',
      'kinh_phi_ky_thuat',
      'kinh_phi_lao_dong',
      'kinh_phi_nguyen_vat_lieu',
      'ngay_tao',
      'ngay_cap_nhat',
    ];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      filterDto,
      'de_cuong_thi_nghiem',
      allowedFields,
    );

    // Filter theo tên thí nghiệm
    if (filterDto.ten_thi_nghiem) {
      queryBuilder.andWhere('de_cuong_thi_nghiem.ten_thi_nghiem LIKE :ten_thi_nghiem', {
        ten_thi_nghiem: `%${filterDto.ten_thi_nghiem}%`,
      });
    }

    // Filter theo loại hình thí nghiệm
    if (filterDto.loai_hinh_thi_nghiem) {
      queryBuilder.andWhere('de_cuong_thi_nghiem.loai_hinh_thi_nghiem LIKE :loai_hinh_thi_nghiem', {
        loai_hinh_thi_nghiem: `%${filterDto.loai_hinh_thi_nghiem}%`,
      });
    }

    // Filter theo tên đề tài
    if (filterDto.ten_de_tai) {
      queryBuilder.andWhere('deTai.ten_de_tai LIKE :ten_de_tai', {
        ten_de_tai: `%${filterDto.ten_de_tai}%`,
      });
    }

    // Filter theo cấp quản lý đề tài
    if (filterDto.cap_quan_ly_de_tai) {
      queryBuilder.andWhere('deTai.cap_quan_ly_de_tai LIKE :cap_quan_ly_de_tai', {
        cap_quan_ly_de_tai: `%${filterDto.cap_quan_ly_de_tai}%`,
      });
    }

    // Filter theo đơn vị phê duyệt
    if (filterDto.don_vi_phe_duyet) {
      queryBuilder.andWhere('deTai.don_vi_phe_duyet LIKE :don_vi_phe_duyet', {
        don_vi_phe_duyet: `%${filterDto.don_vi_phe_duyet}%`,
      });
    }

    // Lấy dữ liệu và tổng số bản ghi
    const [danhSach, total] = await queryBuilder.getManyAndCount();

    // Lấy file cho từng đề cương và map relations (parallel)
    const dataWithFiles = await Promise.all(
      danhSach.map(async (dc) => {
        const file = await this.layFileCuaDeCuong(dc.id);
        const mapped = this.mapRelations(dc);
        return {
          ...mapped,
          file_de_cuong: file ? {
            id: file.id,
            ten_goc: file.ten_goc,
            url_xem: file.url_xem,
          } : null,
        };
      }),
    );

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(dataWithFiles, total, filterDto);
  }

  /**
   * Lấy chi tiết đề cương thí nghiệm theo ID
   * @param id - ID đề cương
   * @returns Chi tiết đề cương (với relations)
   */
  async layTheoId(id: number): Promise<any> {
    const deCuong = await this.deCuongThiNghiemRepository.findOne({
      where: { id },
      relations: [
        'nguoi_cap_nhat',
        'deTai',
        'danh_sach_so_luong',
      ],
    });

    if (!deCuong) {
      throw new NotFoundException(`Không tìm thấy đề cương thí nghiệm với id ${id}`);
    }

    // Lấy file động (nếu có)
    const file = await this.layFileCuaDeCuong(id);

    return {
      ...this.mapRelations(deCuong),
      file_de_cuong: file ? {
        id: file.id,
        ten_goc: file.ten_goc,
        url_xem: file.url_xem,
      } : null,
      danh_sach_so_luong: deCuong.danh_sach_so_luong,
    };
  }

  /**
   * Cập nhật đề cương thí nghiệm
   * @param id - ID đề cương
   * @param updateDto - Dữ liệu cập nhật
   * @param nguoiCapNhatId - ID người cập nhật
   * @param file_de_cuong_id - ID file mới (nếu có thay đổi)
   * @returns Đề cương đã cập nhật
   */
  async capNhat(
    id: number,
    updateDto: UpdateDeCuongThiNghiemDto,
    nguoiCapNhatId: number,
    file_de_cuong_id?: number,
  ): Promise<any> {
    const deCuong = await this.deCuongThiNghiemRepository.findOne({ 
      where: { id },
    });

    if (!deCuong) {
      throw new NotFoundException(`Không tìm thấy đề cương thí nghiệm với id ${id}`);
    }

    // Nếu có file mới và khác file cũ, xóa file cũ
    if (file_de_cuong_id && deCuong.file_de_cuong_id && 
        file_de_cuong_id !== deCuong.file_de_cuong_id) {
      try {
        // Set file_de_cuong_id = null trước khi xóa file (tránh foreign key constraint)
        const oldFileId = deCuong.file_de_cuong_id;
        deCuong.file_de_cuong_id = null;
        await this.deCuongThiNghiemRepository.save(deCuong);
        
        // Sau đó mới xóa file
        await this.fileHeThongService.xoaFile({
          module: 'DE_CUONG_THI_NGHIEM',
          ban_ghi_id: id,
          ten_truong: 'file_de_cuong',
        });
      } catch (error) {
        console.error(`Lỗi xóa file cũ:`, error);
      }
    }

    Object.assign(deCuong, updateDto);
    deCuong.nguoi_cap_nhat_id = nguoiCapNhatId;
    
    // Cập nhật file ID nếu có
    if (file_de_cuong_id !== undefined) {
      deCuong.file_de_cuong_id = file_de_cuong_id;
    }

    const saved = await this.deCuongThiNghiemRepository.save(deCuong);

    // Load lại relation (không cần file_de_cuong eager)
    const result = await this.deCuongThiNghiemRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat', 'deTai'],
    });

    // Lấy file động (nếu có)
    const file = await this.layFileCuaDeCuong(result.id);

    return {
      ...this.mapRelations(result),
      file_de_cuong: file ? {
        id: file.id,
        ten_goc: file.ten_goc,
        url_xem: file.url_xem,
      } : null,
    };
  }

  /**
   * Xóa file đề cương (set null trước, sau đó xóa file)
   * @param id - ID đề cương
   */
  async xoaFileDeCuong(id: number): Promise<void> {
    const deCuong = await this.deCuongThiNghiemRepository.findOne({ 
      where: { id },
    });

    if (!deCuong) {
      throw new NotFoundException(`Không tìm thấy đề cương thí nghiệm với id ${id}`);
    }

    if (deCuong.file_de_cuong_id) {
      // Set file_de_cuong_id = null trước khi xóa file (tránh foreign key constraint)
      deCuong.file_de_cuong_id = null;
      await this.deCuongThiNghiemRepository.save(deCuong);
      
      // Sau đó mới xóa file
      await this.fileHeThongService.xoaFile({
        module: 'DE_CUONG_THI_NGHIEM',
        ban_ghi_id: id,
        ten_truong: 'file_de_cuong',
      });
    }
  }

  /**
   * Xóa đề cương thí nghiệm (cascade delete danh sách số lượng và files liên quan)
   * @param id - ID đề cương cần xóa
   */
  async xoa(id: number): Promise<void> {
    const deCuong = await this.deCuongThiNghiemRepository.findOne({
      where: { id },
      relations: ['danh_sach_so_luong'],
    });

    if (!deCuong) {
      throw new NotFoundException(`Không tìm thấy đề cương thí nghiệm với id ${id}`);
    }

    // Xóa file đề cương (nếu có)
    if (deCuong.file_de_cuong_id) {
      try {
        // Set file_de_cuong_id = null trước khi xóa file (tránh foreign key constraint)
        deCuong.file_de_cuong_id = null;
        await this.deCuongThiNghiemRepository.save(deCuong);
        
        // Sau đó mới xóa file
        await this.fileHeThongService.xoaFile({
          module: 'DE_CUONG_THI_NGHIEM',
          ban_ghi_id: id,
          ten_truong: 'file_de_cuong',
        });
      } catch (error) {
        console.error(`Lỗi xóa file đề cương:`, error);
      }
    }

    // Xóa danh sách số lượng (trước khi cascade delete)
    if (deCuong.danh_sach_so_luong && deCuong.danh_sach_so_luong.length > 0) {
      for (const ds of deCuong.danh_sach_so_luong) {
        try {
          await this.danhSachSoLuongThiNghiemService.xoa(ds.id);
        } catch (error) {
          console.error(`Lỗi xóa danh sách số lượng ${ds.id}:`, error);
        }
      }
    }

    await this.deCuongThiNghiemRepository.remove(deCuong);
  }
}
