import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanSuDung } from './entities/lan-su-dung.entity';
import { NhaLuoi } from './nha-luoi.entity';
import { DeCuongThiNghiem } from '../DeCuongThiNghiem/entities/de-cuong-thi-nghiem.entity';
import {
  CreateLanSuDungDto,
  UpdateLanSuDungDto,
} from './dto/nha-luoi.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';

/**
 * Service xử lý logic cho sub-module Lần Sử Dụng
 * Quản lý lịch sử sử dụng nhà lưới cho đề cương thí nghiệm
 */
@Injectable()
export class LanSuDungService {
  constructor(
    @InjectRepository(LanSuDung)
    private lanSuDungRepository: Repository<LanSuDung>,
    @InjectRepository(NhaLuoi)
    private nhaLuoiRepository: Repository<NhaLuoi>,
    @InjectRepository(DeCuongThiNghiem)
    private deCuongThiNghiemRepository: Repository<DeCuongThiNghiem>,
    private fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo lần sử dụng mới
   * @param nhaLuoiId - ID nhà lưới
   * @param createDto - Dữ liệu lần sử dụng cần tạo
   * @param nguoi_cap_nhat_id - ID người tạo
   * @param tenFile - Tên file (nếu có)
   * @returns Lần sử dụng vừa được tạo
   */
  async tao(
    nhaLuoiId: number,
    createDto: CreateLanSuDungDto,
    nguoi_cap_nhat_id: number,
    tenFile?: string,
  ): Promise<any> {
    // Validate nhà lưới tồn tại
    const nhaLuoi = await this.nhaLuoiRepository.findOne({
      where: { id: nhaLuoiId },
    });
    if (!nhaLuoi) {
      throw new NotFoundException(
        `Không tìm thấy nhà lưới với ID ${nhaLuoiId}`,
      );
    }

    // Validate đề cương thí nghiệm tồn tại
    const deCuong = await this.deCuongThiNghiemRepository.findOne({
      where: { id: createDto.de_cuong_thi_nghiem_id },
    });
    if (!deCuong) {
      throw new BadRequestException(
        `Không tìm thấy đề cương thí nghiệm với ID ${createDto.de_cuong_thi_nghiem_id}`,
      );
    }

    const lanSuDung = this.lanSuDungRepository.create({
      ...createDto,
      nha_luoi_id: nhaLuoiId,
      nguoi_cap_nhat_id,
      ten_file: tenFile,
    });

    const saved = await this.lanSuDungRepository.save(lanSuDung);

    // Load lại với relations
    const result = await this.lanSuDungRepository.findOne({
      where: { id: saved.id },
      relations: [
        'nguoi_cap_nhat',
        'nhaLuoi',
        'deCuongThiNghiem',
        'deCuongThiNghiem.deTai',
      ],
    });

    return this.mapRelations(result);
  }

  /**
   * Map thông tin relations (chỉ lấy fields cần thiết)
   * @param lanSuDung - Lần sử dụng có relations
   * @returns Lần sử dụng với relations đã được map
   */
  private mapRelations(lanSuDung: any): any {
    return {
      ...lanSuDung,
      nguoi_cap_nhat: lanSuDung.nguoi_cap_nhat
        ? {
            id: lanSuDung.nguoi_cap_nhat.id,
            ho_ten: lanSuDung.nguoi_cap_nhat.ho_ten,
          }
        : null,
      nhaLuoi: lanSuDung.nhaLuoi
        ? {
            id: lanSuDung.nhaLuoi.id,
            ten_nha_luoi: lanSuDung.nhaLuoi.ten_nha_luoi,
            khu: lanSuDung.nhaLuoi.khu,
          }
        : null,
      deCuongThiNghiem: lanSuDung.deCuongThiNghiem
        ? {
            id: lanSuDung.deCuongThiNghiem.id,
            ten_thi_nghiem: lanSuDung.deCuongThiNghiem.ten_thi_nghiem,
            nguoi_thuc_hien: lanSuDung.deCuongThiNghiem.nguoi_thuc_hien,
            ngay_bat_dau: lanSuDung.deCuongThiNghiem.ngay_bat_dau,
            ngay_ket_thuc: lanSuDung.deCuongThiNghiem.ngay_ket_thuc,
            deTai: lanSuDung.deCuongThiNghiem.deTai
              ? {
                  id: lanSuDung.deCuongThiNghiem.deTai.id,
                  ten_de_tai: lanSuDung.deCuongThiNghiem.deTai.ten_de_tai,
                  cap_quan_ly_de_tai:
                    lanSuDung.deCuongThiNghiem.deTai.cap_quan_ly_de_tai,
                }
              : null,
          }
        : null,
    };
  }

  /**
   * Lấy danh sách lần sử dụng của một nhà lưới
   * Query phức tạp: Join DeCuongThiNghiem và DeTai để lấy thông tin đầy đủ
   * @param nhaLuoiId - ID nhà lưới
   * @returns Danh sách lần sử dụng với thông tin đầy đủ
   */
  async layDanhSach(nhaLuoiId: number): Promise<any[]> {
    // Query builder với nhiều joins
    const danhSach = await this.lanSuDungRepository.find({
      where: { nha_luoi_id: nhaLuoiId },
      relations: [
        'nguoi_cap_nhat',
        'nhaLuoi',
        'deCuongThiNghiem',
        'deCuongThiNghiem.deTai',
      ],
      order: { ngay_tao: 'DESC' },
    });

    // Lấy file cho từng lần sử dụng (parallel)
    const dataWithFiles = await Promise.all(
      danhSach.map(async (item) => {
        const file = await this.layFileCuaLanSuDung(item.id);
        const mapped = this.mapRelations(item);
        return {
          ...mapped,
          file_lan_su_dung: file
            ? {
                id: file.id,
                ten_goc: file.ten_goc,
                url_xem: file.url_xem,
              }
            : null,
        };
      }),
    );

    return dataWithFiles;
  }

  /**
   * Lấy file của một lần sử dụng (có URL)
   * @param lanSuDungId - ID lần sử dụng
   * @returns Thông tin file với URL hoặc null
   */
  private async layFileCuaLanSuDung(lanSuDungId: number): Promise<any> {
    return await this.fileHeThongService.layFile({
      module: 'NHA_LUOI',
      ban_ghi_id: lanSuDungId,
      ten_truong: 'file_lan_su_dung',
    });
  }

  /**
   * Lấy chi tiết lần sử dụng theo ID
   * @param id - ID lần sử dụng
   * @returns Chi tiết lần sử dụng với thông tin đầy đủ
   */
  async layTheoId(id: number): Promise<any> {
    const lanSuDung = await this.lanSuDungRepository.findOne({
      where: { id },
      relations: [
        'nguoi_cap_nhat',
        'nhaLuoi',
        'deCuongThiNghiem',
        'deCuongThiNghiem.deTai',
      ],
    });

    if (!lanSuDung) {
      throw new NotFoundException(`Không tìm thấy lần sử dụng với ID ${id}`);
    }

    // Lấy file (nếu có)
    const file = await this.layFileCuaLanSuDung(id);

    // Map relations
    const mapped = this.mapRelations(lanSuDung);

    return {
      ...mapped,
      file_lan_su_dung: file
        ? {
            id: file.id,
            ten_goc: file.ten_goc,
            url_xem: file.url_xem,
          }
        : null,
    };
  }

  /**
   * Cập nhật lần sử dụng
   * @param id - ID lần sử dụng
   * @param updateDto - Dữ liệu cập nhật
   * @param nguoiCapNhatId - ID người cập nhật
   * @param tenFile - Tên file (nếu có)
   * @returns Lần sử dụng đã cập nhật
   */
  async capNhat(
    id: number,
    updateDto: UpdateLanSuDungDto,
    nguoiCapNhatId: number,
    tenFile?: string,
  ): Promise<any> {
    const lanSuDung = await this.lanSuDungRepository.findOne({ where: { id } });

    if (!lanSuDung) {
      throw new NotFoundException(`Không tìm thấy lần sử dụng với ID ${id}`);
    }

    // Validate đề cương thí nghiệm tồn tại (nếu có update)
    if (updateDto.de_cuong_thi_nghiem_id) {
      const deCuong = await this.deCuongThiNghiemRepository.findOne({
        where: { id: updateDto.de_cuong_thi_nghiem_id },
      });
      if (!deCuong) {
        throw new BadRequestException(
          `Không tìm thấy đề cương thí nghiệm với ID ${updateDto.de_cuong_thi_nghiem_id}`,
        );
      }
    }

    // Cập nhật thông tin
    Object.assign(lanSuDung, updateDto);
    lanSuDung.nguoi_cap_nhat_id = nguoiCapNhatId;
    if (tenFile) {
      lanSuDung.ten_file = tenFile;
    }

    await this.lanSuDungRepository.save(lanSuDung);

    // Load lại với relations
    const result = await this.lanSuDungRepository.findOne({
      where: { id },
      relations: [
        'nguoi_cap_nhat',
        'nhaLuoi',
        'deCuongThiNghiem',
        'deCuongThiNghiem.deTai',
      ],
    });

    return this.mapRelations(result);
  }

  /**
   * Xóa lần sử dụng và file liên quan
   * @param id - ID lần sử dụng cần xóa
   */
  async xoa(id: number): Promise<void> {
    const lanSuDung = await this.lanSuDungRepository.findOne({ where: { id } });

    if (!lanSuDung) {
      throw new NotFoundException(`Không tìm thấy lần sử dụng với ID ${id}`);
    }

    // Xóa file liên quan (nếu có)
    try {
      await this.fileHeThongService.xoaFileCuaBanGhi({
        module: 'NHA_LUOI',
        ban_ghi_id: id,
      });
    } catch (error) {
      console.error('Lỗi khi xóa file lần sử dụng:', error);
      // Không throw error, vẫn tiếp tục xóa bản ghi
    }

    // Xóa bản ghi
    await this.lanSuDungRepository.remove(lanSuDung);
  }
}
