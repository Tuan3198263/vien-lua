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

    return await this.hopDongRepository.save(hopDong);
  }

  /**
   * Lấy danh sách hợp đồng với phân trang và filter
   * @param paginationDto - Thông tin phân trang và filter
   * @returns Danh sách hợp đồng đã phân trang
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<HopDong>> {
    // Tạo query builder
    const queryBuilder = this.hopDongRepository
      .createQueryBuilder('hop_dong')
      .leftJoinAndSelect('hop_dong.nguoi_cap_nhat', 'nguoi_dung');

    // Các field được phép filter
    const allowedFields = ['so_hop_dong', 'doi_tac', 'ghi_chu'];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'hop_dong',
      allowedFields,
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [data, total] = await queryBuilder.getManyAndCount();

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(data, total, paginationDto);
  }

  /**
   * Lấy thông tin chi tiết hợp đồng theo ID
   * @param id - ID hợp đồng
   * @returns Thông tin hợp đồng
   */
  async findOne(id: number): Promise<HopDong> {
    const hopDong = await this.hopDongRepository.findOne({
      where: { id },
      relations: ['nguoi_cap_nhat'],
    });

    if (!hopDong) {
      throw new NotFoundException(`Không tìm thấy hợp đồng với ID ${id}`);
    }

    return hopDong;
  }

  /**
   * Lấy hợp đồng kèm thông tin file
   * @param id - ID hợp đồng
   * @returns Hợp đồng kèm thông tin file
   */
  async findOneWithFile(id: number): Promise<any> {
    const hopDong = await this.findOne(id);

    // Chỉ lấy thông tin cần thiết từ nguoi_cap_nhat
    const result: any = {
      ...hopDong,
      nguoi_cap_nhat: hopDong.nguoi_cap_nhat ? {
        id: hopDong.nguoi_cap_nhat.id,
        ho_ten: hopDong.nguoi_cap_nhat.ho_ten,
      } : null,
    };

    // Lấy file của hợp đồng (nếu có)
    const file = await this.fileHeThongService.layFile({
      module: 'HOP_DONG',
      ban_ghi_id: id,
      ten_truong: 'file_hop_dong',
    });

    return {
      ...result,
      file_hop_dong: file,
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

    return await this.hopDongRepository.save(hopDong);
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
