import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhanQuyen } from './phan-quyen.entity';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { DANH_SACH_MODULE } from '../../shared/constants/modules.constant';

/**
 * Service xử lý logic cho module Phân Quyền
 * Chỉ chứa 2 methods cần thiết:
 * - kiemTraQuyen: Kiểm tra quyền của vai trò
 * - layDanhSachModule: Lấy danh sách module từ constants
 */
@Injectable()
export class PhanQuyenService {
  constructor(
    @InjectRepository(PhanQuyen)
    private phanQuyenRepository: Repository<PhanQuyen>,
  ) {}

  /**
   * Kiểm tra vai trò có quyền thực hiện hành động trên module không
   * Logic mới:
   * - XEM: Mặc định luôn trả về true (không cần bản ghi DB)
   * - THAO_TAC: Kiểm tra có bản ghi trong DB không
   *   + Nếu có THAO_TAC => có toàn quyền (xem, thêm, sửa, xóa)
   */
  async kiemTraQuyen(
    vaiTroId: number,
    maModule: string,
    hanhDong: HanhDong,
  ): Promise<boolean> {
    // Nếu yêu cầu quyền XEM, mặc định cho phép
    if (hanhDong === HanhDong.XEM) {
      return true;
    }

    // Nếu yêu cầu quyền THAO_TAC, kiểm tra trong DB
    const count = await this.phanQuyenRepository.count({
      where: {
        vai_tro_id: vaiTroId,
        ma_module: maModule,
        hanh_dong: HanhDong.THAO_TAC,
      },
    });

    return count > 0;
  }

  /**
   * Lấy danh sách tất cả module (từ constants)
   * Dùng cho frontend hiển thị danh sách module khi tạo/sửa vai trò
   */
  async layDanhSachModule() {
    return DANH_SACH_MODULE;
  }
}
