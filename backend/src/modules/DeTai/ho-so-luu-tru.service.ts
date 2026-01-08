import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HoSoLuuTru } from './entities/ho-so-luu-tru.entity';
import { CreateHoSoLuuTruDto, UpdateHoSoLuuTruDto } from './dto/de-tai.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';

/**
 * Service xử lý logic cho Hồ Sơ Lưu Trữ
 * Tích hợp upload file giống HopDong
 */
@Injectable()
export class HoSoLuuTruService {
  constructor(
    @InjectRepository(HoSoLuuTru)
    private readonly hoSoLuuTruRepository: Repository<HoSoLuuTru>,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo hồ sơ lưu trữ mới
   * @param deTaiId - ID đề tài
   * @param createDto - Dữ liệu hồ sơ
   * @param ten_file - Tên file (nếu có upload)
   * @returns Hồ sơ vừa tạo
   */
  async tao(
    deTaiId: number,
    createDto: CreateHoSoLuuTruDto,
    ten_file?: string,
  ): Promise<HoSoLuuTru> {
    const hoSo = this.hoSoLuuTruRepository.create({
      ...createDto,
      de_tai_id: deTaiId,
      ten_file: ten_file || null,
    });

    return this.hoSoLuuTruRepository.save(hoSo);
  }

  /**
   * Lấy file của một hồ sơ (có URL)
   * @param hoSoId - ID hồ sơ
   * @returns Thông tin file với URL hoặc null
   */
  async layFileCuaHoSo(hoSoId: number): Promise<any> {
    return await this.fileHeThongService.layFile({
      module: 'DE_TAI',
      ban_ghi_id: hoSoId,
      ten_truong: 'file_ho_so',
    });
  }

  /**
   * Lấy danh sách hồ sơ của đề tài (kèm file info)
   * @param deTaiId - ID đề tài
   * @returns Danh sách hồ sơ
   */
  async layDanhSach(deTaiId: number): Promise<any[]> {
    const danhSach = await this.hoSoLuuTruRepository.find({
      where: { de_tai_id: deTaiId },
      order: { nam: 'DESC' },
    });

    // Lấy file info cho từng hồ sơ
    const dataWithFiles = await Promise.all(
      danhSach.map(async (hoSo) => {
        const file = await this.layFileCuaHoSo(hoSo.id);
        return {
          ...hoSo,
          file_ho_so: file ? {
            id: file.id,
            ten_goc: file.ten_goc,
            url_xem: file.url_xem,
          } : null,
        };
      }),
    );

    return dataWithFiles;
  }

  /**
   * Lấy chi tiết hồ sơ theo ID
   * @param id - ID hồ sơ
   * @returns Hồ sơ lưu trữ
   */
  async layTheoId(id: number): Promise<HoSoLuuTru> {
    const hoSo = await this.hoSoLuuTruRepository.findOne({
      where: { id },
    });

    if (!hoSo) {
      throw new NotFoundException(`Không tìm thấy hồ sơ lưu trữ với id ${id}`);
    }

    return hoSo;
  }

  /**
   * Cập nhật hồ sơ
   * @param id - ID hồ sơ
   * @param updateDto - Dữ liệu cập nhật
   * @param ten_file - Tên file mới (nếu có)
   * @returns Hồ sơ đã cập nhật
   */
  async capNhat(
    id: number,
    updateDto: UpdateHoSoLuuTruDto,
    ten_file?: string,
  ): Promise<HoSoLuuTru> {
    const hoSo = await this.layTheoId(id);
    Object.assign(hoSo, updateDto);

    if (ten_file) {
      hoSo.ten_file = ten_file;
    }

    return this.hoSoLuuTruRepository.save(hoSo);
  }

  /**
   * Xóa hồ sơ (cascade xóa file)
   * @param id - ID hồ sơ
   */
  async xoa(id: number): Promise<void> {
    const hoSo = await this.layTheoId(id);

    // Xóa file nếu có
    try {
      await this.fileHeThongService.xoaFile({
        module: 'DE_TAI',
        ban_ghi_id: id,
        ten_truong: 'file_ho_so',
      });
    } catch (error) {
      console.error('Lỗi xóa file:', error);
      // Tiếp tục xóa hồ sơ dù file lỗi
    }

    await this.hoSoLuuTruRepository.remove(hoSo);
  }
}
