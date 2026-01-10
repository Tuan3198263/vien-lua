import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { NguoiDung } from '../../NguoiDung/nguoi-dung.entity';
import { DeTai } from '../../DeTai/entities/de-tai.entity';
import { DanhSachDauThau } from './danh-sach-dau-thau.entity';

/**
 * Entity Đấu Thầu
 * Lưu thông tin đấu thầu của một đề tài
 */
@Entity('dau_thau')
export class DauThau {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Năm thực hiện
   */
  @Column({ type: 'int' })
  nam_thuc_hien: number;

  /**
   * Nguồn kinh phí
   */
  @Column({ type: 'varchar', length: 255 })
  nguon_kinh_phi: string;

  /**
   * Tổng kinh phí
   */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  tong_kinh_phi: number;

  // ========== Relations ==========

  /**
   * Đề tài liên quan
   */
  @ManyToOne(() => DeTai, { nullable: false })
  @JoinColumn({ name: 'de_tai_id' })
  deTai: DeTai;

  @Column({ type: 'int' })
  de_tai_id: number;

  /**
   * Danh sách đấu thầu con
   */
  @OneToMany(() => DanhSachDauThau, (ds) => ds.dauThau, {
    cascade: true,
  })
  danh_sach_dau_thau: DanhSachDauThau[];

  // ========== Audit Fields ==========

  /**
   * Người cập nhật cuối cùng
   */
  @ManyToOne(() => NguoiDung, { nullable: true })
  @JoinColumn({ name: 'nguoi_cap_nhat_id' })
  nguoi_cap_nhat: NguoiDung;

  @Column({ type: 'int', nullable: true })
  nguoi_cap_nhat_id: number;

  @CreateDateColumn()
  ngay_tao: Date;

  @UpdateDateColumn()
  ngay_cap_nhat: Date;
}
