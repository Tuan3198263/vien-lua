import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VaiTro } from './vai-tro.entity';
import { CreateVaiTroDto, UpdateVaiTroDto } from './dto/vai-tro.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';

/**
 * Service xử lý logic cho module Vai Trò
 */
@Injectable()
export class VaiTroService {
  constructor(
    @InjectRepository(VaiTro)
    private vaiTroRepository: Repository<VaiTro>,
  ) {}

  /**
   * Tạo vai trò mới
   * @param createVaiTroDto - Dữ liệu vai trò cần tạo
   * @returns Vai trò vừa được tạo
   */
  async create(createVaiTroDto: CreateVaiTroDto): Promise<VaiTro> {
    // Kiểm tra mã vai trò đã tồn tại chưa
    const existing = await this.vaiTroRepository.findOne({
      where: { ma_vai_tro: createVaiTroDto.ma_vai_tro },
    });

    if (existing) {
      throw new ConflictException('Mã vai trò đã tồn tại');
    }

    // Tạo entity mới
    const vaiTro = this.vaiTroRepository.create(createVaiTroDto);

    // Lưu vào database
    return await this.vaiTroRepository.save(vaiTro);
  }

  /**
   * Lấy danh sách vai trò với phân trang, lọc, sắp xếp
   * @param paginationDto - Thông tin phân trang
   * @returns Danh sách vai trò với metadata phân trang
   */
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<VaiTro>> {
    // Tạo query builder
    const queryBuilder = this.vaiTroRepository.createQueryBuilder('vai_tro');

    // Áp dụng tìm kiếm, sắp xếp, phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'vai_tro',
      ['ma_vai_tro', 'ten_vai_tro', 'mo_ta'], // Các trường có thể tìm kiếm
      'ngay_tao', // Trường sắp xếp mặc định
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [data, total] = await queryBuilder.getManyAndCount();

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(data, total, paginationDto);
  }

  /**
   * Lấy một vai trò theo ID
   * @param id - ID của vai trò
   * @returns Vai trò tìm được
   */
  async findOne(id: number): Promise<VaiTro> {
    const vaiTro = await this.vaiTroRepository.findOne({
      where: { id },
    });

    if (!vaiTro) {
      throw new NotFoundException(`Không tìm thấy vai trò với ID ${id}`);
    }

    return vaiTro;
  }

  /**
   * Tìm vai trò theo mã vai trò
   * @param maVaiTro - Mã vai trò cần tìm
   * @returns Vai trò tìm được hoặc null
   */
  async findByMaVaiTro(maVaiTro: string): Promise<VaiTro | null> {
    return await this.vaiTroRepository.findOne({
      where: { ma_vai_tro: maVaiTro },
    });
  }

  /**
   * Cập nhật vai trò
   * @param id - ID của vai trò cần cập nhật
   * @param updateVaiTroDto - Dữ liệu cập nhật
   * @returns Vai trò sau khi cập nhật
   */
  async update(id: number, updateVaiTroDto: UpdateVaiTroDto): Promise<VaiTro> {
    // Kiểm tra vai trò có tồn tại không
    const vaiTro = await this.findOne(id);

    // Nếu cập nhật mã vai trò, kiểm tra trùng lặp
    if (updateVaiTroDto.ma_vai_tro && updateVaiTroDto.ma_vai_tro !== vaiTro.ma_vai_tro) {
      const existing = await this.vaiTroRepository.findOne({
        where: { ma_vai_tro: updateVaiTroDto.ma_vai_tro },
      });

      if (existing) {
        throw new ConflictException('Mã vai trò đã tồn tại');
      }
    }

    // Cập nhật các trường
    Object.assign(vaiTro, updateVaiTroDto);

    // Lưu thay đổi
    return await this.vaiTroRepository.save(vaiTro);
  }

  /**
   * Xóa vai trò
   * @param id - ID của vai trò cần xóa
   * @returns Thông báo xóa thành công
   */
  async remove(id: number): Promise<{ message: string }> {
    // Kiểm tra vai trò có tồn tại không
    const vaiTro = await this.findOne(id);

    // Xóa vai trò
    await this.vaiTroRepository.remove(vaiTro);

    return { message: 'Xóa vai trò thành công' };
  }

  /**
   * Xóa nhiều vai trò
   * @param ids - Danh sách ID các vai trò cần xóa
   * @returns Thông báo xóa thành công
   */
  async removeMultiple(ids: number[]): Promise<{ message: string; count: number }> {
    const result = await this.vaiTroRepository.delete(ids);

    return {
      message: 'Xóa vai trò thành công',
      count: result.affected || 0,
    };
  }
}
