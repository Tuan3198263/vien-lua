import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhaLuoi } from './nha-luoi.entity';
import { CreateNhaLuoiDto, UpdateNhaLuoiDto, FilterNhaLuoiDto } from './dto/nha-luoi.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';

/**
 * Service xử lý logic cho module Nhà Lưới
 * Quản lý CRUD nhà lưới trong hệ thống
 */
@Injectable()
export class NhaLuoiService {
  constructor(
    @InjectRepository(NhaLuoi)
    private nhaLuoiRepository: Repository<NhaLuoi>,
  ) {}

  /**
   * Tạo nhà lưới mới
   * @param createNhaLuoiDto - Dữ liệu nhà lưới cần tạo
   * @param nguoi_cap_nhat_id - ID người tạo
   * @returns Nhà lưới vừa được tạo (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async tao(
    createNhaLuoiDto: CreateNhaLuoiDto,
    nguoi_cap_nhat_id: number,
  ): Promise<any> {
    // Tạo nhà lưới mới
    const nhaLuoi = this.nhaLuoiRepository.create({
      ...createNhaLuoiDto,
      nguoi_cap_nhat_id,
    });

    const saved = await this.nhaLuoiRepository.save(nhaLuoi);

    // Load lại relation và map
    const result = await this.nhaLuoiRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat'],
    });

    return this.mapNguoiCapNhat(result);
  }

  /**
   * Map thông tin người cập nhật (chỉ lấy id và ho_ten)
   * @param nhaLuoi - Nhà lưới có relation nguoi_cap_nhat
   * @returns Nhà lưới với nguoi_cap_nhat đã được map
   */
  private mapNguoiCapNhat(nhaLuoi: any): any {
    return {
      ...nhaLuoi,
      nguoi_cap_nhat: nhaLuoi.nguoi_cap_nhat
        ? {
            id: nhaLuoi.nguoi_cap_nhat.id,
            ho_ten: nhaLuoi.nguoi_cap_nhat.ho_ten,
          }
        : null,
    };
  }

  /**
   * Lấy danh sách nhà lưới với phân trang và filter
   * @param filterDto - Thông tin phân trang và filter
   * @returns Danh sách nhà lưới đã phân trang
   */
  async layDanhSach(
    filterDto: FilterNhaLuoiDto,
  ): Promise<PaginatedResult<any>> {
    // Tạo query builder
    const queryBuilder = this.nhaLuoiRepository
      .createQueryBuilder('nha_luoi')
      .leftJoinAndSelect('nha_luoi.nguoi_cap_nhat', 'nguoi_dung');

    // Các field được phép filter (string fields dùng LIKE)
    const allowedFields = ['ten_nha_luoi', 'khu'];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      filterDto,
      'nha_luoi',
      allowedFields,
    );

    // Filter theo số bể (exact match)
    if (filterDto.so_be !== undefined && filterDto.so_be !== null) {
      queryBuilder.andWhere('nha_luoi.so_be = :so_be', {
        so_be: filterDto.so_be,
      });
    }

    // Filter theo diện tích (exact match)
    if (filterDto.dien_tich !== undefined && filterDto.dien_tich !== null) {
      queryBuilder.andWhere('nha_luoi.dien_tich = :dien_tich', {
        dien_tich: filterDto.dien_tich,
      });
    }

    // Lấy dữ liệu và tổng số bản ghi
    const [danhSach, total] = await queryBuilder.getManyAndCount();

    // Map nguoi_cap_nhat (chỉ lấy id và ho_ten)
    const dataWithMappedRelations = danhSach.map((nl) =>
      this.mapNguoiCapNhat(nl),
    );

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(
      dataWithMappedRelations,
      total,
      filterDto,
    );
  }

  /**
   * Lấy chi tiết nhà lưới theo ID
   * @param id - ID nhà lưới
   * @returns Chi tiết nhà lưới (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async layTheoId(id: number): Promise<any> {
    const nhaLuoi = await this.nhaLuoiRepository.findOne({
      where: { id },
      relations: ['nguoi_cap_nhat'],
    });

    if (!nhaLuoi) {
      throw new NotFoundException(`Không tìm thấy nhà lưới với ID ${id}`);
    }

    return this.mapNguoiCapNhat(nhaLuoi);
  }

  /**
   * Cập nhật nhà lưới
   * @param id - ID nhà lưới cần cập nhật
   * @param updateNhaLuoiDto - Dữ liệu cần cập nhật
   * @param nguoi_cap_nhat_id - ID người cập nhật
   * @returns Nhà lưới đã cập nhật (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async capNhat(
    id: number,
    updateNhaLuoiDto: UpdateNhaLuoiDto,
    nguoi_cap_nhat_id: number,
  ): Promise<any> {
    // Kiểm tra nhà lưới có tồn tại không
    const nhaLuoi = await this.nhaLuoiRepository.findOne({ where: { id } });

    if (!nhaLuoi) {
      throw new NotFoundException(`Không tìm thấy nhà lưới với ID ${id}`);
    }

    // Cập nhật thông tin
    Object.assign(nhaLuoi, updateNhaLuoiDto);
    nhaLuoi.nguoi_cap_nhat_id = nguoi_cap_nhat_id;

    const updated = await this.nhaLuoiRepository.save(nhaLuoi);

    // Load lại relation và map
    const result = await this.nhaLuoiRepository.findOne({
      where: { id: updated.id },
      relations: ['nguoi_cap_nhat'],
    });

    return this.mapNguoiCapNhat(result);
  }

  /**
   * Xóa nhà lưới
   * @param id - ID nhà lưới cần xóa
   * @returns Thông báo xóa thành công
   */
  async xoa(id: number): Promise<{ message: string }> {
    // Kiểm tra nhà lưới có tồn tại không
    const nhaLuoi = await this.nhaLuoiRepository.findOne({ where: { id } });

    if (!nhaLuoi) {
      throw new NotFoundException(`Không tìm thấy nhà lưới với ID ${id}`);
    }

    // Xóa nhà lưới
    await this.nhaLuoiRepository.remove(nhaLuoi);

    return { message: 'Xóa nhà lưới thành công' };
  }
}
