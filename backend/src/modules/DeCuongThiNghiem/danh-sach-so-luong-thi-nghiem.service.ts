import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanhSachSoLuongThiNghiem } from './entities/danh-sach-so-luong-thi-nghiem.entity';
import { 
  CreateDanhSachSoLuongThiNghiemDto, 
  UpdateDanhSachSoLuongThiNghiemDto 
} from './dto/de-cuong-thi-nghiem.dto';

/**
 * Service xử lý logic cho Danh Sách Số Lượng Thí Nghiệm
 */
@Injectable()
export class DanhSachSoLuongThiNghiemService {
  constructor(
    @InjectRepository(DanhSachSoLuongThiNghiem)
    private readonly danhSachSoLuongThiNghiemRepository: Repository<DanhSachSoLuongThiNghiem>,
  ) {}

  /**
   * Tạo danh sách số lượng thí nghiệm mới
   * @param deCuongId - ID đề cương thí nghiệm chính
   * @param createDto - Dữ liệu danh sách số lượng
   * @returns Danh sách số lượng vừa tạo
   */
  async tao(
    deCuongId: number,
    createDto: CreateDanhSachSoLuongThiNghiemDto,
  ): Promise<DanhSachSoLuongThiNghiem> {
    const danhSach = this.danhSachSoLuongThiNghiemRepository.create({
      ...createDto,
      de_cuong_thi_nghiem_id: deCuongId,
    });

    return this.danhSachSoLuongThiNghiemRepository.save(danhSach);
  }

  /**
   * Lấy danh sách số lượng của một đề cương thí nghiệm
   * @param deCuongId - ID đề cương thí nghiệm chính
   * @returns Danh sách số lượng thí nghiệm
   */
  async layDanhSach(deCuongId: number): Promise<DanhSachSoLuongThiNghiem[]> {
    return await this.danhSachSoLuongThiNghiemRepository.find({
      where: { de_cuong_thi_nghiem_id: deCuongId },
      order: { id: 'ASC' },
    });
  }

  /**
   * Lấy chi tiết danh sách số lượng thí nghiệm theo ID
   * @param id - ID danh sách số lượng
   * @returns Danh sách số lượng thí nghiệm
   */
  async layTheoId(id: number): Promise<DanhSachSoLuongThiNghiem> {
    const danhSach = await this.danhSachSoLuongThiNghiemRepository.findOne({
      where: { id },
    });

    if (!danhSach) {
      throw new NotFoundException(`Không tìm thấy danh sách số lượng thí nghiệm với id ${id}`);
    }

    return danhSach;
  }

  /**
   * Cập nhật danh sách số lượng thí nghiệm
   * @param id - ID danh sách số lượng
   * @param updateDto - Dữ liệu cập nhật
   * @returns Danh sách số lượng đã cập nhật
   */
  async capNhat(
    id: number,
    updateDto: UpdateDanhSachSoLuongThiNghiemDto,
  ): Promise<DanhSachSoLuongThiNghiem> {
    const danhSach = await this.layTheoId(id);
    Object.assign(danhSach, updateDto);

    return this.danhSachSoLuongThiNghiemRepository.save(danhSach);
  }

  /**
   * Xóa danh sách số lượng thí nghiệm
   * @param id - ID danh sách số lượng
   */
  async xoa(id: number): Promise<void> {
    const danhSach = await this.layTheoId(id);
    await this.danhSachSoLuongThiNghiemRepository.remove(danhSach);
  }
}
