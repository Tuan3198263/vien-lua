import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VaiTro } from '../VaiTro/vai-tro.entity';
import { GioiTinh } from '../../shared/constants/app.constants';

/**
 * Entity Người Dùng
 * Quản lý thông tin người dùng trong hệ thống
 */
@Entity('nguoi_dung')
export class NguoiDung {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Tài khoản đăng nhập - Unique
   * Không được null, tối đa 50 ký tự
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  tai_khoan: string;

  /**
   * Mật khẩu đã được hash (bcrypt)
   * Không được null
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false, // Không select mật khẩu mặc định
  })
  mat_khau: string;

  /**
   * Họ và tên người dùng
   * Không được null, tối đa 100 ký tự
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ho_ten: string;

  /**
   * Email - Unique
   * Không được null, tối đa 100 ký tự
   */
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  email: string;

  /**
   * Số điện thoại
   * Tùy chọn, tối đa 20 ký tự
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  sdt: string;

  /**
   * Ngày sinh
   * Tùy chọn
   */
  @Column({
    type: 'date',
    nullable: true,
  })
  ngay_sinh: Date;

  /**
   * Giới tính (Nam, Nữ, Khác)
   * Tùy chọn
   */
  @Column({
    type: 'enum',
    enum: GioiTinh,
    nullable: true,
  })
  gioi_tinh: GioiTinh;

  /**
   * Địa chỉ
   * Tùy chọn, tối đa 255 ký tự
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  dia_chi: string;

  /**
   * Ghi chú
   * Tùy chọn, tối đa 255 ký tự
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  ghi_chu: string;

  /**
   * Vai trò - Khóa ngoại tham chiếu đến bảng vai_tro
   * Không được null
   */
  @ManyToOne(() => VaiTro, { eager: true })
  @JoinColumn({ name: 'vai_tro_id' })
  vai_tro: VaiTro;

  /**
   * Ngày tạo - Tự động set khi tạo mới
   */
  @CreateDateColumn({
    type: 'datetime',
  })
  ngay_tao: Date;

  /**
   * Ngày cập nhật - Tự động cập nhật khi sửa
   */
  @UpdateDateColumn({
    type: 'datetime',
  })
  ngay_cap_nhat: Date;
}
