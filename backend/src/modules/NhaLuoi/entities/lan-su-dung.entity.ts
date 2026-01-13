import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NhaLuoi } from '../nha-luoi.entity';
import { DeCuongThiNghiem } from '../../DeCuongThiNghiem/entities/de-cuong-thi-nghiem.entity';
import { NguoiDung } from '../../NguoiDung/nguoi-dung.entity';

/**
 * Entity Lần Sử Dụng
 * Lưu thông tin lịch sử sử dụng nhà lưới cho đề cương thí nghiệm
 */
@Entity('lan_su_dung')
export class LanSuDung {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nhà lưới liên quan - bắt buộc
   */
  @ManyToOne(() => NhaLuoi, (nhaLuoi) => nhaLuoi.danh_sach_lan_su_dung, {
    nullable: false,
  })
  @JoinColumn({ name: 'nha_luoi_id' })
  nhaLuoi: NhaLuoi;

  @Column({ type: 'int' })
  nha_luoi_id: number;

  /**
   * Đề cương thí nghiệm liên quan - bắt buộc
   */
  @ManyToOne(() => DeCuongThiNghiem, { nullable: false })
  @JoinColumn({ name: 'de_cuong_thi_nghiem_id' })
  deCuongThiNghiem: DeCuongThiNghiem;

  @Column({ type: 'int' })
  de_cuong_thi_nghiem_id: number;

  /**
   * Dụng cụ sử dụng - tùy chọn
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  dung_cu: string;

  /**
   * Số lượng - tùy chọn
   */
  @Column({
    type: 'int',
    nullable: true,
  })
  so_luong: number;

  /**
   * Ngày mượn - tùy chọn
   */
  @Column({
    type: 'date',
    nullable: true,
  })
  ngay_muon: Date;

  /**
   * Ngày trả - tùy chọn
   */
  @Column({
    type: 'date',
    nullable: true,
  })
  ngay_tra: Date;

  /**
   * Khấu hao - tùy chọn
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  khau_hao: number;

  /**
   * Hiện trạng - tùy chọn
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  hien_trang: string;

  /**
   * Tên file đính kèm (nếu có)
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  ten_file: string;

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
   * Ngày tạo
   */
  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  /**
   * Ngày cập nhật gần nhất
   */
  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
