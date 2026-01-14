import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeTai } from './entities/de-tai.entity';
import { CreateDeTaiDto, UpdateDeTaiDto, FilterDeTaiDto } from './dto/de-tai.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import { HoSoLuuTruService } from './ho-so-luu-tru.service';

@Injectable()
export class DeTaiService {
  constructor(
    @InjectRepository(DeTai)
    private readonly deTaiRepository: Repository<DeTai>,
    private readonly hoSoLuuTruService: HoSoLuuTruService,
  ) {}

  /**
   * Tạo đề tài mới
   * @param createDeTaiDto - Dữ liệu đề tài cần tạo
   * @param nguoi_cap_nhat_id - ID người tạo
   * @returns Đề tài vừa được tạo (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async tao(createDeTaiDto: CreateDeTaiDto, nguoi_cap_nhat_id: number): Promise<any> {
    // Validate ngày
    const ngayBatDau = new Date(createDeTaiDto.ngay_bat_dau);
    const ngayKetThuc = new Date(createDeTaiDto.ngay_ket_thuc);

    if (ngayKetThuc <= ngayBatDau) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    // Check trùng mã đề tài (nếu có)
    if (createDeTaiDto.ma_de_tai) {
      const existed = await this.deTaiRepository.findOne({
        where: { ma_de_tai: createDeTaiDto.ma_de_tai },
      });

      if (existed) {
        throw new BadRequestException('Mã đề tài đã tồn tại');
      }
    }

    const deTai = this.deTaiRepository.create({
      ...createDeTaiDto,
      nguoi_cap_nhat_id,
    });

    const saved = await this.deTaiRepository.save(deTai);

    // Load lại relation và map
    const result = await this.deTaiRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat'],
    });

    return this.mapNguoiCapNhat(result);
  }

  /**
   * Map thông tin người cập nhật (chỉ lấy id và ho_ten)
   * @param deTai - Đề tài có relation nguoi_cap_nhat
   * @returns Đề tài với nguoi_cap_nhat đã được map
   */
  private mapNguoiCapNhat(deTai: any): any {
    return {
      ...deTai,
      nguoi_cap_nhat: deTai.nguoi_cap_nhat ? {
        id: deTai.nguoi_cap_nhat.id,
        ho_ten: deTai.nguoi_cap_nhat.ho_ten,
      } : null,
    };
  }


  /**
   * Lấy danh sách đề tài với phân trang và filter
   * @param paginationDto - Thông tin phân trang và filter
   * @returns Danh sách đề tài đã phân trang (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async layDanhSach(paginationDto: PaginationDto): Promise<PaginatedResult<any>> {
    const queryBuilder = this.deTaiRepository
      .createQueryBuilder('de_tai')
      .leftJoinAndSelect('de_tai.nguoi_cap_nhat', 'nguoi_cap_nhat');

    // Các field được phép filter
    const allowedFields = [
      'ten_de_tai',
      'ma_de_tai',
      'don_vi_phe_duyet',
      'cap_quan_ly_de_tai',
      'phuong_thuc_khoang_chi',
      'noi_dung_khoang_chi',
      'linh_vuc_khoa_hoc',
      'nguon_goc_de_tai',
      'hop_dong',
      'bien_ban_thanh_ly',
      'chu_nhiem_de_tai',
      'thu_ky_de_tai',
      'thong_tin_doi_tac',
      'ngay_bat_dau',
      'ngay_ket_thuc',
      'ngay_tao',
      'ngay_cap_nhat',
    ];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'de_tai',
      allowedFields,
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [danhSach, total] = await queryBuilder.getManyAndCount();

    // Map nguoi_cap_nhat (chỉ lấy id và ho_ten)
    const dataWithMappedUser = danhSach.map(deTai => this.mapNguoiCapNhat(deTai));

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(dataWithMappedUser, total, paginationDto);
  }

  /**
   * Lấy danh sách đề tài để export (không có phân trang, có filter)
   * @param paginationDto - Thông tin filter (không dùng page/limit)
   * @returns Danh sách đề tài đầy đủ để export
   */
  async layDanhSachExport(paginationDto: PaginationDto): Promise<any[]> {
    const MAX_EXPORT_LIMIT = 100; // Giới hạn tối đa 100 bản ghi

    const queryBuilder = this.deTaiRepository
      .createQueryBuilder('de_tai')
      .leftJoinAndSelect('de_tai.nguoi_cap_nhat', 'nguoi_cap_nhat');

    // Các field được phép filter (giống layDanhSach)
    const allowedFields = [
      'ten_de_tai',
      'ma_de_tai',
      'don_vi_phe_duyet',
      'cap_quan_ly_de_tai',
      'phuong_thuc_khoang_chi',
      'noi_dung_khoang_chi',
      'linh_vuc_khoa_hoc',
      'nguon_goc_de_tai',
      'hop_dong',
      'bien_ban_thanh_ly',
      'chu_nhiem_de_tai',
      'thu_ky_de_tai',
      'thong_tin_doi_tac',
      'ngay_bat_dau',
      'ngay_ket_thuc',
      'ngay_tao',
      'ngay_cap_nhat',
    ];

    // Áp dụng field filtering NHƯNG KHÔNG áp dụng phân trang
    // Tạm thời set page=1, limit=MAX để applyQueryOptions hoạt động
    const exportDto = { ...paginationDto, page: 1, limit: MAX_EXPORT_LIMIT };
    QueryUtils.applyQueryOptions(
      queryBuilder,
      exportDto,
      'de_tai',
      allowedFields,
    );

    // Lấy dữ liệu (không cần count)
    const danhSach = await queryBuilder.getMany();

    // Kiểm tra giới hạn
    if (danhSach.length >= MAX_EXPORT_LIMIT) {
      throw new BadRequestException(
        `Số lượng bản ghi vượt quá giới hạn export (${MAX_EXPORT_LIMIT}). Vui lòng sử dụng bộ lọc để giảm dữ liệu.`,
      );
    }

    // Map nguoi_cap_nhat (chỉ lấy id và ho_ten)
    return danhSach.map(deTai => this.mapNguoiCapNhat(deTai));
  }

  /**
   * Lấy chi tiết đề tài theo ID
   * @param id - ID đề tài
   * @returns Chi tiết đề tài (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async layTheoId(id: number): Promise<any> {
    const deTai = await this.deTaiRepository.findOne({
      where: { id },
      relations: [
        'nguoi_cap_nhat',
        'danh_sach_kinh_phi',
        'danh_sach_san_pham',
        'danh_sach_san_pham_thuc_te',
        'danh_sach_ho_so',
      ],
    });

    if (!deTai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id ${id}`);
    }

    return this.mapNguoiCapNhat(deTai);
  }

  /**
   * Cập nhật đề tài
   * @param id - ID đề tài
   * @param updateDeTaiDto - Dữ liệu cập nhật
   * @param nguoiCapNhatId - ID người cập nhật
   * @returns Đề tài đã cập nhật (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async capNhat(
    id: number,
    updateDeTaiDto: UpdateDeTaiDto,
    nguoiCapNhatId: number,
  ): Promise<any> {
    const deTai = await this.deTaiRepository.findOne({ where: { id } });

    if (!deTai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id ${id}`);
    }

    // Validate ngày
    if (updateDeTaiDto.ngay_bat_dau || updateDeTaiDto.ngay_ket_thuc) {
      const ngayBatDau = new Date(
        updateDeTaiDto.ngay_bat_dau || deTai.ngay_bat_dau,
      );
      const ngayKetThuc = new Date(
        updateDeTaiDto.ngay_ket_thuc || deTai.ngay_ket_thuc,
      );

      if (ngayKetThuc <= ngayBatDau) {
        throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
      }
    }

    // Check trùng mã đề tài (nếu có update)
    if (
      updateDeTaiDto.ma_de_tai &&
      updateDeTaiDto.ma_de_tai !== deTai.ma_de_tai
    ) {
      const existed = await this.deTaiRepository.findOne({
        where: { ma_de_tai: updateDeTaiDto.ma_de_tai },
      });

      if (existed) {
        throw new BadRequestException('Mã đề tài đã tồn tại');
      }
    }

    Object.assign(deTai, updateDeTaiDto);
    deTai.nguoi_cap_nhat_id = nguoiCapNhatId;

    const saved = await this.deTaiRepository.save(deTai);

    // Load lại relation và map
    const result = await this.deTaiRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat'],
    });

    return this.mapNguoiCapNhat(result);
  }


  /**
   * Xóa đề tài (cascade delete tất cả danh sách con và files liên quan)
   * @param id - ID đề tài cần xóa
   */
  async xoa(id: number): Promise<void> {
    const deTai = await this.deTaiRepository.findOne({ 
      where: { id },
      relations: ['danh_sach_ho_so'],
    });

    if (!deTai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id ${id}`);
    }

    // Xóa files của hồ sơ lưu trữ (trước khi cascade delete)
    if (deTai.danh_sach_ho_so && deTai.danh_sach_ho_so.length > 0) {
      for (const hoSo of deTai.danh_sach_ho_so) {
        try {
          await this.hoSoLuuTruService.xoa(hoSo.id);
        } catch (error) {
          console.error(`Lỗi xóa hồ sơ lưu trữ ${hoSo.id}:`, error);
          // Tiếp tục xóa dù có lỗi
        }
      }
    }

    try {
      await this.deTaiRepository.remove(deTai);
    } catch (error: any) {
      // Xử lý lỗi foreign key constraint
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        // Parse tên bảng từ message lỗi
        const match = error.message.match(/`(\w+)`\.`(\w+)`/);
        const tableName = match ? match[2] : 'bảng khác';
        
        // Map tên bảng tiếng Anh sang tiếng Việt
        const tableNameMap: Record<string, string> = {
          'dau_thau': 'Đấu thầu',
          'kinh_phi_nam': 'Kinh phí năm',
          'san_pham': 'Sản phẩm',
          'san_pham_thuc_te': 'Sản phẩm thực tế',
          'ho_so_luu_tru': 'Hồ sơ lưu trữ',
          'de_cuong_thi_nghiem': 'Đề cương thí nghiệm',
        };

        const displayName = tableNameMap[tableName] || tableName;
        
        throw new BadRequestException(
          `Không thể xóa đề tài này vì còn ${displayName} liên quan. ` +
          `Vui lòng xóa ${displayName} trước.`
        );
      }
      
      // Ném lỗi khác
      throw error;
    }
  }
}
