import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeTai } from './de-tai.entity';

@Entity('ho_so_luu_tru')
export class HoSoLuuTru {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  loai_ho_so: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ten_file: string;

  @Column({ type: 'int' })
  nam: number;

  @ManyToOne(() => DeTai, (dt) => dt.danh_sach_ho_so, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'de_tai_id' })
  deTai: DeTai;

  @Column({ type: 'int' })
  de_tai_id: number;
}
