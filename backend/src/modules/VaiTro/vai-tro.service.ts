import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VaiTro } from './vai-tro.entity';
import { CreateVaiTroDto, UpdateVaiTroDto } from './dto/vai-tro.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import { PhanQuyen } from '../PhanQuyen/phan-quyen.entity';
import { kiemTraMaModule } from '../../shared/constants/modules.constant';

/**
 * Service xử lý logic cho module Vai Trò
 */
@Injectable()
export class VaiTroService {
  constructor(
    @InjectRepository(VaiTro)
    private vaiTroRepository: Repository<VaiTro>,
    @InjectRepository(PhanQuyen)
    private phanQuyenRepository: Repository<PhanQuyen>,
  ) {}

  /**
   * Tạo vai trò mới (kèm phân quyền)
   * @param createVaiTroDto - Dữ liệu vai trò và quyền cần tạo
   * @returns Vai trò vừa được tạo kèm quyền
   */
  async create(createVaiTroDto: CreateVaiTroDto): Promise<VaiTro> {
    // Kiểm tra mã vai trò đã tồn tại chưa
    const existing = await this.vaiTroRepository.findOne({
      where: { ma_vai_tro: createVaiTroDto.ma_vai_tro },
    });

    if (existing) {
      throw new ConflictException('Mã vai trò đã tồn tại');
    }

    // Validate mã module trong permissions nếu có
    if (createVaiTroDto.permissions && createVaiTroDto.permissions.length > 0) {
      for (const perm of createVaiTroDto.permissions) {
        if (!kiemTraMaModule(perm.ma_module)) {
          throw new BadRequestException(`Mã module '${perm.ma_module}' không hợp lệ`);
        }
      }
    }

    // Tạo vai trò mới
    const vaiTro = this.vaiTroRepository.create({
      ma_vai_tro: createVaiTroDto.ma_vai_tro,
      ten_vai_tro: createVaiTroDto.ten_vai_tro,
      mo_ta: createVaiTroDto.mo_ta,
    });

    // Lưu vai trò
    const savedVaiTro = await this.vaiTroRepository.save(vaiTro);

    // Tạo phân quyền nếu có
    if (createVaiTroDto.permissions && createVaiTroDto.permissions.length > 0) {
      const phanQuyenList: PhanQuyen[] = [];

      for (const perm of createVaiTroDto.permissions) {
        for (const hanhDong of perm.hanh_dong) {
          const phanQuyen = this.phanQuyenRepository.create({
            vai_tro_id: savedVaiTro.id,
            ma_module: perm.ma_module,
            hanh_dong: hanhDong,
          });
          phanQuyenList.push(phanQuyen);
        }
      }

      await this.phanQuyenRepository.save(phanQuyenList);
    }

    // Trả về vai trò kèm quyền
    return await this.vaiTroRepository.findOne({
      where: { id: savedVaiTro.id },
      relations: ['phanQuyen'],
    });
  }

  /**
   * Lấy danh sách vai trò với phân trang và lọc theo field
   * Không còn hỗ trợ sort động, mặc định sort theo ngay_tao DESC
   * @param paginationDto - Thông tin phân trang và filter
   * @returns Danh sách vai trò với metadata phân trang
   */
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<VaiTro>> {
    // Tạo query builder
    const queryBuilder = this.vaiTroRepository.createQueryBuilder('vai_tro');

    // Các field được phép filter (trừ id)
    const allowedFields = ['ma_vai_tro', 'ten_vai_tro', 'mo_ta', 'ngay_cap_nhat'];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'vai_tro',
      allowedFields,
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [data, total] = await queryBuilder.getManyAndCount();

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(data, total, paginationDto);
  }

  /**
   * Lấy một vai trò theo ID (kèm quyền)
   * @param id - ID của vai trò
   * @returns Vai trò tìm được kèm danh sách quyền
   */
  async findOne(id: number): Promise<VaiTro> {
    const vaiTro = await this.vaiTroRepository.findOne({
      where: { id },
      relations: ['phanQuyen'],
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
   * Cập nhật vai trò (kèm phân quyền)
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

    // Validate mã module trong permissions nếu có
    if (updateVaiTroDto.permissions) {
      for (const perm of updateVaiTroDto.permissions) {
        if (!kiemTraMaModule(perm.ma_module)) {
          throw new BadRequestException(`Mã module '${perm.ma_module}' không hợp lệ`);
        }
      }
    }

    // Cập nhật các trường của vai trò
    if (updateVaiTroDto.ma_vai_tro) vaiTro.ma_vai_tro = updateVaiTroDto.ma_vai_tro;
    if (updateVaiTroDto.ten_vai_tro) vaiTro.ten_vai_tro = updateVaiTroDto.ten_vai_tro;
    if (updateVaiTroDto.mo_ta !== undefined) vaiTro.mo_ta = updateVaiTroDto.mo_ta;

    // Lưu vai trò
    await this.vaiTroRepository.save(vaiTro);

    // Nếu có cập nhật permissions, xóa quyền cũ và tạo quyền mới
    if (updateVaiTroDto.permissions) {
      // Xóa tất cả quyền cũ của vai trò này
      await this.phanQuyenRepository.delete({ vai_tro_id: id });

      // Tạo quyền mới
      if (updateVaiTroDto.permissions.length > 0) {
        const phanQuyenList: PhanQuyen[] = [];

        for (const perm of updateVaiTroDto.permissions) {
          for (const hanhDong of perm.hanh_dong) {
            const phanQuyen = this.phanQuyenRepository.create({
              vai_tro_id: id,
              ma_module: perm.ma_module,
              hanh_dong: hanhDong,
            });
            phanQuyenList.push(phanQuyen);
          }
        }

        await this.phanQuyenRepository.save(phanQuyenList);
      }
    }

    // Trả về vai trò kèm quyền
    return await this.vaiTroRepository.findOne({
      where: { id },
      relations: ['phanQuyen'],
    });
  }

  /**
   * Xóa vai trò
   * @param id - ID của vai trò cần xóa
   * @returns Thông báo xóa thành công
   */
  async remove(id: number): Promise<{ message: string }> {
    // Kiểm tra vai trò có tồn tại không
    const vaiTro = await this.findOne(id);

    // Kiểm tra xem có người dùng nào đang sử dụng vai trò này không
    const countNguoiDung = await this.vaiTroRepository.manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('nguoi_dung', 'nguoi_dung')
      .where('nguoi_dung.vai_tro_id = :vaiTroId', { vaiTroId: id })
      .getRawOne();

    if (countNguoiDung && parseInt(countNguoiDung.count) > 0) {
      throw new ConflictException(
        `Không thể xóa vai trò này vì đang có ${countNguoiDung.count} người dùng sử dụng. ` +
        `Vui lòng chuyển người dùng sang vai trò khác trước khi xóa.`
      );
    }

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
    // Kiểm tra từng vai trò trước khi xóa
    for (const id of ids) {
      const countNguoiDung = await this.vaiTroRepository.manager
        .createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('nguoi_dung', 'nguoi_dung')
        .where('nguoi_dung.vai_tro_id = :vaiTroId', { vaiTroId: id })
        .getRawOne();

      if (countNguoiDung && parseInt(countNguoiDung.count) > 0) {
        const vaiTro = await this.vaiTroRepository.findOne({ where: { id } });
        throw new ConflictException(
          `Không thể xóa vai trò "${vaiTro?.ten_vai_tro || id}" vì đang có ${countNguoiDung.count} người dùng sử dụng.`
        );
      }
    }

    const result = await this.vaiTroRepository.delete(ids);

    return {
      message: 'Xóa vai trò thành công',
      count: result.affected || 0,
    };
  }
}
