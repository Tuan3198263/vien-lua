import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { NguoiDung } from '../../NguoiDung/nguoi-dung.entity';
import { FileHeThong } from '../../FileHeThong/file-he-thong.entity';
import { KinhPhiNam } from './kinh-phi-nam.entity';
import { SanPham } from './san-pham.entity';
import { SanPhamThucTe } from './san-pham-thuc-te.entity';
import { HoSoLuuTru } from './ho-so-luu-tru.entity';

@Entity('de_tai')
@Index('UQ_DE_TAI_MA', ['ma_de_tai'], { unique: true })
export class DeTai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ten_de_tai: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ma_de_tai: string;

  @Column({ type: 'varchar', length: 255 })
  don_vi_phe_duyet: string;

  @Column({ type: 'varchar', length: 255 })
  cap_quan_ly_de_tai: string;

  @Column({ type: 'date' })
  ngay_bat_dau: Date;

  @Column({ type: 'date' })
  ngay_ket_thuc: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phuong_thuc_khoang_chi: string;

  @Column({ type: 'text', nullable: true })
  noi_dung_khoang_chi: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linh_vuc_khoa_hoc: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nguon_goc_de_tai: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hop_dong: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bien_ban_thanh_ly: string;

  @Column({ type: 'varchar', length: 255 })
  chu_nhiem_de_tai: string;

  @Column({ type: 'varchar', length: 255 })
  thu_ky_de_tai: string;

  @Column({ type: 'text', nullable: true })
  thong_tin_doi_tac: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  kinh_phi_tong: number;

  // Relations
  @OneToMany(() => KinhPhiNam, (kp) => kp.deTai, {
    cascade: true,
  })
  danh_sach_kinh_phi: KinhPhiNam[];

  @OneToMany(() => SanPham, (sp) => sp.deTai, {
    cascade: true,
  })
  danh_sach_san_pham: SanPham[];

  @OneToMany(() => SanPhamThucTe, (sp) => sp.deTai, {
    cascade: true,
  })
  danh_sach_san_pham_thuc_te: SanPhamThucTe[];

  @OneToMany(() => HoSoLuuTru, (hs) => hs.deTai, {
    cascade: true,
  })
  danh_sach_ho_so: HoSoLuuTru[];

  // Audit fields
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
