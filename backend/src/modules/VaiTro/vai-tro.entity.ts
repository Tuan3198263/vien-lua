import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PhanQuyen } from '../PhanQuyen/phan-quyen.entity';

/**
 * Entity Vai Trò
 * Quản lý các vai trò trong hệ thống (Admin, User, Manager...)
 */
@Entity('vai_tro')
export class VaiTro {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Mã vai trò - Dùng để phân biệt trong code (ADMIN, USER, MANAGER...)
   * Unique và không được null
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  ma_vai_tro: string;

  /**
   * Tên vai trò - Hiển thị cho người dùng
   * Không được null
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ten_vai_tro: string;

  /**
   * Mô tả về vai trò
   * Có thể null
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  mo_ta: string;

  /**
   * Danh sách phân quyền của vai trò này
   * Relation OneToMany với PhanQuyen
   */
  @OneToMany(() => PhanQuyen, (phanQuyen) => phanQuyen.vaiTro, { cascade: true })
  phanQuyen: PhanQuyen[];

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
