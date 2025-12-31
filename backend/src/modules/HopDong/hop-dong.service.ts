import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HopDong } from './hop-dong.entity';
import { CreateHopDongDto, UpdateHopDongDto } from './dto/hop-dong.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';

/**
 * Service xử lý logic cho module Hợp Đồng
 * Quản lý CRUD và tích hợp file hợp đồng
 */
@Injectable()
export class HopDongService {
  constructor(
    @InjectRepository(HopDong)
    private hopDongRepository: Repository<HopDong>,
    private fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo hợp đồng mới
   * @param createHopDongDto - Dữ liệu hợp đồng cần tạo
   * @param nguoi_cap_nhat_id - ID người tạo
   * @returns Hợp đồng vừa được tạo
   */
  async create(
    createHopDongDto: CreateHopDongDto,
    nguoi_cap_nhat_id: number,
  ): Promise<HopDong> {
    // Kiểm tra số hợp đồng đã tồn tại chưa
    const existing = await this.hopDongRepository.findOne({
      where: { so_hop_dong: createHopDongDto.so_hop_dong },
    });

    if (existing) {
      throw new ConflictException('Số hợp đồng đã tồn tại');
    }

    // Tạo hợp đồng mới
    const hopDong = this.hopDongRepository.create({
      ...createHopDongDto,
      nguoi_cap_nhat_id,
    });

    const saved = await this.hopDongRepository.save(hopDong);
    
    // Load lại relation và map
    const result = await this.hopDongRepository.findOne({
      where: { id: saved.id },
      relations: ['nguoi_cap_nhat'],
    });
    
    return this.mapNguoiCapNhat(result);
  }

  /**
   * Map thông tin người cập nhật (chỉ lấy id và ho_ten)
   * @param hopDong - Hợp đồng có relation nguoi_cap_nhat
   * @returns Hợp đồng với nguoi_cap_nhat đã được map
   */
  private mapNguoiCapNhat(hopDong: any): any {
    return {
      ...hopDong,
      nguoi_cap_nhat: hopDong.nguoi_cap_nhat ? {
        id: hopDong.nguoi_cap_nhat.id,
        ho_ten: hopDong.nguoi_cap_nhat.ho_ten,
      } : null,
    };
  }

  /**
   * Lấy file của một hợp đồng (có URL)
   * @param hopDongId - ID hợp đồng
   * @returns Thông tin file với URL hoặc null
   */
  private async layFileCuaHopDong(hopDongId: number): Promise<any> {
    return await this.fileHeThongService.layFile({
      module: 'HOP_DONG',
      ban_ghi_id: hopDongId,
      ten_truong: 'file_hop_dong',
    });
  }

  /**
   * Lấy danh sách hợp đồng với phân trang và filter
   * Bao gồm thông tin file (id, tên, url) của mỗi hợp đồng
   * @param paginationDto - Thông tin phân trang và filter
   * @returns Danh sách hợp đồng đã phân trang kèm file
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<any>> {
    // Tạo query builder
    const queryBuilder = this.hopDongRepository
      .createQueryBuilder('hop_dong')
      .leftJoinAndSelect('hop_dong.nguoi_cap_nhat', 'nguoi_dung');

    // Các field được phép filter
    const allowedFields = [
      'so_hop_dong',
      'doi_tac',
      'ghi_chu',
      'ngay_cap_nhat',
    ];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'hop_dong',
      allowedFields,
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [hopDongs, total] = await queryBuilder.getManyAndCount();

    // Lấy file cho từng hợp đồng và map nguoi_cap_nhat (parallel)
    const dataWithFiles = await Promise.all(
      hopDongs.map(async (hopDong) => {
        const file = await this.layFileCuaHopDong(hopDong.id);
        const mapped = this.mapNguoiCapNhat(hopDong);
        return {
          ...mapped,
          file_hop_dong: file ? {
            id: file.id,
            ten_goc: file.ten_goc,
            url_xem: file.url_xem,
          } : null,
        };
      }),
    );

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(dataWithFiles, total, paginationDto);
  }

  /**
   * Lấy thông tin chi tiết hợp đồng theo ID
   * @param id - ID hợp đồng
   * @returns Thông tin hợp đồng (với nguoi_cap_nhat chỉ có id và ho_ten)
   */
  async findOne(id: number): Promise<any> {
    const hopDong = await this.hopDongRepository.findOne({
      where: { id },
      relations: ['nguoi_cap_nhat'],
    });

    if (!hopDong) {
      throw new NotFoundException(`Không tìm thấy hợp đồng với ID ${id}`);
    }

    return this.mapNguoiCapNhat(hopDong);
  }

  /**
   * Lấy hợp đồng kèm thông tin file (không cần URL)
   * @param id - ID hợp đồng
   * @returns Hợp đồng kèm thông tin file (id, tên)
   */
  async findOneWithFile(id: number): Promise<any> {
    const hopDong = await this.findOne(id);

    // Lấy file của hợp đồng (nếu có)
    const file = await this.layFileCuaHopDong(id);

    return {
      ...hopDong,
      file_hop_dong: file ? {
        id: file.id,
        ten_goc: file.ten_goc,
      } : null,
    };
  }

  /**
   * Cập nhật hợp đồng
   * @param id - ID hợp đồng cần cập nhật
   * @param updateHopDongDto - Dữ liệu cần cập nhật
   * @param nguoi_cap_nhat_id - ID người cập nhật
   * @returns Hợp đồng đã cập nhật
   */
  async update(
    id: number,
    updateHopDongDto: UpdateHopDongDto,
    nguoi_cap_nhat_id: number,
  ): Promise<HopDong> {
    // Kiểm tra hợp đồng có tồn tại không
    const hopDong = await this.findOne(id);

    // Nếu cập nhật số hợp đồng, kiểm tra trùng lặp
    if (
      updateHopDongDto.so_hop_dong &&
      updateHopDongDto.so_hop_dong !== hopDong.so_hop_dong
    ) {
      const existing = await this.hopDongRepository.findOne({
        where: { so_hop_dong: updateHopDongDto.so_hop_dong },
      });

      if (existing) {
        throw new ConflictException('Số hợp đồng đã tồn tại');
      }
    }

    // Cập nhật thông tin
    Object.assign(hopDong, updateHopDongDto);
    hopDong.nguoi_cap_nhat_id = nguoi_cap_nhat_id;

    const updated = await this.hopDongRepository.save(hopDong);
    
    // Load lại relation và map
    const result = await this.hopDongRepository.findOne({
      where: { id: updated.id },
      relations: ['nguoi_cap_nhat'],
    });
    
    return this.mapNguoiCapNhat(result);
  }

  /**
   * Xóa hợp đồng và file liên quan
   * @param id - ID hợp đồng cần xóa
   * @returns Thông báo xóa thành công
   */
  async remove(id: number): Promise<{ message: string }> {
    // Kiểm tra hợp đồng có tồn tại không
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
}
