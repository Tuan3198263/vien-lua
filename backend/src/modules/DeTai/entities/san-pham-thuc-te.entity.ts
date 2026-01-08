import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeTai } from './de-tai.entity';

@Entity('san_pham_thuc_te')
export class SanPhamThucTe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ten_san_pham: string;

  @ManyToOne(() => DeTai, (dt) => dt.danh_sach_san_pham_thuc_te, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'de_tai_id' })
  deTai: DeTai;

  @Column({ type: 'int' })
  de_tai_id: number;
}
