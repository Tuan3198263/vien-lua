import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhanQuyen } from './phan-quyen.entity';
import { VaiTroService } from '../VaiTro/vai-tro.service';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { DANH_SACH_MODULE } from '../../shared/constants/modules.constant';

/**
 * Interface cho response quyền của vai trò
 */
export interface QuyenCuaVaiTro {
  vai_tro_id: number;
  ten_vai_tro: string;
  quyen: {
    ma_module: string;
    ten_module: string;
    hanh_dong: HanhDong[];
  }[];
}

/**
 * Service xử lý logic cho module Phân Quyền
 */
@Injectable()
export class PhanQuyenService {
  constructor(
    @InjectRepository(PhanQuyen)
    private phanQuyenRepository: Repository<PhanQuyen>,
    private vaiTroService: VaiTroService,
  ) {}

  /**
   * Lấy danh sách quyền của một vai trò
   * Trả về theo cấu trúc: module -> danh sách hành động
   */
  async layQuyenCuaVaiTro(vaiTroId: number): Promise<QuyenCuaVaiTro> {
    // Validate vai trò tồn tại
    const vaiTro = await this.vaiTroService.findOne(vaiTroId);

    // Lấy tất cả quyền của vai trò
    const phanQuyenList = await this.phanQuyenRepository.find({
      where: { vai_tro_id: vaiTroId },
    });

    // Group theo module
    const moduleMap = new Map<string, {
      ma_module: string;
      ten_module: string;
      hanh_dong: HanhDong[];
    }>();

    for (const phanQuyen of phanQuyenList) {
      const maModule = phanQuyen.ma_module;
      
      if (!moduleMap.has(maModule)) {
        // Tìm thông tin module từ constants
        const moduleInfo = DANH_SACH_MODULE.find(m => m.ma_module === maModule);
        
        moduleMap.set(maModule, {
          ma_module: maModule,
          ten_module: moduleInfo?.ten_module || maModule,
          hanh_dong: [],
        });
      }
      
      moduleMap.get(maModule).hanh_dong.push(phanQuyen.hanh_dong);
    }

    return {
      vai_tro_id: vaiTro.id,
      ten_vai_tro: vaiTro.ten_vai_tro,
      quyen: Array.from(moduleMap.values()),
    };
  }

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
   * Xóa một quyền cụ thể
   */
  async remove(id: number): Promise<{ message: string }> {
    const phanQuyen = await this.phanQuyenRepository.findOne({
      where: { id },
    });

    if (!phanQuyen) {
      throw new NotFoundException(`Không tìm thấy quyền với ID ${id}`);
    }

    await this.phanQuyenRepository.remove(phanQuyen);

    return { message: 'Xóa quyền thành công' };
  }

  /**
   * Xóa tất cả quyền của một vai trò
   */
  async removeByVaiTro(vaiTroId: number): Promise<{ message: string; count: number }> {
    const result = await this.phanQuyenRepository.delete({ vai_tro_id: vaiTroId });

    return {
      message: `Đã xóa ${result.affected || 0} quyền của vai trò`,
      count: result.affected || 0,
    };
  }

  /**
   * Lấy danh sách tất cả module (từ constants)
   * Dùng cho frontend hiển thị danh sách module khi tạo/sửa vai trò
   */
  async layDanhSachModule() {
    return DANH_SACH_MODULE;
  }
}
