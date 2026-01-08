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

@Injectable()
export class DeTaiService {
  constructor(
    @InjectRepository(DeTai)
    private readonly deTaiRepository: Repository<DeTai>,
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
      'hien_trang_nghiem_thu',
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
   * Xóa đề tài (cascade delete tất cả danh sách con)
   * @param id - ID đề tài cần xóa
   */
  async xoa(id: number): Promise<void> {
    const deTai = await this.deTaiRepository.findOne({ where: { id } });

    if (!deTai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id ${id}`);
    }

    await this.deTaiRepository.remove(deTai);
  }
}
