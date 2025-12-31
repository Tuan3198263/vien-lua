import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

/**
 * Entity File Hệ Thống
 * Quản lý thông tin file được upload lên AWS S3
 * Mỗi file được liên kết với 1 module và 1 bản ghi cụ thể
 */
@Entity('file_he_thong')
@Index('idx_module_record', ['module', 'ban_ghi_id'])
@Index('idx_module', ['module'])
@Unique('unique_file_field', ['module', 'ban_ghi_id', 'ten_truong'])
export class FileHeThong {
  /**
   * ID tự tăng - Khóa chính
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Tên file gốc do người dùng upload
   * Ví dụ: hop-dong-abc.pdf
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  ten_goc: string;

  /**
   * Tên file được lưu trên S3 (unique)
   * Ví dụ: hop-dong-abc_1640995200000_a1b2c3d4.pdf
   */
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  ten_luu_tru: string;

  /**
   * Đường dẫn đầy đủ trên S3
   * Ví dụ: vien-lua-files/hop-dong-abc_1640995200000_a1b2c3d4.pdf
   */
  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  duong_dan_s3: string;

  /**
   * Kích thước file (bytes)
   */
  @Column({
    type: 'int',
    nullable: false,
  })
  kich_thuoc: number;

  /**
   * Loại file - MIME type
   * Ví dụ: application/pdf, image/png, text/plain...
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  loai_file: string;

  /**
   * Tên module sử dụng file
   * Ví dụ: HOP_DONG, NHAN_VIEN, SAN_PHAM...
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  module: string;

  /**
   * ID của bản ghi trong module
   * Ví dụ: id của bảng hop_dong, nhan_vien...
   */
  @Column({
    type: 'int',
    nullable: false,
  })
  ban_ghi_id: number;

  /**
   * Tên trường/field trong module
   * Ví dụ: file_hop_dong, anh_dai_dien, file_cv_xin_viec...
   * 
   * Unique constraint với (module, ban_ghi_id, ten_truong)
   * → 1 trường chỉ có thể có 1 file
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ten_truong: string;

  /**
   * ID người cập nhật file
   * Lưu lại ai là người upload file này
   */
  @Column({
    type: 'int',
    nullable: false,
  })
  nguoi_cap_nhat: number;

  /**
   * Ngày tạo file
   */
  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  /**
   * Ngày cập nhật file gần nhất
   */
  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
