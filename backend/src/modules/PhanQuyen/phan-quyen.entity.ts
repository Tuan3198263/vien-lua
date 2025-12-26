import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VaiTro } from '../VaiTro/vai-tro.entity';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';

/**
 * Entity Phân Quyền
 * Mapping giữa Vai Trò - Module - Hành Động
 * Định nghĩa vai trò nào có quyền gì trên module nào
 */
@Entity('phan_quyen')
@Index(['vai_tro_id', 'ma_module', 'hanh_dong'], { unique: true }) // Đảm bảo không trùng lặp
export class PhanQuyen {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID vai trò - Foreign key đến bảng vai_tro
   */
  @Column({ name: 'vai_tro_id' })
  vai_tro_id: number;

  /**
   * Vai trò - Relation eager load
   */
  @ManyToOne(() => VaiTro, (vaiTro) => vaiTro.phanQuyen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vai_tro_id' })
  vaiTro: VaiTro;

  /**
   * Mã module - Lưu trực tiếp (không dùng foreign key)
   * Ví dụ: VAI_TRO, NGUOI_DUNG, SAN_PHAM...
   * Validate từ DANH_SACH_MODULE constant
   */
  @Column({ length: 50 })
  ma_module: string;

  /**
   * Hành động được phép thực hiện
   * Là một trong các giá trị của enum HanhDong
   * Không được null
   */
  @Column({
    type: 'enum',
    enum: HanhDong,
    nullable: false,
  })
  hanh_dong: HanhDong;

  /**
   * Ngày tạo - Tự động set khi tạo mới
   */
  @CreateDateColumn({
    type: 'datetime',
  })
  ngay_tao: Date;
}
