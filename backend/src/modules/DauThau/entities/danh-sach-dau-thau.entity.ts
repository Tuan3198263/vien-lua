import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DauThau } from './dau-thau.entity';

/**
 * Entity Danh Sách Đấu Thầu
 * Chi tiết các lần đấu thầu (có thể upload file đính kèm)
 */
@Entity('danh_sach_dau_thau')
export class DanhSachDauThau {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Năm
   */
  @Column({ type: 'int' })
  nam: number;

  /**
   * Kinh phí
   */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  kinh_phi: number;

  /**
   * Hình thức đấu thầu
   */
  @Column({ type: 'varchar', length: 255 })
  hinh_thuc: string;

  /**
   * Bước (VD: Bước 1, Bước 2...)
   */
  @Column({ type: 'varchar', length: 100 })
  buoc: string;

  /**
   * Trạng thái (VD: Đang thực hiện, Hoàn thành...)
   */
  @Column({ type: 'varchar', length: 100 })
  trang_thai: string;

  /**
   * Tên file đính kèm (nếu có)
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  ten_file: string;

  // ========== Relations ==========

  /**
   * Đấu thầu chính
   */
  @ManyToOne(() => DauThau, (dt) => dt.danh_sach_dau_thau, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dau_thau_id' })
  dauThau: DauThau;

  @Column({ type: 'int' })
  dau_thau_id: number;

  @CreateDateColumn()
  ngay_tao: Date;

  @UpdateDateColumn()
  ngay_cap_nhat: Date;
}
