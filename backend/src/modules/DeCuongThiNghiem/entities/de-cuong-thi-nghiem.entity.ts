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
import { DeTai } from '../../DeTai/entities/de-tai.entity';
import { NguoiDung } from '../../NguoiDung/nguoi-dung.entity';
import { FileHeThong } from '../../FileHeThong/file-he-thong.entity';
import { DanhSachSoLuongThiNghiem } from './danh-sach-so-luong-thi-nghiem.entity';

/**
 * Entity Đề Cương Thí Nghiệm
 */
@Entity('de_cuong_thi_nghiem')
export class DeCuongThiNghiem {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Đề tài liên quan
   */
  @ManyToOne(() => DeTai, { nullable: false })
  @JoinColumn({ name: 'de_tai_id' })
  deTai: DeTai;

  @Column({ type: 'int' })
  de_tai_id: number;

  /**
   * Tên thí nghiệm - bắt buộc
   */
  @Column({ type: 'varchar', length: 255 })
  ten_thi_nghiem: string;

  /**
   * Loại hình thí nghiệm - bắt buộc
   */
  @Column({ type: 'varchar', length: 255 })
  loai_hinh_thi_nghiem: string;

  /**
   * Ngày bắt đầu - bắt buộc
   */
  @Column({ type: 'date' })
  ngay_bat_dau: Date;

  /**
   * Ngày kết thúc - bắt buộc
   */
  @Column({ type: 'date' })
  ngay_ket_thuc: Date;

  /**
   * Mùa vụ - bắt buộc
   */
  @Column({ type: 'varchar', length: 255 })
  mua_vu: string;

  /**
   * Người thực hiện - bắt buộc
   */
  @Column({ type: 'varchar', length: 255 })
  nguoi_thuc_hien: string;

  /**
   * Kinh phí kỹ thuật - bắt buộc
   */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  kinh_phi_ky_thuat: number;

  /**
   * Kinh phí lao động - bắt buộc
   */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  kinh_phi_lao_dong: number;

  /**
   * Kinh phí nguyên vật liệu - bắt buộc
   */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  kinh_phi_nguyen_vat_lieu: number;

  /**
   * File đề cương (optional)
   * Không dùng eager loading, load động qua service
   */
  @ManyToOne(() => FileHeThong, { nullable: true })
  @JoinColumn({ name: 'file_de_cuong_id' })
  file_de_cuong: FileHeThong;

  @Column({ type: 'int', nullable: true })
  file_de_cuong_id: number;

  /**
   * Danh sách số lượng thí nghiệm (sub-module)
   */
  @OneToMany(
    () => DanhSachSoLuongThiNghiem,
    (ds) => ds.deCuongThiNghiem,
    { cascade: true },
  )
  danh_sach_so_luong: DanhSachSoLuongThiNghiem[];

  /**
   * Người cập nhật cuối
   */
  @ManyToOne(() => NguoiDung, { nullable: true })
  @JoinColumn({ name: 'nguoi_cap_nhat_id' })
  nguoi_cap_nhat: NguoiDung;

  @Column({ type: 'int', nullable: true })
  nguoi_cap_nhat_id: number;

  /**
   * Ngày tạo
   */
  @CreateDateColumn()
  ngay_tao: Date;

  /**
   * Ngày cập nhật
   */
  @UpdateDateColumn()
  ngay_cap_nhat: Date;
}
