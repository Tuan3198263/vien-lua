import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeCuongThiNghiem } from './de-cuong-thi-nghiem.entity';

/**
 * Entity Danh Sách Số Lượng Thí Nghiệm (Sub-module)
 */
@Entity('danh_sach_so_luong_thi_nghiem')
export class DanhSachSoLuongThiNghiem {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Đề cương thí nghiệm cha
   */
  @ManyToOne(() => DeCuongThiNghiem, (dc) => dc.danh_sach_so_luong, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'de_cuong_thi_nghiem_id' })
  deCuongThiNghiem: DeCuongThiNghiem;

  @Column({ type: 'int' })
  de_cuong_thi_nghiem_id: number;

  /**
   * Địa điểm - bắt buộc
   */
  @Column({ type: 'varchar', length: 255 })
  dia_diem: string;

  /**
   * Vị trí - bắt buộc
   */
  @Column({ type: 'varchar', length: 255 })
  vi_tri: string;

  /**
   * Diện tích - bắt buộc
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dien_tich: number;
}
