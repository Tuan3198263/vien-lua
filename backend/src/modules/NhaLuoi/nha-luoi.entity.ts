import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NguoiDung } from '../NguoiDung/nguoi-dung.entity';

/**
 * Entity Nhà Lưới
 * Quản lý thông tin nhà lưới trong hệ thống
 */
@Entity('nha_luoi')
export class NhaLuoi {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Tên nhà lưới
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  ten_nha_luoi: string;

  /**
   * Khu vực
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  khu: string;

  /**
   * Số bể
   */
  @Column({
    type: 'int',
    nullable: false,
  })
  so_be: number;

  /**
   * Diện tích (m2)
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  dien_tich: number;

  /**
   * Địa điểm
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  dia_diem: string;

  /**
   * ID người cập nhật gần nhất
   */
  @Column({
    type: 'int',
    nullable: false,
  })
  nguoi_cap_nhat_id: number;

  /**
   * Quan hệ với Người Dùng (người cập nhật)
   */
  @ManyToOne(() => NguoiDung, { nullable: false })
  @JoinColumn({ name: 'nguoi_cap_nhat_id' })
  nguoi_cap_nhat: NguoiDung;

  /**
   * Ngày tạo nhà lưới
   */
  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  /**
   * Ngày cập nhật nhà lưới gần nhất
   */
  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
