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
 * Entity Hợp Đồng
 * Quản lý thông tin hợp đồng trong hệ thống
 */
@Entity('hop_dong')
export class HopDong {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Số hợp đồng - Unique
   * Ví dụ: HD-2025-001, HD-2025-002
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  so_hop_dong: string;

  /**
   * Tên đối tác ký hợp đồng
   * Có thể là công ty hoặc cá nhân
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  doi_tac: string;

  /**
   * Ghi chú về hợp đồng
   * Mô tả ngắn gọn nội dung, điều khoản đặc biệt...
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  ghi_chu: string;

  /**
   * ID người cập nhật hợp đồng gần nhất
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
   * Ngày tạo hợp đồng
   */
  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  /**
   * Ngày cập nhật hợp đồng gần nhất
   */
  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
