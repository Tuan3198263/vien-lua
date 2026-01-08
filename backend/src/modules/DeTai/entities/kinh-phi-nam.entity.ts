import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeTai } from './de-tai.entity';

@Entity('kinh_phi_nam')
export class KinhPhiNam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  nam: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  kinh_phi: number;

  @ManyToOne(() => DeTai, (dt) => dt.danh_sach_kinh_phi, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'de_tai_id' })
  deTai: DeTai;

  @Column({ type: 'int' })
  de_tai_id: number;
}
