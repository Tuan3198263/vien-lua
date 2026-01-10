import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DauThau } from './entities/dau-thau.entity';
import { CreateDauThauDto, UpdateDauThauDto, FilterDauThauDto } from './dto/dau-thau.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import { DanhSachDauThauService } from './danh-sach-dau-thau.service';

/**
 * Service xử lý logic cho module Đấu Thầu
 */
@Injectable()
export class DauThauService {
  constructor(
    @InjectRepository(DauThau)
    private readonly dauThauRepository: Repository<DauThau>,
    private readonly danhSachDauThauService: DanhSachDauThauService,
  ) {}

  /**
   * Tạo đấu thầu mới
   * @param createDauThauDto - Dữ liệu đấu thầu cần tạo
   * @param nguoi_cap_nhat_id - ID người tạo
   * @returns Đấu thầu vừa được tạo (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async tao(createDauThauDto: CreateDauThauDto, nguoi_cap_nhat_id: number): Promise<any> {
    const dauThau = this.dauThauRepository.create({
      ...createDauThauDto,
      nguoi_cap_nhat_id,
    });

    const saved = await this.dauThauRepository.save(dauThau);

    // Load lại relation và map
    const result = await this.dauThauRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat', 'deTai'],
    });

    return this.mapRelations(result);
  }

  /**
   * Map thông tin relations (chỉ lấy fields cần thiết)
   * @param dauThau - Đấu thầu có relations
   * @returns Đấu thầu với relations đã được map
   */
  private mapRelations(dauThau: any): any {
    return {
      ...dauThau,
      nguoi_cap_nhat: dauThau.nguoi_cap_nhat ? {
        id: dauThau.nguoi_cap_nhat.id,
        ho_ten: dauThau.nguoi_cap_nhat.ho_ten,
      } : null,
      deTai: dauThau.deTai ? {
        id: dauThau.deTai.id,
        ten_de_tai: dauThau.deTai.ten_de_tai,
        don_vi_phe_duyet: dauThau.deTai.don_vi_phe_duyet,
        cap_quan_ly_de_tai: dauThau.deTai.cap_quan_ly_de_tai,
        chu_nhiem_de_tai: dauThau.deTai.chu_nhiem_de_tai,
      } : null,
    };
  }

  /**
   * Lấy danh sách đấu thầu với phân trang và filter
   * @param filterDto - Thông tin phân trang và filter
   * @returns Danh sách đấu thầu đã phân trang
   */
  async layDanhSach(filterDto: FilterDauThauDto): Promise<PaginatedResult<any>> {
    const queryBuilder = this.dauThauRepository
      .createQueryBuilder('dau_thau')
      .leftJoinAndSelect('dau_thau.nguoi_cap_nhat', 'nguoi_cap_nhat')
      .leftJoinAndSelect('dau_thau.deTai', 'deTai');

    // Các field được phép filter
    const allowedFields = [
      'nam_thuc_hien',
      'nguon_kinh_phi',
      'tong_kinh_phi',
      'ngay_tao',
      'ngay_cap_nhat',
    ];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      filterDto,
      'dau_thau',
      allowedFields,
    );

    // Filter theo tên đề tài (nếu có)
    if (filterDto.ten_de_tai) {
      queryBuilder.andWhere('deTai.ten_de_tai LIKE :ten_de_tai', {
        ten_de_tai: `%${filterDto.ten_de_tai}%`,
      });
    }

    // Lấy dữ liệu và tổng số bản ghi
    const [danhSach, total] = await queryBuilder.getManyAndCount();

    // Map relations (chỉ lấy fields cần thiết)
    const dataWithMappedRelations = danhSach.map(dt => this.mapRelations(dt));

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(dataWithMappedRelations, total, filterDto);
  }

  /**
   * Lấy chi tiết đấu thầu theo ID
   * @param id - ID đấu thầu
   * @returns Chi tiết đấu thầu (với relations)
   */
  async layTheoId(id: number): Promise<any> {
    const dauThau = await this.dauThauRepository.findOne({
      where: { id },
      relations: [
        'nguoi_cap_nhat',
        'deTai',
        'danh_sach_dau_thau',
      ],
    });

    if (!dauThau) {
      throw new NotFoundException(`Không tìm thấy đấu thầu với id ${id}`);
    }

    return this.mapRelations(dauThau);
  }

  /**
   * Cập nhật đấu thầu
   * @param id - ID đấu thầu
   * @param updateDauThauDto - Dữ liệu cập nhật
   * @param nguoiCapNhatId - ID người cập nhật
   * @returns Đấu thầu đã cập nhật
   */
  async capNhat(
    id: number,
    updateDauThauDto: UpdateDauThauDto,
    nguoiCapNhatId: number,
  ): Promise<any> {
    const dauThau = await this.dauThauRepository.findOne({ where: { id } });

    if (!dauThau) {
      throw new NotFoundException(`Không tìm thấy đấu thầu với id ${id}`);
    }

    Object.assign(dauThau, updateDauThauDto);
    dauThau.nguoi_cap_nhat_id = nguoiCapNhatId;

    const saved = await this.dauThauRepository.save(dauThau);

    // Load lại relation và map
    const result = await this.dauThauRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat', 'deTai'],
    });

    return this.mapRelations(result);
  }

  /**
   * Xóa đấu thầu (cascade delete danh sách đấu thầu con và files liên quan)
   * @param id - ID đấu thầu cần xóa
   */
  async xoa(id: number): Promise<void> {
    const dauThau = await this.dauThauRepository.findOne({
      where: { id },
      relations: ['danh_sach_dau_thau'],
    });

    if (!dauThau) {
      throw new NotFoundException(`Không tìm thấy đấu thầu với id ${id}`);
    }

    // Xóa files của danh sách đấu thầu (trước khi cascade delete)
    if (dauThau.danh_sach_dau_thau && dauThau.danh_sach_dau_thau.length > 0) {
      for (const ds of dauThau.danh_sach_dau_thau) {
        try {
          await this.danhSachDauThauService.xoa(ds.id);
        } catch (error) {
          console.error(`Lỗi xóa danh sách đấu thầu ${ds.id}:`, error);
          // Tiếp tục xóa dù có lỗi
        }
      }
    }

    await this.dauThauRepository.remove(dauThau);
  }
}
