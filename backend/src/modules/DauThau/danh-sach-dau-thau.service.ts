import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanhSachDauThau } from './entities/danh-sach-dau-thau.entity';
import { CreateDanhSachDauThauDto, UpdateDanhSachDauThauDto } from './dto/dau-thau.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';

/**
 * Service xử lý logic cho Danh Sách Đấu Thầu
 * Tích hợp upload file giống HoSoLuuTru
 */
@Injectable()
export class DanhSachDauThauService {
  constructor(
    @InjectRepository(DanhSachDauThau)
    private readonly danhSachDauThauRepository: Repository<DanhSachDauThau>,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo danh sách đấu thầu mới
   * @param dauThauId - ID đấu thầu chính
   * @param createDto - Dữ liệu danh sách đấu thầu
   * @param ten_file - Tên file (nếu có upload)
   * @returns Danh sách đấu thầu vừa tạo
   */
  async tao(
    dauThauId: number,
    createDto: CreateDanhSachDauThauDto,
    ten_file?: string,
  ): Promise<DanhSachDauThau> {
    const danhSach = this.danhSachDauThauRepository.create({
      ...createDto,
      dau_thau_id: dauThauId,
      ten_file: ten_file || null,
    });

    return this.danhSachDauThauRepository.save(danhSach);
  }

  /**
   * Lấy file của một danh sách đấu thầu (có URL)
   * @param danhSachId - ID danh sách đấu thầu
   * @returns Thông tin file với URL hoặc null
   */
  async layFileCuaDanhSach(danhSachId: number): Promise<any> {
    return await this.fileHeThongService.layFile({
      module: 'DAU_THAU',
      ban_ghi_id: danhSachId,
      ten_truong: 'file_dau_thau',
    });
  }

  /**
   * Lấy danh sách đấu thầu của một đấu thầu chính (kèm file info)
   * @param dauThauId - ID đấu thầu chính
   * @returns Danh sách đấu thầu
   */
  async layDanhSach(dauThauId: number): Promise<any[]> {
    const danhSach = await this.danhSachDauThauRepository.find({
      where: { dau_thau_id: dauThauId },
      order: { nam: 'DESC' },
    });

    // Lấy file info cho từng danh sách
    const dataWithFiles = await Promise.all(
      danhSach.map(async (ds) => {
        const file = await this.layFileCuaDanhSach(ds.id);
        return {
          ...ds,
          file_dau_thau: file ? {
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
   * Lấy chi tiết danh sách đấu thầu theo ID
   * @param id - ID danh sách đấu thầu
   * @returns Danh sách đấu thầu
   */
  async layTheoId(id: number): Promise<DanhSachDauThau> {
    const danhSach = await this.danhSachDauThauRepository.findOne({
      where: { id },
    });

    if (!danhSach) {
      throw new NotFoundException(`Không tìm thấy danh sách đấu thầu với id ${id}`);
    }

    return danhSach;
  }

  /**
   * Cập nhật danh sách đấu thầu
   * @param id - ID danh sách đấu thầu
   * @param updateDto - Dữ liệu cập nhật
   * @param ten_file - Tên file mới (nếu có)
   * @returns Danh sách đấu thầu đã cập nhật
   */
  async capNhat(
    id: number,
    updateDto: UpdateDanhSachDauThauDto,
    ten_file?: string,
  ): Promise<DanhSachDauThau> {
    const danhSach = await this.layTheoId(id);
    Object.assign(danhSach, updateDto);

    if (ten_file) {
      danhSach.ten_file = ten_file;
    }

    return this.danhSachDauThauRepository.save(danhSach);
  }

  /**
   * Xóa danh sách đấu thầu (bao gồm cả file)
   * @param id - ID danh sách đấu thầu
   */
  async xoa(id: number): Promise<void> {
    const danhSach = await this.layTheoId(id);

    // Xóa file nếu có
    try {
      await this.fileHeThongService.xoaFile({
        module: 'DAU_THAU',
        ban_ghi_id: id,
        ten_truong: 'file_dau_thau',
      });
    } catch (error) {
      console.error('Lỗi xóa file:', error);
      // Tiếp tục xóa danh sách dù file lỗi
    }

    await this.danhSachDauThauRepository.remove(danhSach);
  }
}
